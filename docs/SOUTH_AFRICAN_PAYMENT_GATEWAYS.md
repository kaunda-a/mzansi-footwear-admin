# South African Payment Gateway Integration Guide

## Overview
This document outlines the recommended payment gateways for South African e-commerce and provides integration guidance to replace the current Razorpay implementation.

## Recommended Payment Gateways

### 1. **PayFast** (Recommended)
- **Website**: https://www.payfast.co.za/
- **Market Position**: Most popular in South Africa
- **Pricing**: 2.9% + R2.00 per transaction
- **Features**:
  - Credit/Debit cards (Visa, Mastercard)
  - Instant EFT
  - Bitcoin
  - Mobicred
  - SCode payments
  - Recurring billing
  - Comprehensive API

**Integration Benefits**:
- Local South African company
- Excellent local support
- Well-documented API
- Strong fraud protection
- Mobile-optimized checkout

### 2. **Peach Payments** (Enterprise)
- **Website**: https://www.peachpayments.com/
- **Market Position**: Enterprise-focused
- **Pricing**: Custom pricing (typically lower for high volume)
- **Features**:
  - Global payment processing
  - Advanced fraud detection
  - Multiple payment methods
  - Comprehensive reporting
  - White-label solutions

**Integration Benefits**:
- Enterprise-grade security
- Global reach with local expertise
- Advanced analytics
- Customizable checkout experience

### 3. **Yoco** (Small to Medium Business)
- **Website**: https://www.yoco.co.za/
- **Market Position**: SMB-focused
- **Pricing**: 2.95% per transaction
- **Features**:
  - Online and in-person payments
  - Simple integration
  - Mobile card readers
  - Instant settlements
  - No monthly fees

### 4. **PayGate** (Established)
- **Website**: https://www.paygate.co.za/
- **Market Position**: Long-established provider
- **Pricing**: Competitive rates (contact for pricing)
- **Features**:
  - Multiple payment methods
  - Secure tokenization
  - 3D Secure authentication
  - Comprehensive API

### 5. **Stripe** (International with SA Support)
- **Website**: https://stripe.com/
- **Market Position**: Global leader with SA support
- **Pricing**: 2.9% + R2.00 per transaction
- **Features**:
  - Global payment processing
  - Excellent developer experience
  - Advanced features (subscriptions, marketplace)
  - Strong documentation

## Integration Plan

### Phase 1: Database Schema Updates
Update the existing Razorpay-specific fields to be gateway-agnostic:

```sql
-- Update Payment table
ALTER TABLE "Payment" 
RENAME COLUMN "rzr_order_id" TO "gateway_order_id";

ALTER TABLE "Payment" 
RENAME COLUMN "rzr_payment_id" TO "gateway_payment_id";

-- Add gateway identifier
ALTER TABLE "Payment" 
ADD COLUMN "gateway_provider" VARCHAR(50) DEFAULT 'payfast';
```

### Phase 2: Environment Variables
Add new environment variables for the chosen gateway:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true  # Set to false for production

# Alternative: Peach Payments
PEACH_ENTITY_ID=your_entity_id
PEACH_ACCESS_TOKEN=your_access_token
PEACH_SANDBOX=true

# Alternative: Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Phase 3: API Integration

