import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentNotification, PaymentGatewayConfig } from './types'
import { paymentGatewayFactory, getGatewayConfigs } from './factory'

export interface PaymentGatewayOption {
  name: string
  displayName: string
  enabled: boolean
  sandbox: boolean
  logo?: string
  description?: string
}

export class PaymentManager {
  private gateways = new Map<string, PaymentGateway>()
  private configs = new Map<string, PaymentGatewayConfig>()

  constructor() {
    this.initializeGateways()
  }

  private initializeGateways() {
    const configs = getGatewayConfigs()
    
    configs.forEach(config => {
      try {
        const gateway = paymentGatewayFactory.createGateway(config)
        this.gateways.set(config.name, gateway)
        this.configs.set(config.name, config)
      } catch (error) {
        console.error(`Failed to initialize ${config.name} gateway:`, error)
      }
    })
  }

  /**
   * Get all available payment gateways
   */
  getAvailableGateways(): PaymentGatewayOption[] {
    const options: PaymentGatewayOption[] = []

    this.configs.forEach((config, name) => {
      const gateway = this.gateways.get(name)
      if (gateway) {
        options.push({
          name: config.name,
          displayName: gateway.displayName,
          enabled: config.enabled,
          sandbox: config.sandbox,
          logo: this.getGatewayLogo(name),
          description: this.getGatewayDescription(name)
        })
      }
    })

    return options.filter(option => option.enabled)
  }

  /**
   * Get primary payment gateway (first enabled one)
   */
  getPrimaryGateway(): PaymentGateway | null {
    const availableGateways = this.getAvailableGateways()
    if (availableGateways.length === 0) {
      return null
    }

    return this.gateways.get(availableGateways[0].name) || null
  }

  /**
   * Get specific payment gateway by name
   */
  getGateway(name: string): PaymentGateway | null {
    return this.gateways.get(name) || null
  }

  /**
   * Create payment with specific gateway
   */
  async createPayment(gatewayName: string, request: PaymentRequest): Promise<PaymentResponse> {
    const gateway = this.getGateway(gatewayName)
    
    if (!gateway) {
      return {
        success: false,
        error: `Payment gateway '${gatewayName}' not available`
      }
    }

    try {
      return await gateway.createPayment(request)
    } catch (error) {
      return {
        success: false,
        error: `Payment creation failed: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  /**
   * Create payment with fallback to other gateways
   */
  async createPaymentWithFallback(request: PaymentRequest, preferredGateway?: string): Promise<PaymentResponse & { gatewayUsed?: string }> {
    const availableGateways = this.getAvailableGateways()
    
    if (availableGateways.length === 0) {
      return {
        success: false,
        error: 'No payment gateways available'
      }
    }

    // Try preferred gateway first
    if (preferredGateway) {
      const gateway = this.getGateway(preferredGateway)
      if (gateway) {
        try {
          const result = await gateway.createPayment(request)
          if (result.success) {
            return { ...result, gatewayUsed: preferredGateway }
          }
        } catch (error) {
          console.warn(`Preferred gateway ${preferredGateway} failed:`, error)
        }
      }
    }

    // Try other gateways in order
    for (const gatewayOption of availableGateways) {
      if (gatewayOption.name === preferredGateway) {
        continue // Already tried
      }

      const gateway = this.getGateway(gatewayOption.name)
      if (!gateway) continue

      try {
        const result = await gateway.createPayment(request)
        if (result.success) {
          return { ...result, gatewayUsed: gatewayOption.name }
        }
      } catch (error) {
        console.warn(`Gateway ${gatewayOption.name} failed:`, error)
      }
    }

    return {
      success: false,
      error: 'All payment gateways failed'
    }
  }

  /**
   * Process webhook notification
   */
  async processWebhook(gatewayName: string, data: any): Promise<PaymentNotification | null> {
    const gateway = this.getGateway(gatewayName)
    
    if (!gateway) {
      throw new Error(`Payment gateway '${gatewayName}' not found`)
    }

    // Verify notification
    const isValid = await gateway.verifyNotification(data)
    if (!isValid) {
      throw new Error('Invalid webhook notification')
    }

    // Parse notification
    return await gateway.parseNotification(data)
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(gatewayName: string, paymentId: string): Promise<PaymentNotification> {
    const gateway = this.getGateway(gatewayName)
    
    if (!gateway) {
      throw new Error(`Payment gateway '${gatewayName}' not found`)
    }

    return await gateway.checkPaymentStatus(paymentId)
  }

  /**
   * Refund payment
   */
  async refundPayment(gatewayName: string, paymentId: string, amount?: number): Promise<PaymentResponse> {
    const gateway = this.getGateway(gatewayName)
    
    if (!gateway) {
      return {
        success: false,
        error: `Payment gateway '${gatewayName}' not found`
      }
    }

    if (!gateway.refundPayment) {
      return {
        success: false,
        error: `Gateway '${gatewayName}' does not support refunds`
      }
    }

    return await gateway.refundPayment(paymentId, amount)
  }

  private getGatewayLogo(name: string): string {
    const logos: Record<string, string> = {
      payfast: '/images/gateways/payfast-logo.png',
      yoco: '/images/gateways/yoco-logo.png',
      peach: '/images/gateways/peach-logo.png',
      paygate: '/images/gateways/paygate-logo.png'
    }
    return logos[name] || '/images/gateways/default-logo.png'
  }

  private getGatewayDescription(name: string): string {
    const descriptions: Record<string, string> = {
      payfast: 'South Africa\'s leading payment gateway with support for all major cards and EFT',
      yoco: 'Simple, secure payments for small and medium businesses',
      peach: 'Enterprise-grade payment processing with advanced fraud protection',
      paygate: 'Established South African payment gateway with comprehensive features'
    }
    return descriptions[name] || 'Secure payment processing'
  }
}

// Singleton instance
export const paymentManager = new PaymentManager()
