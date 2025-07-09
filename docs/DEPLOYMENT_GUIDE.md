# Deployment Guide

## Overview
This guide covers deploying the Quirkify Dashboard to various platforms including Vercel, Netlify, and self-hosted environments.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All tests passing (`pnpm test`)
- [ ] Build successful (`pnpm build`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Payment gateways tested in sandbox
- [ ] Error boundaries implemented
- [ ] Performance optimized

### Security Review
- [ ] API endpoints secured
- [ ] Authentication properly configured
- [ ] Payment gateway credentials secure
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation in place

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub/GitLab repository
- Production database (Supabase recommended)

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select "Next.js" framework preset

### Step 2: Configure Build Settings
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_production_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_IMAGE_URL=https://res.cloudinary.com/your_cloud_name/image/upload

# Payment Gateways (Production)
PAYFAST_ENABLED=true
PAYFAST_MERCHANT_ID=your_prod_merchant_id
PAYFAST_MERCHANT_KEY=your_prod_merchant_key
PAYFAST_PASSPHRASE=your_prod_passphrase
PAYFAST_SANDBOX=false
PAYFAST_RETURN_URL=https://your-domain.vercel.app/payment/return
PAYFAST_CANCEL_URL=https://your-domain.vercel.app/payment/cancel
PAYFAST_NOTIFY_URL=https://your-domain.vercel.app/api/payment/webhook/payfast

# Additional gateways...
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test deployment thoroughly

### Step 5: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records
4. Update environment variables with new domain

## Netlify Deployment

### Step 1: Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Environment Variables
Configure in Netlify dashboard under Site Settings → Environment Variables.

### Step 3: Deploy
1. Connect repository to Netlify
2. Configure build settings
3. Deploy

**Note**: Netlify requires additional configuration for Next.js API routes using Netlify Functions.

## Self-Hosted Deployment

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: quirkify_dashboard
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### VPS Deployment

#### Prerequisites
- Ubuntu 20.04+ VPS
- Domain name
- SSL certificate

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

#### Step 2: Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive

# Create database
sudo -u postgres createdb quirkify_dashboard

# Set password
sudo -u postgres psql
ALTER USER username PASSWORD 'password';
\q
```

#### Step 3: Application Deployment
```bash
# Clone repository
git clone <repository-url>
cd storm-dashboard

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with production values

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma db push

# Build application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 4: Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration

### Production Migration Strategy
1. **Backup existing data**
2. **Test migrations in staging**
3. **Schedule maintenance window**
4. **Run migrations**
5. **Verify data integrity**
6. **Monitor application**

### Migration Commands
```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Run migrations
pnpm prisma db push

# Verify migration
pnpm prisma studio
```

## Payment Gateway Configuration

### Production Setup
1. **PayFast Production**
   - Register for production account
   - Get production merchant credentials
   - Configure webhook URLs
   - Test with small amounts

2. **Webhook URLs**
   ```
   PayFast: https://your-domain.com/api/payment/webhook/payfast
   Yoco: https://your-domain.com/api/payment/webhook/yoco
   ```

3. **SSL Requirements**
   - All payment URLs must use HTTPS
   - Valid SSL certificate required
   - Webhook endpoints must be accessible

## Monitoring & Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all
```

### Database Monitoring
```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Monitor query performance
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Error Tracking
Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **DataDog** for infrastructure monitoring

## Performance Optimization

### Build Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### Database Optimization
- Use connection pooling
- Index frequently queried fields
- Optimize Prisma queries
- Monitor slow queries

### CDN Configuration
- Use Cloudinary for images
- Enable Vercel Edge Network
- Configure proper caching headers

## Security Hardening

### Environment Security
- Use strong secrets
- Rotate credentials regularly
- Limit database access
- Enable firewall rules

### Application Security
- Enable CSRF protection
- Implement rate limiting
- Validate all inputs
- Use HTTPS everywhere

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_$DATE.sql"

# Upload to cloud storage
aws s3 cp "backup_$DATE.sql" s3://your-backup-bucket/
```

### Application Backups
- Code repository (Git)
- Environment configurations
- SSL certificates
- Application data

## Rollback Plan

### Quick Rollback
1. **Vercel**: Use deployment rollback feature
2. **Self-hosted**: 
   ```bash
   git checkout previous-commit
   pnpm build
   pm2 restart all
   ```

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup_file.sql

# Run previous migrations if needed
git checkout previous-migration
pnpm prisma db push
```

## Post-Deployment Verification

### Health Checks
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Database connections stable
- [ ] Payment gateways functional
- [ ] API endpoints responding
- [ ] Error boundaries working
- [ ] Performance acceptable

### Testing Checklist
- [ ] User registration/login
- [ ] Product management
- [ ] Order processing
- [ ] Payment flows
- [ ] Admin functions
- [ ] Mobile responsiveness
- [ ] Error handling

## Maintenance

### Regular Tasks
- **Weekly**: Review error logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: SSL certificate renewal

### Update Process
1. Test updates in staging
2. Schedule maintenance window
3. Create backup
4. Deploy updates
5. Verify functionality
6. Monitor for issues
