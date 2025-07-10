import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentNotification, PaymentStatus, PaymentGatewayConfig } from './types'

interface PeachPaymentRequest {
  entityId: string
  amount: string
  currency: string
  paymentType: string
  customer: {
    email: string
    givenName: string
    surname: string
    mobile?: string
  }
  billing: {
    street1: string
    city: string
    state: string
    country: string
    postcode: string
  }
  customParameters: {
    orderId: string
    description: string
  }
  shopperResultUrl: string
  notificationUrl: string
}

interface PeachPaymentResponse {
  id: string
  paymentType: string
  amount: string
  currency: string
  descriptor: string
  result: {
    code: string
    description: string
  }
  redirect: {
    url: string
    parameters: Array<{
      name: string
      value: string
    }>
  }
  customParameters: Record<string, string>
}

interface PeachWebhookData {
  id: string
  paymentType: string
  amount: string
  currency: string
  descriptor: string
  result: {
    code: string
    description: string
  }
  customParameters: Record<string, string>
  timestamp: string
}

export class PeachGateway implements PaymentGateway {
  name = 'peach'
  displayName = 'Peach Payments'
  
  private config: PaymentGatewayConfig
  private apiUrl: string

  constructor(config: PaymentGatewayConfig) {
    this.config = config
    this.apiUrl = config.sandbox 
      ? 'https://test.oppwa.com/v1/payments'
      : 'https://oppwa.com/v1/payments'
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const [givenName, ...surnameParts] = request.customerName.split(' ')
      const surname = surnameParts.join(' ') || givenName

      const paymentRequest: PeachPaymentRequest = {
        entityId: this.config.credentials.entityId,
        amount: request.amount.toFixed(2),
        currency: request.currency,
        paymentType: 'DB', // Debit transaction
        customer: {
          email: request.customerEmail,
          givenName,
          surname,
          mobile: request.customerPhone
        },
        billing: {
          street1: 'N/A', // Would need to be collected from customer
          city: 'Cape Town',
          state: 'Western Cape',
          country: 'ZA',
          postcode: '8000'
        },
        customParameters: {
          orderId: request.orderId,
          description: request.description,
          ...request.metadata
        },
        shopperResultUrl: this.config.urls.returnUrl,
        notificationUrl: this.config.urls.notifyUrl
      }

      const formData = new URLSearchParams()
      formData.append('entityId', paymentRequest.entityId)
      formData.append('amount', paymentRequest.amount)
      formData.append('currency', paymentRequest.currency)
      formData.append('paymentType', paymentRequest.paymentType)
      formData.append('customer.email', paymentRequest.customer.email)
      formData.append('customer.givenName', paymentRequest.customer.givenName)
      formData.append('customer.surname', paymentRequest.customer.surname)
      if (paymentRequest.customer.mobile) {
        formData.append('customer.mobile', paymentRequest.customer.mobile)
      }
      formData.append('billing.street1', paymentRequest.billing.street1)
      formData.append('billing.city', paymentRequest.billing.city)
      formData.append('billing.state', paymentRequest.billing.state)
      formData.append('billing.country', paymentRequest.billing.country)
      formData.append('billing.postcode', paymentRequest.billing.postcode)
      formData.append('shopperResultUrl', paymentRequest.shopperResultUrl)
      formData.append('notificationUrl', paymentRequest.notificationUrl)
      
      Object.entries(paymentRequest.customParameters).forEach(([key, value]) => {
        formData.append(`customParameters[${key}]`, value)
      })

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.credentials.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Peach API error: ${error}`)
      }

      const data: PeachPaymentResponse = await response.json()

      // Check if payment was successful
      if (!this.isSuccessResult(data.result.code)) {
        throw new Error(`Peach payment failed: ${data.result.description}`)
      }

      return {
        success: true,
        paymentUrl: data.redirect.url,
        paymentId: data.id,
        gatewayOrderId: data.id,
        metadata: { peachData: data }
      }
    } catch (error) {
      return {
        success: false,
        error: `Peach payment creation failed: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  async verifyNotification(data: any): Promise<boolean> {
    try {
      // Peach Payments uses IP whitelisting and HTTPS for security
      // Additional verification can be done by checking the payment status
      const webhook = data as PeachWebhookData
      
      if (!webhook.id || !webhook.result) {
        return false
      }

      // Optionally verify by checking payment status with Peach API
      return true
    } catch (error) {
      console.error('Peach verification error:', error)
      return false
    }
  }

  async parseNotification(data: any): Promise<PaymentNotification> {
    const webhook = data as PeachWebhookData
    
    let status: PaymentStatus
    if (this.isSuccessResult(webhook.result.code)) {
      status = PaymentStatus.COMPLETED
    } else if (this.isPendingResult(webhook.result.code)) {
      status = PaymentStatus.PENDING
    } else {
      status = PaymentStatus.FAILED
    }

    return {
      gatewayName: this.name,
      orderId: webhook.customParameters.orderId,
      gatewayPaymentId: webhook.id,
      status,
      amount: parseFloat(webhook.amount),
      currency: webhook.currency,
      metadata: webhook.customParameters,
      rawData: webhook
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentNotification> {
    try {
      const response = await fetch(`${this.apiUrl}/${paymentId}?entityId=${this.config.credentials.entityId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.credentials.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Peach status check failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      let status: PaymentStatus
      if (this.isSuccessResult(data.result.code)) {
        status = PaymentStatus.COMPLETED
      } else if (this.isPendingResult(data.result.code)) {
        status = PaymentStatus.PENDING
      } else {
        status = PaymentStatus.FAILED
      }

      return {
        gatewayName: this.name,
        orderId: data.customParameters.orderId,
        gatewayPaymentId: data.id,
        status,
        amount: parseFloat(data.amount),
        currency: data.currency,
        metadata: data.customParameters,
        rawData: data
      }
    } catch (error) {
      throw new Error(`Peach status check failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
    try {
      const formData = new URLSearchParams()
      formData.append('entityId', this.config.credentials.entityId)
      formData.append('amount', amount ? amount.toFixed(2) : '')
      formData.append('currency', 'ZAR')
      formData.append('paymentType', 'RF') // Refund transaction

      const response = await fetch(`${this.apiUrl}/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.credentials.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Peach refund failed: ${error}`)
      }

      const data = await response.json()

      if (!this.isSuccessResult(data.result.code)) {
        throw new Error(`Peach refund failed: ${data.result.description}`)
      }

      return {
        success: true,
        paymentId: data.id,
        metadata: { refundData: data }
      }
    } catch (error) {
      return {
        success: false,
        error: `Peach refund failed: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  private isSuccessResult(code: string): boolean {
    // Peach success codes start with '000.000.' or '000.100.'
    return /^000\.(000|100)\./.test(code)
  }

  private isPendingResult(code: string): boolean {
    // Peach pending codes start with '000.200.'
    return /^000\.200\./.test(code)
  }
}
