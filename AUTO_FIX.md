# Auto-Fix: DATABASE_URL Setup

## The Problem
Vercel Prisma Postgres should automatically set `DATABASE_URL`, but sometimes it doesn't. Here's how to fix it:

## Quick Fix (2 minutes)

### Step 1: Get Connection String from Vercel

1. Open: https://vercel.com/dashboard
2. Project: **tinder**
3. Tab: **Storage**
4. Click: Your **Prisma Postgres** database
5. Find: **Connection String** or **.env** section
6. Copy: The `DATABASE_URL` value (starts with `postgresql://`)

### Step 2: Add to Vercel Environment Variables

**Via Dashboard:**
1. Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Name: `DATABASE_URL`
4. Value: [Paste connection string]
5. Environments: ✅ Production ✅ Preview ✅ Development
6. Click **Save**

**Via CLI (if you have the connection string):**
```bash
vercel env add DATABASE_URL production
# Paste connection string when prompted
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

### Step 3: Redeploy

After adding DATABASE_URL:
- Vercel will auto-redeploy, OR
- Go to **Deployments** → Click **⋯** → **Redeploy**

### Step 4: Run Migrations

After redeploy, create the database tables:

**Option A: Via Vercel Database UI**
1. Storage → Prisma Postgres → **Data** or **SQL** tab
2. Run the SQL from `SETUP_DATABASE.md`

**Option B: Via CLI**
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## Verify It Works

After completing these steps:
1. Go to your live site
2. Try creating an assessment
3. It should work! ✅

## Still Having Issues?

If DATABASE_URL is set but you still get errors:
- Check the connection string format (must start with `postgresql://`)
- Verify the database is active (not paused)
- Check Vercel logs for detailed error messages
