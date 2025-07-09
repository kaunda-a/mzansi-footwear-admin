// Common types for all payment gateways

export interface PaymentGatewayConfig {
  name: string
  enabled: boolean
  sandbox: boolean
  credentials: Record<string, string>
  urls: {
    returnUrl: string
    cancelUrl: string
    notifyUrl: string
  }
}

export interface PaymentRequest {
  orderId: string
  amount: number
  currency: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  description: string
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  paymentId?: string
  gatewayOrderId?: string
  error?: string
  metadata?: Record<string, any>
}

export interface PaymentNotification {
  gatewayName: string
  orderId: string
  gatewayPaymentId: string
  gatewayOrderId?: string
  status: PaymentStatus
  amount: number
  currency: string
  fees?: number
  netAmount?: number
  customerEmail?: string
  metadata?: Record<string, any>
  rawData: Record<string, any>
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export interface PaymentGateway {
  name: string
  displayName: string
  
  // Initialize payment
  createPayment(request: PaymentRequest): Promise<PaymentResponse>
  
  // Verify webhook notification
  verifyNotification(data: any): Promise<boolean>
  
  // Parse webhook notification
  parseNotification(data: any): Promise<PaymentNotification>
  
  // Check payment status
  checkPaymentStatus(paymentId: string): Promise<PaymentNotification>
  
  // Refund payment (optional)
  refundPayment?(paymentId: string, amount?: number): Promise<PaymentResponse>
}

export interface PaymentGatewayFactory {
  createGateway(config: PaymentGatewayConfig): PaymentGateway
  getSupportedGateways(): string[]
}
