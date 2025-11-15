# Vercel Setup Guide

## Quick Fix: Set Up Vercel Postgres (5 minutes)

SQLite doesn't work on Vercel's serverless functions. You need PostgreSQL. Here's the easiest way:

### Step 1: Add Vercel Postgres to Your Project

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Click on your project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Click **Create** (free tier is available)

Vercel will automatically:
- Create a PostgreSQL database
- Set the `DATABASE_URL` environment variable
- Make it available to your app

### Step 2: Update Prisma Schema for PostgreSQL

After creating the database, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite" to "postgresql"
  url      = env("DATABASE_URL")
}
```

Also update the Answer model:
```prisma
model Answer {
  // ... other fields
  answerText     String     @db.Text  // Add @db.Text back
  // ... rest of fields
}
```

### Step 3: Run Migrations

In your Vercel project, go to **Settings → Environment Variables** and make sure `DATABASE_URL` is set (it should be auto-set by Vercel Postgres).

Then run migrations. You can do this via:
- Vercel CLI: `vercel env pull` then `npx prisma migrate deploy`
- Or use Vercel's built-in database UI to run the SQL

### Step 4: Redeploy

After updating the schema and running migrations, redeploy your app. It should work!

## Alternative: Use External PostgreSQL

If you prefer an external database:

1. **Supabase** (Recommended - Free tier):
   - Go to https://supabase.com
   - Create a new project
   - Get your connection string from Settings → Database
   - Add it as `DATABASE_URL` in Vercel environment variables

2. **Neon** (Also free tier):
   - Go to https://neon.tech
   - Create a database
   - Get connection string
   - Add to Vercel as `DATABASE_URL`

3. Update Prisma schema to PostgreSQL (same as Step 2 above)
4. Run migrations
5. Redeploy

## Current Status

Right now, the app is configured for SQLite (local development). For Vercel production, you need to:
1. Set up PostgreSQL (Vercel Postgres is easiest)
2. Update the schema to use PostgreSQL
3. Run migrations
4. Redeploy

The app will work locally with SQLite, but needs PostgreSQL for Vercel.
