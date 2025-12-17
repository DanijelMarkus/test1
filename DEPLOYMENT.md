# Friday Deployment Guide

This guide covers deploying the Friday Intent-Driven Employee Assistant to production environments.

## Prerequisites

- Node.js 18+ installed
- Access to Microsoft Entra ID (Azure AD) tenant
- Azure subscription (for production deployment)
- npm or yarn package manager

## Microsoft Entra ID Setup

### 1. Create App Registration

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Microsoft Entra ID** → **App registrations**
3. Click **New registration**

**Configuration**:
- **Name**: Friday Employee Assistant
- **Supported account types**: 
  - Single tenant (for internal use)
  - Or multi-tenant (if needed)
- **Redirect URI**: 
  - Type: Web
  - URL: `https://your-domain.com` (production)
  - URL: `http://localhost:3000` (development)

### 2. Configure Authentication

Under **Authentication** section:
- Enable **Access tokens** (implicit flow)
- Enable **ID tokens** (implicit flow)
- Add additional redirect URIs if needed
- Set **Front-channel logout URL** (optional)

### 3. Create Client Secret

Under **Certificates & secrets**:
1. Click **New client secret**
2. Add description: "Friday Backend Secret"
3. Set expiration (recommend: 12-24 months)
4. **Copy the secret value immediately** (shown only once)

### 4. Configure API Permissions

Under **API permissions**:

**Microsoft Graph** (Delegated):
- `User.Read` - Read user profile
- `Calendars.Read` - Read user calendar
- `Calendars.ReadWrite` - Create calendar events
- `Sites.Read.All` - Read SharePoint sites (for news)
- `Mail.Read` - Read user email (optional)

Click **Grant admin consent** for your organization.

### 5. Configure Token Configuration (Optional)

Under **Token configuration**:
- Add optional claims if needed
- Configure group claims (if using role-based access)

### 6. Note the IDs

Copy these values for environment configuration:
- **Application (client) ID**
- **Directory (tenant) ID**
- **Client secret value** (from step 3)

## Environment Configuration

### Development Environment

Create `.env.local` file:

```env
# Microsoft Entra ID
NEXT_PUBLIC_ENTRA_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_ENTRA_TENANT_ID=your-tenant-id-here
NEXT_PUBLIC_ENTRA_REDIRECT_URI=http://localhost:3000

# Backend API
ENTRA_CLIENT_SECRET=your-client-secret-here

# Microsoft Graph (optional override)
GRAPH_API_ENDPOINT=https://graph.microsoft.com/v1.0
GRAPH_API_SCOPE=https://graph.microsoft.com/.default

# Optional: External Connectors
SERVICENOW_INSTANCE_URL=https://your-instance.service-now.com
SERVICENOW_CLIENT_ID=your-servicenow-client-id
SERVICENOW_CLIENT_SECRET=your-servicenow-client-secret

WORKDAY_API_ENDPOINT=https://your-tenant.workday.com
WORKDAY_CLIENT_ID=your-workday-client-id
WORKDAY_CLIENT_SECRET=your-workday-client-secret

CUSTOM_MCP_ENDPOINT=https://your-custom-mcp.example.com
CUSTOM_MCP_API_KEY=your-custom-mcp-api-key

# Agent365 / Agent ID
AGENT365_REGISTRY_ENDPOINT=https://agent365-registry.example.com
```

### Production Environment

For production, use secure secret management:

**Azure Key Vault** (Recommended):
```typescript
// Use @azure/keyvault-secrets
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);
```

**Environment Variables** (Azure App Service):
Set in **Configuration** → **Application settings**

## Deployment Options

### Option 1: Azure App Service (Recommended)

#### Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name friday-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name friday-plan \
  --resource-group friday-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --name friday-assistant \
  --resource-group friday-rg \
  --plan friday-plan \
  --runtime "NODE:18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group friday-rg \
  --name friday-assistant \
  --settings \
    NEXT_PUBLIC_ENTRA_CLIENT_ID="your-client-id" \
    NEXT_PUBLIC_ENTRA_TENANT_ID="your-tenant-id" \
    NEXT_PUBLIC_ENTRA_REDIRECT_URI="https://friday-assistant.azurewebsites.net" \
    ENTRA_CLIENT_SECRET="@Microsoft.KeyVault(SecretUri=https://your-vault.vault.azure.net/secrets/friday-secret/)"

# Deploy from GitHub
az webapp deployment source config \
  --name friday-assistant \
  --resource-group friday-rg \
  --repo-url https://github.com/DanijelMarkus/test1 \
  --branch main \
  --manual-integration
```

#### Using Azure Portal

1. Navigate to **App Services** → **Create**
2. Configure:
   - Resource Group: Create new
   - Name: friday-assistant
   - Runtime: Node 18 LTS
   - OS: Linux
   - Region: Your preferred region
3. Click **Create**
4. After deployment, go to **Configuration**
5. Add application settings (environment variables)
6. Go to **Deployment Center**
7. Configure GitHub deployment

### Option 2: Azure Static Web Apps

```bash
# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Login
swa login

# Deploy
swa deploy \
  --app-location "/" \
  --api-location "app/api" \
  --output-location ".next" \
  --deployment-token $DEPLOYMENT_TOKEN
