import crypto from 'crypto'
import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentNotification, PaymentStatus, PaymentGatewayConfig } from './types'

interface PayFastPaymentData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last: string
  email_address: string
  cell_number?: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description: string
  custom_str1?: string
  custom_str2?: string
  custom_str3?: string
  signature?: string
}

interface PayFastNotificationData {
  m_payment_id: string
  pf_payment_id: string
  payment_status: 'COMPLETE' | 'FAILED' | 'CANCELLED'
  item_name: string
  item_description: string
  amount_gross: string
  amount_fee: string
  amount_net: string
  custom_str1?: string
  custom_str2?: string
  custom_str3?: string
  name_first: string
  name_last: string
  email_address: string
  merchant_id: string
  signature: string
}

export class PayFastGateway implements PaymentGateway {
  name = 'payfast'
  displayName = 'PayFast'
  
  private config: PaymentGatewayConfig

  constructor(config: PaymentGatewayConfig) {
    this.config = config
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const [firstName, ...lastNameParts] = request.customerName.split(' ')
      const lastName = lastNameParts.join(' ') || firstName

      const paymentData: PayFastPaymentData = {
        merchant_id: this.config.credentials.merchantId,
        merchant_key: this.config.credentials.merchantKey,
        return_url: this.config.urls.returnUrl,
        cancel_url: this.config.urls.cancelUrl,
        notify_url: this.config.urls.notifyUrl,
        name_first: firstName,
        name_last: lastName,
        email_address: request.customerEmail,
        cell_number: request.customerPhone,
        m_payment_id: request.orderId,
        amount: request.amount.toFixed(2),
        item_name: `Order #${request.orderId}`,
        item_description: request.description,
        custom_str1: request.orderId,
        custom_str2: JSON.stringify(request.metadata || {}),
      }

      // Generate signature
      paymentData.signature = this.generateSignature(paymentData)

      // Build payment URL
      const paymentUrl = this.buildPaymentUrl(paymentData)

      return {
        success: true,
        paymentUrl,
        gatewayOrderId: request.orderId,
        metadata: { paymentData }
      }
    } catch (error) {
      return {
        success: false,
        error: `PayFast payment creation failed: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  async verifyNotification(data: any): Promise<boolean> {
    try {
      const notification = data as PayFastNotificationData
      const { signature, ...dataWithoutSignature } = notification

      const expectedSignature = this.generateSignature(dataWithoutSignature as any)
      
      if (signature !== expectedSignature) {
        return false
      }

      // Validate with PayFast servers
      const validationUrl = this.config.sandbox
        ? 'https://sandbox.payfast.co.za/eng/query/validate'
        : 'https://www.payfast.co.za/eng/query/validate'

      const response = await fetch(validationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(notification as any).toString(),
      })

      const result = await response.text()
      return result.trim() === 'VALID'
    } catch (error) {
      console.error('PayFast verification error:', error)
      return false
    }
  }

  async parseNotification(data: any): Promise<PaymentNotification> {
    const notification = data as PayFastNotificationData
    
    let status: PaymentStatus
    switch (notification.payment_status) {
      case 'COMPLETE':
        status = PaymentStatus.COMPLETED
        break
      case 'FAILED':
        status = PaymentStatus.FAILED
        break
      case 'CANCELLED':
        status = PaymentStatus.CANCELLED
        break
      default:
        status = PaymentStatus.PENDING
    }

    return {
      gatewayName: this.name,
      orderId: notification.m_payment_id,
      gatewayPaymentId: notification.pf_payment_id,
      status,
      amount: parseFloat(notification.amount_gross),
      currency: 'ZAR',
      fees: parseFloat(notification.amount_fee),
      netAmount: parseFloat(notification.amount_net),
      customerEmail: notification.email_address,
      metadata: {
        custom_str1: notification.custom_str1,
        custom_str2: notification.custom_str2,
        custom_str3: notification.custom_str3,
      },
      rawData: notification
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentNotification> {
    // PayFast doesn't have a direct status check API
    // This would typically be implemented using their query API
    throw new Error('PayFast status check not implemented')
  }

  private generateSignature(data: Omit<PayFastPaymentData, 'signature'>): string {
    const paramString = Object.entries(data)
      .filter(([_, value]) => value !== undefined && value !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')

    const stringToHash = this.config.credentials.passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(this.config.credentials.passphrase)}`
      : paramString

    return crypto.createHash('md5').update(stringToHash).digest('hex')
  }

  private buildPaymentUrl(data: PayFastPaymentData): string {
    const queryString = Object.entries(data)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('&')

    const baseUrl = this.config.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process'

    return `${baseUrl}?${queryString}`
  }
}
