// Payment types for admin dashboard reporting only
// Actual payment processing is handled by the frontend application

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

// Payment information for admin reporting
export interface PaymentInfo {
  id: string
  orderId: string
  status: PaymentStatus
  method: string
  via: string
  gateway_name: string
  gateway_order_id?: string
  gateway_payment_id?: string
  amount: number
  createdAt: Date
  updatedAt: Date
}

// Gateway information for admin configuration display
export interface PaymentGatewayInfo {
  name: string
  status: 'configured' | 'disabled'
  displayName?: string
}
