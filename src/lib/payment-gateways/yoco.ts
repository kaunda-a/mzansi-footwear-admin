import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentNotification, PaymentStatus, PaymentGatewayConfig } from './types'

interface YocoPaymentRequest {
  amount: number
  currency: string
  metadata: {
    orderId: string
    customerName: string
    customerEmail: string
    description: string
  }
  successUrl: string
  cancelUrl: string
  failureUrl: string
  webhookUrl: string
}

interface YocoPaymentResponse {
  id: string
  status: string
  amount: number
  currency: string
  redirectUrl: string
  metadata: Record<string, any>
}

interface YocoWebhookData {
  id: string
  type: string
  payload: {
    id: string
    status: 'successful' | 'failed' | 'cancelled' | 'pending'
    amount: number
    currency: string
    metadata: Record<string, any>
    createdDate: string
  }
}

export class YocoGateway implements PaymentGateway {
  name = 'yoco'
  displayName = 'Yoco'
  
  private config: PaymentGatewayConfig
  private apiUrl: string

  constructor(config: PaymentGatewayConfig) {
    this.config = config
    this.apiUrl = config.sandbox 
      ? 'https://payments.yoco.com/api/checkouts'
      : 'https://payments.yoco.com/api/checkouts'
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentRequest: YocoPaymentRequest = {
        amount: Math.round(request.amount * 100), // Yoco expects amount in cents
        currency: request.currency,
        metadata: {
          orderId: request.orderId,
          customerName: request.customerName,
          customerEmail: request.customerEmail,
          description: request.description,
          ...request.metadata
        },
        successUrl: this.config.urls.returnUrl,
        cancelUrl: this.config.urls.cancelUrl,
        failureUrl: this.config.urls.cancelUrl,
        webhookUrl: this.config.urls.notifyUrl
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.credentials.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Yoco API error: ${error}`)
      }

      const data: YocoPaymentResponse = await response.json()

      return {
        success: true,
        paymentUrl: data.redirectUrl,
        paymentId: data.id,
        gatewayOrderId: data.id,
        metadata: { yocoData: data }
      }
    } catch (error) {
      return {
        success: false,
        error: `Yoco payment creation failed: ${error.message}`
      }
    }
  }

  async verifyNotification(data: any): Promise<boolean> {
    try {
      // Yoco uses webhook signatures for verification
      const signature = data.headers?.['x-yoco-signature']
      const payload = JSON.stringify(data.body)
      
      if (!signature) {
        return false
      }

      // Verify signature using webhook secret
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', this.config.credentials.webhookSecret)
        .update(payload)
        .digest('hex')

      return signature === expectedSignature
    } catch (error) {
      console.error('Yoco verification error:', error)
      return false
    }
  }

  async parseNotification(data: any): Promise<PaymentNotification> {
    const webhook = data as YocoWebhookData
    const payload = webhook.payload
    
    let status: PaymentStatus
    switch (payload.status) {
      case 'successful':
        status = PaymentStatus.COMPLETED
        break
      case 'failed':
        status = PaymentStatus.FAILED
        break
      case 'cancelled':
        status = PaymentStatus.CANCELLED
        break
      default:
        status = PaymentStatus.PENDING
    }

    return {
      gatewayName: this.name,
      orderId: payload.metadata.orderId,
      gatewayPaymentId: payload.id,
      status,
      amount: payload.amount / 100, // Convert from cents
      currency: payload.currency,
      customerEmail: payload.metadata.customerEmail,
      metadata: payload.metadata,
      rawData: webhook
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentNotification> {
    try {
      const response = await fetch(`${this.apiUrl}/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.credentials.secretKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`Yoco status check failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      let status: PaymentStatus
      switch (data.status) {
        case 'successful':
          status = PaymentStatus.COMPLETED
          break
        case 'failed':
          status = PaymentStatus.FAILED
          break
        case 'cancelled':
          status = PaymentStatus.CANCELLED
          break
        default:
          status = PaymentStatus.PENDING
      }

      return {
        gatewayName: this.name,
        orderId: data.metadata.orderId,
        gatewayPaymentId: data.id,
        status,
        amount: data.amount / 100,
        currency: data.currency,
        customerEmail: data.metadata.customerEmail,
        metadata: data.metadata,
        rawData: data
      }
    } catch (error) {
      throw new Error(`Yoco status check failed: ${error.message}`)
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
    try {
      const refundData = {
        amount: amount ? Math.round(amount * 100) : undefined // Convert to cents if specified
      }

      const response = await fetch(`${this.apiUrl}/${paymentId}/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.credentials.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundData)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Yoco refund failed: ${error}`)
      }

      const data = await response.json()

      return {
        success: true,
        paymentId: data.id,
        metadata: { refundData: data }
      }
    } catch (error) {
      return {
        success: false,
        error: `Yoco refund failed: ${error.message}`
      }
    }
  }
}
