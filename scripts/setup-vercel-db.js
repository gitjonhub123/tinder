// Script to help set up DATABASE_URL in Vercel
// Run: node scripts/setup-vercel-db.js

console.log(`
╔══════════════════════════════════════════════════════════════╗
║        Vercel Database Setup Instructions                    ║
╚══════════════════════════════════════════════════════════════╝

The DATABASE_URL environment variable is not set in Vercel.

To fix this:

1. Go to: https://vercel.com/dashboard
2. Click on your project: "tinder"
3. Go to: Storage tab
4. Click on your Prisma Postgres database
5. Look for "Connection String" or "Connection Info"
6. Copy the connection string (starts with postgresql://)

7. Go to: Settings → Environment Variables
8. Click: "Add New"
9. Name: DATABASE_URL
10. Value: [Paste your connection string]
11. Select: Production, Preview, Development
12. Click: Save

13. Redeploy your app (or push to GitHub to trigger auto-deploy)

After this, run migrations:
  vercel env pull .env.local
  npx prisma migrate deploy

Or use the SQL from SETUP_DATABASE.md in Vercel's database UI.

═══════════════════════════════════════════════════════════════
`)

