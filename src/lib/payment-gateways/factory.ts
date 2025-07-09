import { PaymentGateway, PaymentGatewayConfig, PaymentGatewayFactory } from './types'
import { PayFastGateway } from './payfast'
import { YocoGateway } from './yoco'
import { PeachGateway } from './peach'
import { PayGateGateway } from './paygate'

export class PaymentGatewayFactoryImpl implements PaymentGatewayFactory {
  private gateways = new Map<string, new (config: PaymentGatewayConfig) => PaymentGateway>()

  constructor() {
    this.registerGateways()
  }

  private registerGateways() {
    this.gateways.set('payfast', PayFastGateway)
    this.gateways.set('yoco', YocoGateway)
    this.gateways.set('peach', PeachGateway)
    this.gateways.set('paygate', PayGateGateway)
  }

  createGateway(config: PaymentGatewayConfig): PaymentGateway {
    const GatewayClass = this.gateways.get(config.name)
    
    if (!GatewayClass) {
      throw new Error(`Unsupported payment gateway: ${config.name}`)
    }

    return new GatewayClass(config)
  }

  getSupportedGateways(): string[] {
    return Array.from(this.gateways.keys())
  }
}

// Singleton instance
export const paymentGatewayFactory = new PaymentGatewayFactoryImpl()

// Gateway configurations from environment variables
export const getGatewayConfigs = (): PaymentGatewayConfig[] => {
  const configs: PaymentGatewayConfig[] = []

  // PayFast configuration
  if (process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY) {
    configs.push({
      name: 'payfast',
      enabled: process.env.PAYFAST_ENABLED === 'true',
      sandbox: process.env.PAYFAST_SANDBOX === 'true',
      credentials: {
        merchantId: process.env.PAYFAST_MERCHANT_ID,
        merchantKey: process.env.PAYFAST_MERCHANT_KEY,
        passphrase: process.env.PAYFAST_PASSPHRASE || ''
      },
      urls: {
        returnUrl: process.env.PAYFAST_RETURN_URL || `${process.env.NEXTAUTH_URL}/payment/return`,
        cancelUrl: process.env.PAYFAST_CANCEL_URL || `${process.env.NEXTAUTH_URL}/payment/cancel`,
        notifyUrl: process.env.PAYFAST_NOTIFY_URL || `${process.env.NEXTAUTH_URL}/api/payment/webhook/payfast`
      }
    })
  }

  // Yoco configuration
  if (process.env.YOCO_SECRET_KEY) {
    configs.push({
      name: 'yoco',
      enabled: process.env.YOCO_ENABLED === 'true',
      sandbox: process.env.YOCO_SANDBOX === 'true',
      credentials: {
        secretKey: process.env.YOCO_SECRET_KEY,
        publicKey: process.env.YOCO_PUBLIC_KEY || '',
        webhookSecret: process.env.YOCO_WEBHOOK_SECRET || ''
      },
      urls: {
        returnUrl: process.env.YOCO_RETURN_URL || `${process.env.NEXTAUTH_URL}/payment/return`,
        cancelUrl: process.env.YOCO_CANCEL_URL || `${process.env.NEXTAUTH_URL}/payment/cancel`,
        notifyUrl: process.env.YOCO_NOTIFY_URL || `${process.env.NEXTAUTH_URL}/api/payment/webhook/yoco`
      }
    })
  }

  // Peach Payments configuration
  if (process.env.PEACH_ENTITY_ID && process.env.PEACH_ACCESS_TOKEN) {
    configs.push({
      name: 'peach',
      enabled: process.env.PEACH_ENABLED === 'true',
      sandbox: process.env.PEACH_SANDBOX === 'true',
      credentials: {
        entityId: process.env.PEACH_ENTITY_ID,
        accessToken: process.env.PEACH_ACCESS_TOKEN
      },
      urls: {
        returnUrl: process.env.PEACH_RETURN_URL || `${process.env.NEXTAUTH_URL}/payment/return`,
        cancelUrl: process.env.PEACH_CANCEL_URL || `${process.env.NEXTAUTH_URL}/payment/cancel`,
        notifyUrl: process.env.PEACH_NOTIFY_URL || `${process.env.NEXTAUTH_URL}/api/payment/webhook/peach`
      }
    })
  }

  // PayGate configuration
  if (process.env.PAYGATE_ID && process.env.PAYGATE_ENCRYPTION_KEY) {
    configs.push({
      name: 'paygate',
      enabled: process.env.PAYGATE_ENABLED === 'true',
      sandbox: process.env.PAYGATE_SANDBOX === 'true',
      credentials: {
        paygateId: process.env.PAYGATE_ID,
        encryptionKey: process.env.PAYGATE_ENCRYPTION_KEY
      },
      urls: {
        returnUrl: process.env.PAYGATE_RETURN_URL || `${process.env.NEXTAUTH_URL}/payment/return`,
        cancelUrl: process.env.PAYGATE_CANCEL_URL || `${process.env.NEXTAUTH_URL}/payment/cancel`,
        notifyUrl: process.env.PAYGATE_NOTIFY_URL || `${process.env.NEXTAUTH_URL}/api/payment/webhook/paygate`
      }
    })
  }

  return configs.filter(config => config.enabled)
}
