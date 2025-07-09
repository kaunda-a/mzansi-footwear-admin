import crypto from 'crypto'
import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentNotification, PaymentStatus, PaymentGatewayConfig } from './types'

interface PayGatePaymentData {
  PAYGATE_ID: string
  REFERENCE: string
  AMOUNT: string
  CURRENCY: string
  RETURN_URL: string
  TRANSACTION_DATE: string
  LOCALE: string
  COUNTRY: string
  EMAIL: string
  CHECKSUM: string
}

interface PayGateNotificationData {
  PAYGATE_ID: string
  PAY_REQUEST_ID: string
  REFERENCE: string
  TRANSACTION_STATUS: string
  RESULT_CODE: string
  AUTH_CODE?: string
  CURRENCY: string
  AMOUNT: string
  RESULT_DESC: string
  TRANSACTION_ID: string
  RISK_INDICATOR?: string
  PAY_METHOD?: string
  PAY_METHOD_DETAIL?: string
  USER1?: string
  USER2?: string
  USER3?: string
  VAULT_ID?: string
  PAYVAULT_DATA_1?: string
  PAYVAULT_DATA_2?: string
  CHECKSUM: string
}

export class PayGateGateway implements PaymentGateway {
  name = 'paygate'
  displayName = 'PayGate'
  
  private config: PaymentGatewayConfig
  private apiUrl: string

  constructor(config: PaymentGatewayConfig) {
    this.config = config
    this.apiUrl = config.sandbox 
      ? 'https://secure.paygate.co.za/payweb3/initiate.trans'
      : 'https://secure.paygate.co.za/payweb3/initiate.trans'
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
      
      const paymentData: Omit<PayGatePaymentData, 'CHECKSUM'> = {
        PAYGATE_ID: this.config.credentials.paygateId,
        REFERENCE: request.orderId,
        AMOUNT: Math.round(request.amount * 100).toString(), // PayGate expects amount in cents
        CURRENCY: request.currency,
        RETURN_URL: this.config.urls.returnUrl,
        TRANSACTION_DATE: transactionDate,
        LOCALE: 'en-za',
        COUNTRY: 'ZAF',
        EMAIL: request.customerEmail
      }

      // Generate checksum
      const checksum = this.generateChecksum(paymentData)
      const finalPaymentData: PayGatePaymentData = {
        ...paymentData,
        CHECKSUM: checksum
      }

      // Initiate payment with PayGate
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(finalPaymentData as any).toString()
      })

      if (!response.ok) {
        throw new Error(`PayGate API error: ${response.statusText}`)
      }

      const responseText = await response.text()
      const responseData = this.parsePayGateResponse(responseText)

      if (!responseData.PAY_REQUEST_ID) {
        throw new Error(`PayGate initiation failed: ${responseData.ERROR || 'Unknown error'}`)
      }

      // Build redirect URL
      const redirectUrl = this.config.sandbox
        ? `https://secure.paygate.co.za/payweb3/process.trans?PAY_REQUEST_ID=${responseData.PAY_REQUEST_ID}`
        : `https://secure.paygate.co.za/payweb3/process.trans?PAY_REQUEST_ID=${responseData.PAY_REQUEST_ID}`

      return {
        success: true,
        paymentUrl: redirectUrl,
        paymentId: responseData.PAY_REQUEST_ID,
        gatewayOrderId: responseData.PAY_REQUEST_ID,
        metadata: { paygateData: responseData }
      }
    } catch (error) {
      return {
        success: false,
        error: `PayGate payment creation failed: ${error.message}`
      }
    }
  }

  async verifyNotification(data: any): Promise<boolean> {
    try {
      const notification = data as PayGateNotificationData
      const { CHECKSUM, ...dataWithoutChecksum } = notification

      const expectedChecksum = this.generateChecksum(dataWithoutChecksum)
      return CHECKSUM === expectedChecksum
    } catch (error) {
      console.error('PayGate verification error:', error)
      return false
    }
  }

  async parseNotification(data: any): Promise<PaymentNotification> {
    const notification = data as PayGateNotificationData
    
    let status: PaymentStatus
    switch (notification.TRANSACTION_STATUS) {
      case '1': // Approved
        status = PaymentStatus.COMPLETED
        break
      case '2': // Declined
        status = PaymentStatus.FAILED
        break
      case '4': // Cancelled
        status = PaymentStatus.CANCELLED
        break
      default:
        status = PaymentStatus.PENDING
    }

    return {
      gatewayName: this.name,
      orderId: notification.REFERENCE,
      gatewayPaymentId: notification.TRANSACTION_ID,
      gatewayOrderId: notification.PAY_REQUEST_ID,
      status,
      amount: parseInt(notification.AMOUNT) / 100, // Convert from cents
      currency: notification.CURRENCY,
      metadata: {
        authCode: notification.AUTH_CODE,
        payMethod: notification.PAY_METHOD,
        payMethodDetail: notification.PAY_METHOD_DETAIL,
        user1: notification.USER1,
        user2: notification.USER2,
        user3: notification.USER3,
        resultCode: notification.RESULT_CODE,
        resultDesc: notification.RESULT_DESC
      },
      rawData: notification
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentNotification> {
    try {
      const queryData = {
        PAYGATE_ID: this.config.credentials.paygateId,
        PAY_REQUEST_ID: paymentId,
        REFERENCE: paymentId
      }

      const checksum = this.generateChecksum(queryData)
      const finalQueryData = {
        ...queryData,
        CHECKSUM: checksum
      }

      const queryUrl = this.config.sandbox
        ? 'https://secure.paygate.co.za/payweb3/query.trans'
        : 'https://secure.paygate.co.za/payweb3/query.trans'

      const response = await fetch(queryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(finalQueryData as any).toString()
      })

      if (!response.ok) {
        throw new Error(`PayGate query failed: ${response.statusText}`)
      }

      const responseText = await response.text()
      const responseData = this.parsePayGateResponse(responseText)

      let status: PaymentStatus
      switch (responseData.TRANSACTION_STATUS) {
        case '1':
          status = PaymentStatus.COMPLETED
          break
        case '2':
          status = PaymentStatus.FAILED
          break
        case '4':
          status = PaymentStatus.CANCELLED
          break
        default:
          status = PaymentStatus.PENDING
      }

      return {
        gatewayName: this.name,
        orderId: responseData.REFERENCE,
        gatewayPaymentId: responseData.TRANSACTION_ID,
        gatewayOrderId: responseData.PAY_REQUEST_ID,
        status,
        amount: parseInt(responseData.AMOUNT) / 100,
        currency: responseData.CURRENCY,
        metadata: {
          authCode: responseData.AUTH_CODE,
          resultCode: responseData.RESULT_CODE,
          resultDesc: responseData.RESULT_DESC
        },
        rawData: responseData
      }
    } catch (error) {
      throw new Error(`PayGate status check failed: ${error.message}`)
    }
  }

  private generateChecksum(data: Record<string, any>): string {
    const values = Object.keys(data)
      .sort()
      .map(key => data[key])
      .filter(value => value !== undefined && value !== '')
      .join('')

    const stringToHash = values + this.config.credentials.encryptionKey

    return crypto.createHash('md5').update(stringToHash).digest('hex')
  }

  private parsePayGateResponse(responseText: string): Record<string, string> {
    const data: Record<string, string> = {}
    const pairs = responseText.split('&')
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=')
      if (key && value) {
        data[key] = decodeURIComponent(value)
      }
    })

    return data
  }
}
