# Quick Fix for Vercel

The app is currently configured for SQLite, which **doesn't work on Vercel**. Here's the fastest way to fix it:

## Option 1: Use Vercel Postgres (Easiest - 2 minutes)

1. Go to https://vercel.com/dashboard
2. Click your project → **Storage** tab
3. Click **Create Database** → Select **Postgres** → **Create**
4. Vercel automatically sets `DATABASE_URL`

5. In Vercel project **Settings → Environment Variables**, add:
   - `DATABASE_PROVIDER` = `postgresql`

6. Update `prisma/schema.prisma` line 9:
   ```prisma
   provider = "postgresql"  // Change from conditional to just "postgresql"
   ```

7. Redeploy - it will work!

## Option 2: Use Free External PostgreSQL (3 minutes)

1. Go to https://supabase.com (free tier)
2. Create project → Get connection string
3. In Vercel: Add environment variable `DATABASE_URL` = your connection string
4. Add `DATABASE_PROVIDER` = `postgresql`
5. Update schema to `provider = "postgresql"`
6. Redeploy

## Current Issue

Right now the app builds but fails at runtime because:
- SQLite needs a file system
- Vercel serverless functions have read-only file system
- You need PostgreSQL for Vercel

**The fix:** Set up PostgreSQL (Vercel Postgres is easiest) and update the schema provider.