```

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_ENTRA_CLIENT_ID
vercel env add NEXT_PUBLIC_ENTRA_TENANT_ID
vercel env add ENTRA_CLIENT_SECRET

# Deploy to production
vercel --prod
```

### Option 4: Docker Container

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Build and deploy:

```bash
# Build image
docker build -t friday-assistant .

# Run locally
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ENTRA_CLIENT_ID=your-client-id \
  -e NEXT_PUBLIC_ENTRA_TENANT_ID=your-tenant-id \
  friday-assistant

# Push to Azure Container Registry
az acr login --name yourregistry
docker tag friday-assistant yourregistry.azurecr.io/friday-assistant:latest
docker push yourregistry.azurecr.io/friday-assistant:latest

# Deploy to Azure Container Apps
az containerapp create \
  --name friday-assistant \
  --resource-group friday-rg \
  --image yourregistry.azurecr.io/friday-assistant:latest \
  --environment friday-env \
  --ingress external \
  --target-port 3000
```

## Post-Deployment Configuration

### 1. Update Redirect URIs

In Microsoft Entra ID app registration:
- Add production URL to redirect URIs
- Add logout URL
- Update CORS settings if needed

### 2. Configure Custom Domain (Optional)

**Azure App Service**:
```bash
# Add custom domain
az webapp config hostname add \
  --resource-group friday-rg \
  --webapp-name friday-assistant \
  --hostname friday.yourdomain.com

# Bind SSL certificate
az webapp config ssl bind \
  --resource-group friday-rg \
  --name friday-assistant \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```

### 3. Enable Monitoring

**Application Insights**:
```bash
# Create Application Insights
az monitor app-insights component create \
  --app friday-insights \
  --location eastus \
  --resource-group friday-rg

# Link to App Service
az webapp config appsettings set \
  --resource-group friday-rg \
  --name friday-assistant \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=your-key"
```

### 4. Configure CDN (Optional)

For static assets:
```bash
# Create CDN profile
az cdn profile create \
  --name friday-cdn \
  --resource-group friday-rg \
  --sku Standard_Microsoft

# Create endpoint
az cdn endpoint create \
  --name friday \
  --profile-name friday-cdn \
  --resource-group friday-rg \
  --origin friday-assistant.azurewebsites.net
```

## Security Hardening

### 1. Enable HTTPS Only

```bash
az webapp update \
  --resource-group friday-rg \
  --name friday-assistant \
  --https-only true
```

### 2. Configure CORS

In `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ];
  },
};
```

### 3. Set Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

### 4. Rate Limiting

Consider using Azure Front Door or API Management:
```bash
# Create API Management instance
az apim create \
  --name friday-apim \
  --resource-group friday-rg \
  --publisher-email admin@yourdomain.com \
  --publisher-name "Your Company"
```

## Monitoring & Observability

### Application Insights Queries

**User Activity**:
```kusto
traces
| where timestamp > ago(1h)
| where message contains "orchestrator-execution"
| summarize count() by tostring(customDimensions.userId)
```

**Intent Distribution**:
```kusto
traces
| where timestamp > ago(24h)
| where message contains "Intent:"
| summarize count() by tostring(customDimensions.intentType)
```

**Error Rate**:
```kusto
exceptions
| where timestamp > ago(1h)
| summarize count() by problemId
```

### Health Checks

Add health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## Troubleshooting

### Common Issues

**Issue: "Login failed" or redirect loop**
- Verify redirect URI matches exactly (including trailing slash)
- Check client ID and tenant ID are correct
- Ensure app registration has proper permissions

**Issue: "Token acquisition failed"**
- Verify client secret is correct and not expired
- Check token configuration in app registration
- Ensure user has proper role assignments

**Issue: "API calls fail with 401"**
- Verify OBO flow is configured correctly
- Check API permissions are granted and consented
- Ensure access token is being passed correctly

**Issue: "Build fails in production"**
- Check all environment variables are set
- Verify Node.js version matches
- Review build logs for specific errors

## Rollback Procedure

### Azure App Service
```bash
# List deployment slots
az webapp deployment slot list \
  --name friday-assistant \
  --resource-group friday-rg

# Swap slots (rollback)
az webapp deployment slot swap \
  --name friday-assistant \
  --resource-group friday-rg \
  --slot staging \
  --target-slot production
```

### Docker
```bash
# Rollback to previous image version
docker pull yourregistry.azurecr.io/friday-assistant:previous-tag
docker stop friday-assistant
docker rm friday-assistant
docker run -d --name friday-assistant yourregistry.azurecr.io/friday-assistant:previous-tag
```

## Maintenance

### Regular Tasks

**Weekly**:
- Review Application Insights metrics
- Check error logs
- Monitor API response times

**Monthly**:
- Review and rotate secrets
- Update dependencies
- Review audit logs

**Quarterly**:
- Security audit
- Performance optimization
- User feedback review

## Support

For deployment issues, contact:
- IT Support: support@yourdomain.com
- Development Team: friday-dev@yourdomain.com

---

**Last Updated**: December 2024  
**Version**: 1.0.0
