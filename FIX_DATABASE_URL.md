# Fix DATABASE_URL Error

The error shows that `DATABASE_URL` is not set in Vercel. Here's how to fix it:

## Step 1: Get Your Database Connection String

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to the **Storage** tab
4. Click on your **Prisma Postgres** database
5. Look for **Connection String** or **Connection Info** section
6. Copy the connection string (it should look like: `postgresql://user:password@host:port/database?sslmode=require`)

## Step 2: Add DATABASE_URL to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to your project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Name: `DATABASE_URL`
4. Value: Paste your connection string from Step 1
5. Select environments: **Production**, **Preview**, and **Development**
6. Click **Save**

### Option B: Via Vercel CLI

Run this command (replace with your actual connection string):
```bash
vercel env add DATABASE_URL production
```
Then paste your connection string when prompted.

## Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

Or trigger a new deployment by pushing to GitHub.

## Step 4: Run Migrations

After DATABASE_URL is set and the app is redeployed, run migrations:

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's database UI to run the SQL from `SETUP_DATABASE.md`.

## Quick Check

After setting DATABASE_URL, the error should disappear and the app should work!
