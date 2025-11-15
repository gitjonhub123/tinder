# Step-by-Step Fix for DATABASE_URL

## The Issue
Your Prisma Postgres database was created, but `DATABASE_URL` environment variable wasn't automatically set.

## Fix in 3 Steps (Takes 2 minutes)

### ✅ Step 1: Get Your Database Connection String

1. Open: **https://vercel.com/dashboard**
2. Click on project: **tinder**
3. Click tab: **Storage** (at the top)
4. You should see your **Prisma Postgres** database listed
5. Click on it
6. Look for one of these sections:
   - **Connection String**
   - **.env** 
   - **Connection Info**
   - **Settings** → **Connection String**
7. Copy the connection string (looks like: `postgresql://user:pass@host:port/db?sslmode=require`)

### ✅ Step 2: Add DATABASE_URL to Vercel

1. Still in your project, click: **Settings** (top menu)
2. Click: **Environment Variables** (left sidebar)
3. Click button: **Add New**
4. Fill in:
   - **Key:** `DATABASE_URL`
   - **Value:** [Paste the connection string from Step 1]
   - **Environments:** Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
5. Click: **Save**

### ✅ Step 3: Redeploy

**Option A: Auto-redeploy**
- Vercel should automatically redeploy after you save the environment variable
- Wait 1-2 minutes

**Option B: Manual redeploy**
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

### ✅ Step 4: Create Database Tables (After Redeploy)

After the app redeploys, you need to create the database tables:

**Easy Way - Via Vercel Database UI:**
1. Go to **Storage** → Your Prisma Postgres database
2. Click **Data** or **SQL** tab
3. Copy and paste the SQL from `SETUP_DATABASE.md` file
4. Click **Run** or **Execute**

**Or Via CLI:**
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## ✅ Done!

After completing these steps, your app should work. Try creating an assessment - it should succeed!

## Need Help?

If you can't find the connection string:
- Check the **Settings** tab of your database
- Look for **Connection Info** or **Environment Variables** section
- The connection string should be visible there

If DATABASE_URL is already set but you still get errors:
- Check the format (must start with `postgresql://`)
- Verify it's set for all environments (Production, Preview, Development)
- Check Vercel deployment logs for detailed errors
