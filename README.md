# Atlas Assessment Platform

A professional machine learning assessment platform inspired by SAT Bluebook, built with Next.js 14, TypeScript, Prisma, and SQLite/PostgreSQL.

## Features

- **Candidate Assessment Flow**: 4-question ML assessment with 45-minute timer
- **Auto-save**: Answers saved every 30 seconds
- **Timer System**: Countdown with color changes (yellow <10min, red <5min)
- **Admin Dashboard**: Review, score, and email results
- **Email Integration**: Automated results delivery via Resend
- **Security**: Input validation, rate limiting, session management

## Quick Start (Local Development)

1. Install dependencies:
```bash
npm install
```

2. The app will automatically use SQLite (`file:./dev.db`) if `DATABASE_URL` is not set.

3. Run Prisma migrations (if needed):
```bash
npx prisma migrate dev
```

4. Seed admin account (optional):
```bash
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

## Vercel Deployment

**Important:** SQLite doesn't work on Vercel's serverless functions. You need to use PostgreSQL.

### Option 1: Use Vercel Postgres (Recommended)

1. In your Vercel project, go to Storage → Create Database → Postgres
2. Vercel will automatically set the `DATABASE_URL` environment variable
3. Update your Prisma schema to use PostgreSQL:
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - Run `npx prisma migrate deploy` to apply migrations
4. Redeploy your app

### Option 2: Use External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database (free tiers available):
   - [Supabase](https://supabase.com) - Free tier available
   - [Neon](https://neon.tech) - Free tier available
   - [Railway](https://railway.app) - Free tier available

2. Get your connection string (format: `postgresql://user:password@host:port/database?schema=public`)

3. In Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string

4. Update Prisma schema to PostgreSQL and run migrations:
```bash
# Update schema.prisma: provider = "postgresql"
npx prisma migrate deploy
```

5. Redeploy your app

## Environment Variables

For local development, these are optional (SQLite will be used by default):

```
DATABASE_URL="file:./dev.db"  # For SQLite (local only)
# OR
DATABASE_URL="postgresql://..."  # For PostgreSQL (production)

NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
EMAIL_API_KEY="your-resend-api-key"  # Optional, for email functionality
ADMIN_EMAIL="jongreat177@gmail.com"
ADMIN_PASSWORD="your-admin-password"  # For seeding admin account
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite for local, PostgreSQL for production)
- Resend (Email)
- bcryptjs (Password hashing)
- jose (JWT)