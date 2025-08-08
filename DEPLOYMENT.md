# Vercel Deployment Guide

## Prerequisites

1. **GitHub Account**: Make sure your project is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project**: Ensure your Supabase project is set up and running

## Step 1: Environment Variables Setup

Before deploying, you'll need to configure these environment variables in Vercel:

### Required Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Optional Environment Variables:
```
WEBHOOK_URL=https://the88gb.app.n8n.cloud/webhook-test/522cae37-699e-4c3c-8028-96bcbe99ddd6
```

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set up environment variables when prompted
   - Choose your team/account

### Method 2: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

## Step 3: Configure Environment Variables

1. **In your Vercel project dashboard**, go to Settings → Environment Variables
2. **Add each environment variable**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEBHOOK_URL` (optional)

3. **Set deployment scope**:
   - Production: ✅
   - Preview: ✅
   - Development: ✅

## Step 4: Database Setup

Ensure your Supabase database has all required tables:

1. **Run the SQL scripts** in your Supabase SQL editor:
   - `database_schema.sql`
   - `campaign_influencers_schema.sql`
   - `add_summary_column.sql`
   - `sample_analytics_data.sql` (optional)

## Step 5: Deploy

1. **Trigger deployment**:
   - If using CLI: `vercel --prod`
   - If using dashboard: Click "Deploy"

2. **Monitor deployment** in the Vercel dashboard

## Step 6: Verify Deployment

1. **Check your live URL** (provided by Vercel)
2. **Test all features**:
   - Dashboard loading
   - Brand management
   - Campaign creation
   - Influencer management
   - Webhook integration

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally

2. **Environment Variable Issues**:
   - Verify all required env vars are set in Vercel
   - Check that `NEXT_PUBLIC_` prefix is used for client-side variables

3. **Database Connection Issues**:
   - Verify Supabase URL and keys are correct
   - Check that database tables exist
   - Ensure RLS policies allow your app to access data

4. **API Route Errors**:
   - Check Vercel function logs in dashboard
   - Verify API routes are properly structured

### Useful Commands:

```bash
# Test build locally
npm run build

# Run production build locally
npm run start

# Check for linting issues
npm run lint
```

## Post-Deployment

1. **Set up custom domain** (optional) in Vercel dashboard
2. **Configure automatic deployments** from your GitHub repository
3. **Set up monitoring** and error tracking
4. **Test all functionality** on the live site

## Security Notes

- Never commit `.env` files to your repository
- Use Vercel's environment variable system for secrets
- Ensure Supabase RLS policies are properly configured
- Consider setting up authentication if needed