#### PayFast Integration Example
```typescript
// lib/payment/payfast.ts
interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  sandbox: boolean;
}

export class PayFastGateway {
  private config: PayFastConfig;

  constructor(config: PayFastConfig) {
    this.config = config;
  }

  async createPayment(order: {
    amount: number;
    orderId: string;
    customerEmail: string;
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
  }) {
    const paymentData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: order.returnUrl,
      cancel_url: order.cancelUrl,
      notify_url: order.notifyUrl,
      name_first: 'Customer',
      email_address: order.customerEmail,
      m_payment_id: order.orderId,
      amount: order.amount.toFixed(2),
      item_name: `Order #${order.orderId}`,
    };

    // Generate signature
    const signature = this.generateSignature(paymentData);
    
    return {
      ...paymentData,
      signature,
      paymentUrl: this.config.sandbox 
        ? 'https://sandbox.payfast.co.za/eng/process'
        : 'https://www.payfast.co.za/eng/process'
    };
  }

  private generateSignature(data: Record<string, string>): string {
    // PayFast signature generation logic
    // Implementation details...
  }
}
```

### Phase 4: Component Updates

#### Update Payment Components
```typescript
// components/checkout/payment-form.tsx
interface PaymentFormProps {
  order: Order;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export function PaymentForm({ order, onSuccess, onError }: PaymentFormProps) {
  const handlePayFastPayment = async () => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.total,
          gateway: 'payfast'
        })
      });

      const { paymentUrl, paymentData } = await response.json();
      
      // Redirect to PayFast or open in modal
      window.location.href = paymentUrl;
    } catch (error) {
      onError('Payment initialization failed');
    }
  };

  return (
    <div className="payment-form">
      <Button onClick={handlePayFastPayment}>
        Pay with PayFast
      </Button>
    </div>
  );
}
```

### Phase 5: API Route Updates

#### Create Payment API
```typescript
// app/api/payments/create/route.ts
import { PayFastGateway } from '@/lib/payment/payfast';

export async function POST(req: Request) {
  const { orderId, amount, gateway } = await req.json();
  
  if (gateway === 'payfast') {
    const payfast = new PayFastGateway({
      merchantId: process.env.PAYFAST_MERCHANT_ID!,
      merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
      passphrase: process.env.PAYFAST_PASSPHRASE!,
      sandbox: process.env.PAYFAST_SANDBOX === 'true'
    });

    const payment = await payfast.createPayment({
      amount,
      orderId,
      customerEmail: 'customer@example.com',
      returnUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      notifyUrl: `${process.env.NEXTAUTH_URL}/api/payments/webhook`
    });

    return Response.json(payment);
  }
}
```

## Migration Checklist

- [ ] Choose primary payment gateway (Recommended: PayFast)
- [ ] Set up merchant account with chosen provider
- [ ] Update database schema to remove Razorpay-specific fields
- [ ] Implement new payment gateway SDK/API integration
- [ ] Update environment variables
- [ ] Modify payment components and forms
- [ ] Update API routes for payment processing
- [ ] Implement webhook handling for payment notifications
- [ ] Update payment details display components
- [ ] Test in sandbox/development environment
- [ ] Update documentation and error messages
- [ ] Deploy to production with proper configuration
- [ ] Monitor payment success rates and errors

## Security Considerations

1. **PCI Compliance**: Ensure your application meets PCI DSS requirements
2. **HTTPS**: All payment pages must use HTTPS
3. **Webhook Validation**: Properly validate webhook signatures
4. **Data Encryption**: Encrypt sensitive payment data
5. **Fraud Prevention**: Implement fraud detection measures
6. **Audit Logging**: Log all payment-related activities

## Testing Strategy

1. **Sandbox Testing**: Use provider's sandbox environment
2. **Payment Flows**: Test successful payments, failures, and cancellations
3. **Webhook Testing**: Verify webhook handling and order updates
4. **Error Handling**: Test various error scenarios
5. **Mobile Testing**: Ensure mobile payment experience works well
6. **Load Testing**: Test payment system under load

## Support and Documentation

- **PayFast**: https://developers.payfast.co.za/
- **Peach Payments**: https://docs.peachpayments.com/
- **Stripe**: https://stripe.com/docs
- **Yoco**: https://developer.yoco.com/

## Estimated Implementation Time

- **Simple Integration (PayFast)**: 1-2 weeks
- **Enterprise Integration (Peach)**: 2-4 weeks
- **Multi-gateway Support**: 3-6 weeks

Choose PayFast for fastest implementation with good South African market coverage.
