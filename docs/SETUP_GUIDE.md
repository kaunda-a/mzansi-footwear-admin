# Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: 18.0 or higher
- **pnpm**: 8.0 or higher (recommended) or npm 9.0+
- **PostgreSQL**: 14.0 or higher
- **Git**: Latest version

### Accounts Required
- **Supabase**: For database hosting
- **Cloudinary**: For image storage
- **Vercel**: For deployment (optional)
- **Payment Gateways**: PayFast, Yoco, etc. (for production)

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd storm-dashboard
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_URL_INTERNAL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_SECRET=your_api_secret

# Image URL Configuration
NEXT_PUBLIC_IMAGE_URL=https://res.cloudinary.com/your_cloud_name/image/upload

# Payment Gateway Configuration (see Payment Setup section)
```

### 4. Database Setup
```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push

# Seed database (optional)
pnpm prisma db seed
```

### 5. Create Admin User
```bash
# Create super admin
node SuperAdmin.mjs

# Create guest user (optional)
node Guest.mjs
```

### 6. Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3001`

## Database Configuration

### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection strings:
   - **DATABASE_URL**: Use connection pooling URL
   - **DIRECT_URL**: Use direct connection URL

### Local PostgreSQL (Alternative)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb quirkify_dashboard

# Create user
sudo -u postgres createuser --interactive

# Set connection string
DATABASE_URL="postgresql://username:password@localhost:5432/quirkify_dashboard"
DIRECT_URL="postgresql://username:password@localhost:5432/quirkify_dashboard"
```

## Cloudinary Setup

### Account Creation
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy credentials:
   - **Cloud Name**
   - **API Secret**

### Configuration
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_IMAGE_URL=https://res.cloudinary.com/your_cloud_name/image/upload
```

## Payment Gateway Setup

### PayFast (Primary)
1. Register at [payfast.co.za](https://www.payfast.co.za)
2. Get sandbox credentials for testing
3. Configure environment:
```env
PAYFAST_ENABLED=true
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true
```

### Yoco (Secondary)
1. Register at [yoco.co.za](https://www.yoco.co.za)
2. Get API credentials
3. Configure environment:
```env
YOCO_ENABLED=true
YOCO_SECRET_KEY=your_secret_key
YOCO_PUBLIC_KEY=your_public_key
YOCO_WEBHOOK_SECRET=your_webhook_secret
YOCO_SANDBOX=true
```

### Additional Gateways
See [Multi-Gateway Payment System](./MULTI_GATEWAY_PAYMENT_SYSTEM.md) for Peach Payments and PayGate setup.

## Authentication Setup

### NextAuth Configuration
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_random_secret_here
```

Generate secret:
```bash
openssl rand -base64 32
```

### Admin User Creation
Run the admin creation scripts:
```bash
# Super admin with full access
node SuperAdmin.mjs

# Guest admin with limited access
node Guest.mjs
```

## Development Workflow

### Available Scripts
```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Database
pnpm prisma studio    # Open Prisma Studio
pnpm prisma generate  # Generate Prisma client
pnpm prisma db push   # Push schema changes
```

### Code Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utilities and configurations
├── api-hooks/           # React Query hooks
├── providers/           # Context providers
├── context/             # React Context
└── middleware.ts        # NextAuth middleware
```

## Testing

### Setup
Testing is configured with Jest and React Testing Library.

### Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test src/lib/__tests__/utils.test.ts

# Run with coverage
pnpm test:coverage

# Watch mode for development
pnpm test:watch
```

### Writing Tests
See [Testing Guide](./TESTING_GUIDE.md) for detailed testing patterns and examples.

## Production Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Environment Variables (Production)
```env
# Database (Production)
DATABASE_URL="postgresql://prod_user:password@prod_host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://prod_user:password@prod_host:port/database"

# NextAuth (Production)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret

# Payment Gateways (Production)
PAYFAST_SANDBOX=false
YOCO_SANDBOX=false
# ... other production credentials
```

### Build Process
```bash
# Build application
pnpm build

# Start production server
pnpm start
```

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check connection
pnpm prisma db pull

# Reset database
pnpm prisma migrate reset
```

#### Environment Variables
```bash
# Verify environment
node -e "console.log(process.env.DATABASE_URL)"
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Debug Mode
Enable debug logging:
```env
DEBUG=true
NODE_ENV=development
```

## Security Checklist

### Development
- [ ] Environment variables not committed
- [ ] Database credentials secure
- [ ] API keys protected
- [ ] HTTPS in production

### Production
- [ ] Strong NextAuth secret
- [ ] Production database credentials
- [ ] Payment gateway production keys
- [ ] SSL certificates configured
- [ ] CORS properly configured

## Performance Optimization

### Database
- Use connection pooling (pgbouncer)
- Index frequently queried fields
- Optimize Prisma queries

### Frontend
- Image optimization with Cloudinary
- React Query for caching
- Code splitting with Next.js

### Monitoring
- Set up error tracking (Sentry)
- Monitor database performance
- Track payment gateway success rates

## Support

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Multi-Gateway Payment System](./MULTI_GATEWAY_PAYMENT_SYSTEM.md)

### Getting Help
1. Check documentation
2. Review error logs
3. Test in sandbox environment
4. Contact payment gateway support if needed

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor payment gateway status
- Review error logs weekly
- Backup database regularly

### Updates
```bash
# Update dependencies
pnpm update

# Update Prisma
pnpm prisma generate
pnpm prisma db push
```
