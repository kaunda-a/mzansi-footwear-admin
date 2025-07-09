# Multi-Gateway Payment System

## Overview
This system supports multiple South African payment gateways with automatic fallback, providing redundancy and flexibility for payment processing.

## Supported Payment Gateways

### 1. PayFast (Primary)
- **Market Position**: Most popular in South Africa
- **Pricing**: 2.9% + R2.00 per transaction
- **Features**: Cards, EFT, Bitcoin, Recurring billing
- **Status**: ✅ Implemented

### 2. Yoco (Secondary)
- **Market Position**: SMB focused
- **Pricing**: 2.95% per transaction
- **Features**: Simple integration, same-day settlements
- **Status**: ✅ Implemented

### 3. Peach Payments (Enterprise)
- **Market Position**: Enterprise-focused
- **Pricing**: Custom (2.5-3.5%)
- **Features**: Advanced fraud protection, tokenization
- **Status**: ✅ Implemented

### 4. PayGate (Alternative)
- **Market Position**: Established provider
- **Pricing**: 3.5% + R2.00 per transaction
- **Features**: Multiple payment methods, fraud protection
- **Status**: ✅ Implemented

## Architecture

### Core Components

```
PaymentManager
├── PaymentGatewayFactory
├── PayFastGateway
├── YocoGateway
├── PeachGateway
└── PayGateGateway
```

### Key Features

1. **Gateway Abstraction**: Common interface for all gateways
2. **Automatic Fallback**: If primary gateway fails, try others
3. **Configuration Management**: Environment-based gateway setup
4. **Webhook Handling**: Universal webhook processor
5. **Status Checking**: Real-time payment status verification

## Configuration

### Environment Variables

```env
# PayFast Configuration
PAYFAST_ENABLED=true
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true

# Yoco Configuration
YOCO_ENABLED=true
YOCO_SECRET_KEY=your_secret_key
YOCO_PUBLIC_KEY=your_public_key
YOCO_WEBHOOK_SECRET=your_webhook_secret
YOCO_SANDBOX=true

# Peach Payments Configuration
PEACH_ENABLED=false
PEACH_ENTITY_ID=your_entity_id
PEACH_ACCESS_TOKEN=your_access_token
PEACH_SANDBOX=true

# PayGate Configuration
PAYGATE_ENABLED=false
PAYGATE_ID=your_paygate_id
PAYGATE_ENCRYPTION_KEY=your_encryption_key
PAYGATE_SANDBOX=true
```

### Gateway Priority
1. **PayFast** (Primary - most popular)
2. **Yoco** (Secondary - good for SMBs)
3. **Peach** (Enterprise - if enabled)
4. **PayGate** (Alternative - if enabled)

## API Endpoints

### 1. Get Available Gateways
```
GET /api/payment/gateways
```

**Response:**
```json
{
  "success": true,
  "gateways": [
    {
      "name": "payfast",
      "displayName": "PayFast",
      "enabled": true,
      "sandbox": true,
      "logo": "/images/gateways/payfast-logo.png",
      "description": "South Africa's leading payment gateway"
    }
  ],
  "count": 2,
  "primary": "payfast"
}
```

### 2. Create Payment
```
POST /api/payment/create
```

**Request:**
```json
{
  "orderId": "order_123",
  "gateway": "payfast" // Optional - will use fallback if not specified
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.payfast.co.za/eng/process?...",
  "paymentId": "payment_456",
  "gatewayPaymentId": "pf_789",
  "gatewayUsed": "payfast",
  "orderId": "order_123",
  "amount": 1000.00
}
```

### 3. Webhook Handler
```
POST /api/payment/webhook/[gateway]
```

**Supported Gateways:**
- `/api/payment/webhook/payfast`
- `/api/payment/webhook/yoco`
- `/api/payment/webhook/peach`
- `/api/payment/webhook/paygate`

### 4. Payment Status
```
GET /api/payment/status/[orderId]
```

## Usage Examples

### Frontend Integration

```typescript
// Get available gateways
const { data: gateways } = await fetch('/api/payment/gateways')

// Create payment with specific gateway
const payment = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'order_123',
    gateway: 'payfast' // Optional
  })
})

// Redirect to payment URL
if (payment.success) {
  window.location.href = payment.paymentUrl
}
```

### Backend Processing

```typescript
import { paymentManager } from '@/lib/payment-gateways/manager'

// Create payment with fallback
const result = await paymentManager.createPaymentWithFallback({
  orderId: 'order_123',
  amount: 1000.00,
  currency: 'ZAR',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  description: 'Order payment'
}, 'payfast') // Preferred gateway

// Process webhook
const notification = await paymentManager.processWebhook('payfast', webhookData)

// Check payment status
const status = await paymentManager.checkPaymentStatus('payfast', 'payment_id')
```

## Fallback Strategy

1. **Primary Gateway**: Try PayFast first
2. **Secondary Gateway**: If PayFast fails, try Yoco
3. **Tertiary Options**: Try Peach or PayGate if enabled
4. **Error Handling**: Return comprehensive error if all fail

## Security Features

### 1. Signature Verification
- Each gateway implements signature verification
- Webhooks are validated before processing
- Invalid signatures are rejected

### 2. HTTPS Enforcement
- All payment URLs use HTTPS
- Webhook endpoints require HTTPS
- Secure credential storage

### 3. Environment Separation
- Sandbox mode for testing
- Production credentials separate
- Gateway-specific security measures

## Monitoring & Logging

### 1. Payment Logs
```sql
CREATE TABLE payment_logs (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER REFERENCES payments(id),
  gateway_name VARCHAR(50),
  event VARCHAR(50),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Gateway Health Monitoring
- Track success rates per gateway
- Monitor response times
- Alert on gateway failures

### 3. Audit Trail
- Log all payment attempts
- Track gateway fallbacks
- Monitor webhook deliveries

## Testing

### 1. Sandbox Credentials
Each gateway provides sandbox credentials for testing:
- PayFast: Test merchant accounts
- Yoco: Test API keys
- Peach: Test entity IDs
- PayGate: Test gateway IDs

### 2. Test Scenarios
- Successful payments
- Failed payments
- Cancelled payments
- Webhook delivery
- Gateway fallbacks

## Production Deployment

### 1. Gateway Setup
1. Register with each gateway
2. Obtain production credentials
3. Configure webhook URLs
4. Test in sandbox first

### 2. Environment Configuration
1. Set production credentials
2. Disable sandbox mode
3. Configure proper URLs
4. Enable monitoring

### 3. Go-Live Checklist
- [ ] All gateways tested in sandbox
- [ ] Production credentials configured
- [ ] Webhook URLs accessible
- [ ] SSL certificates valid
- [ ] Monitoring enabled
- [ ] Fallback strategy tested

## Support & Maintenance

### 1. Gateway Updates
- Monitor gateway API changes
- Update implementations as needed
- Test changes in sandbox

### 2. Performance Optimization
- Cache gateway configurations
- Optimize webhook processing
- Monitor payment success rates

### 3. Troubleshooting
- Check gateway status pages
- Verify webhook deliveries
- Review payment logs
- Test fallback mechanisms
