# Atlas Assessment Platform

A professional machine learning assessment platform inspired by SAT Bluebook, built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- **Candidate Assessment Flow**: 4-question ML assessment with 45-minute timer
- **Auto-save**: Answers saved every 30 seconds
- **Timer System**: Countdown with color changes (yellow <10min, red <5min)
- **Admin Dashboard**: Review, score, and email results
- **Email Integration**: Automated results delivery via Resend
- **Security**: Input validation, rate limiting, session management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/atlas_assessment"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
EMAIL_API_KEY="your-resend-api-key"
ADMIN_EMAIL="jongreat177@gmail.com"
ADMIN_PASSWORD="your-admin-password"
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Seed admin account:
```bash
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

## Deployment

This app is ready for Vercel deployment. Ensure all environment variables are set in Vercel dashboard.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Resend (Email)
- bcryptjs (Password hashing)
- jose (JWT)