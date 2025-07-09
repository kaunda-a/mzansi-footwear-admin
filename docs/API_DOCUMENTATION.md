# API Documentation

## Overview
This document provides comprehensive documentation for all API endpoints in the Quirkify Dashboard application.

## Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://quirkify-dashboard.vercel.app/api`

## Authentication
All API endpoints require authentication via NextAuth.js session cookies, except where noted.

### Headers
```
Cookie: next-auth.session-token=<session_token>
Content-Type: application/json
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Dashboard APIs

### Get Dashboard Statistics
Get real-time dashboard metrics including orders, revenue, customers, and sales.

**Endpoint:** `GET /api/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "pendingOrders": {
      "value": 5,
      "percentage": null
    },
    "totalRevenue": {
      "value": 50000,
      "percentage": {
        "increased": true,
        "value": 10
      }
    },
    "totalCustomers": {
      "value": 100,
      "percentage": {
        "increased": true,
        "value": 5
      }
    },
    "totalSales": {
      "value": 200,
      "percentage": {
        "increased": false,
        "value": 2
      }
    }
  }
}
```

### Get Revenue Data
Get revenue analytics with period filtering.

**Endpoint:** `GET /api/dashboard/revenue?period={period}`

**Parameters:**
- `period` (optional): `weekly` | `monthly` | `yearly` (default: `weekly`)

**Response:**
```json
{
  "success": true,
  "revenueData": [
    {
      "name": "Mon",
      "total": 1000
    },
    {
      "name": "Tue", 
      "total": 1500
    }
  ],
  "period": "weekly",
  "totalRevenue": 2500,
  "orderCount": 10
}
```

### Get Customer Analytics
Get top customers and registration analytics.

**Endpoint:** `GET /api/dashboard/customers?type={type}&period={period}`

**Parameters:**
- `type`: `top` | `registrations`
- `period` (for registrations): `weekly` | `monthly` | `yearly`

**Response (Top Customers):**
```json
{
  "success": true,
  "topCustomers": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://example.com/avatar.jpg",
      "amountSpent": 5000,
      "purchases": 10,
      "lastPurchase": "2 days ago"
    }
  ]
}
```

## Product APIs

### Get Products
Retrieve paginated list of products.

**Endpoint:** `GET /api/products?page={page}&limit={limit}`

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "prod_123",
      "title": "Product Name",
      "basePrice": 1000,
      "images": ["image1.jpg"],
      "category": {
        "name": "Electronics"
      },
      "colors": [
        {
          "color": "Red",
          "thumbnail": "red_thumb.jpg",
          "others": ["red1.jpg", "red2.jpg"]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Create Product
Create a new product.

**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "title": "New Product",
  "basePrice": "1000",
  "categoryId": "cat_123",
  "colors": [
    {
      "color": "Blue",
      "thumbnail": "blue_thumb.jpg",
      "others": ["blue1.jpg", "blue2.jpg"]
    }
  ],
  "description": "Product description"
}
```

### Update Product
Update an existing product.

**Endpoint:** `PUT /api/products/[id]`

**Request Body:** Same as create product

### Delete Product
Delete a product.

**Endpoint:** `DELETE /api/products/[id]`

## Order APIs

### Get Orders
Retrieve paginated list of orders.

**Endpoint:** `GET /api/orders?page={page}&status={status}`

**Parameters:**
- `page` (optional): Page number
- `status` (optional): Filter by order status

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_123",
      "total": 1500,
      "status": "pending",
      "payment_verified": false,
      "orderDate": "2024-01-15T10:30:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "orderItems": [
        {
          "quantity": 2,
          "price": 750,
          "product": {
            "title": "Product Name"
          }
        }
      ]
    }
  ]
}
```

### Get Order Details
Get detailed information about a specific order.

**Endpoint:** `GET /api/orders/[id]`

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "total": 1500,
    "status": "delivered",
    "payment_verified": true,
    "orderDate": "2024-01-15T10:30:00Z",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+27123456789"
    },
    "address": {
      "street": "123 Main St",
      "city": "Cape Town",
      "province": "Western Cape",
      "postalCode": "8000"
    },
    "orderItems": [
      {
        "id": "item_123",
        "quantity": 2,
        "price": 750,
        "color": "Blue",
        "product": {
          "title": "Product Name",
          "images": ["product.jpg"]
        }
      }
    ],
    "Payment": [
      {
        "id": "payment_123",
        "amount": 1500,
        "method": "payfast",
        "status": "completed",
        "gateway_payment_id": "pf_789"
      }
    ]
  }
}
```

### Update Order Status
Update the status of an order.

**Endpoint:** `PUT /api/orders/[id]/status`

**Request Body:**
```json
{
  "status": "ongoing" | "delivered" | "cancelled"
}
```

## Customer APIs

### Get Customers
Retrieve paginated list of customers.

**Endpoint:** `GET /api/customers?page={page}&search={search}`

**Parameters:**
- `page` (optional): Page number
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "customers": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+27123456789",
      "createdAt": "2024-01-01T00:00:00Z",
      "_count": {
        "Order": 5
      },
      "totalSpent": 7500
    }
  ]
}
```

### Get Customer Details
Get detailed information about a specific customer.

**Endpoint:** `GET /api/customers/[id]`

**Response:**
```json
{
  "success": true,
  "customer": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "createdAt": "2024-01-01T00:00:00Z",
    "addresses": [
      {
        "id": "addr_123",
        "street": "123 Main St",
        "city": "Cape Town",
        "province": "Western Cape",
        "postalCode": "8000",
        "isDefault": true
      }
    ],
    "orders": [
      {
        "id": "order_123",
        "total": 1500,
        "status": "delivered",
        "orderDate": "2024-01-15T10:30:00Z"
      }
    ],
    "stats": {
      "totalOrders": 5,
      "totalSpent": 7500,
      "averageOrderValue": 1500,
      "lastOrderDate": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Payment APIs

### Get Available Gateways
Get list of available payment gateways.

**Endpoint:** `GET /api/payment/gateways`

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

### Create Payment
Create a payment for an order.

**Endpoint:** `POST /api/payment/create`

**Request Body:**
```json
{
  "orderId": "order_123",
  "gateway": "payfast"
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

### Get Payment Status
Check the status of a payment.

**Endpoint:** `GET /api/payment/status/[orderId]`

**Response:**
```json
{
  "success": true,
  "orderId": "order_123",
  "orderStatus": "ongoing",
  "paymentVerified": true,
  "total": 1500,
  "payment": {
    "id": "payment_456",
    "status": "completed",
    "method": "payfast",
    "gateway_payment_id": "pf_789",
    "amount": 1500
  }
}
```

## Admin APIs

### Get Admins
Retrieve list of admin users.

**Endpoint:** `GET /api/admins`

**Response:**
```json
{
  "success": true,
  "admins": [
    {
      "id": "admin_123",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Admin
Create a new admin user.

**Endpoint:** `POST /api/admins`

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "securepassword",
  "role": "ADMIN" | "SUPERADMIN"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Rate Limiting
- **Dashboard APIs**: 100 requests per minute
- **Product APIs**: 200 requests per minute
- **Order APIs**: 150 requests per minute
- **Payment APIs**: 50 requests per minute

## Webhooks
Payment gateway webhooks are handled at:
- PayFast: `POST /api/payment/webhook/payfast`
- Yoco: `POST /api/payment/webhook/yoco`
- Peach: `POST /api/payment/webhook/peach`
- PayGate: `POST /api/payment/webhook/paygate`
