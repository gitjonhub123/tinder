# Database Setup Instructions

## After Prisma Postgres is Created in Vercel

Once you've created the Prisma Postgres database in Vercel, follow these steps:

### Step 1: Verify DATABASE_URL is Set

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Confirm `DATABASE_URL` exists (Vercel should have set it automatically)

### Step 2: Run Initial Migration

You have two options:

#### Option A: Using Vercel CLI (Recommended)

1. Pull environment variables:
```bash
vercel env pull .env.local
```

2. Run migrations:
```bash
npx prisma migrate deploy
```

#### Option B: Using Vercel Database UI

1. Go to your Vercel project → **Storage** tab
2. Click on your Prisma Postgres database
3. Go to the **Data** or **SQL** tab
4. Run this SQL to create the initial schema:

```sql
-- Create Assessment table
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateName" TEXT NOT NULL,
    "candidateEmail" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "timeRemaining" INTEGER NOT NULL DEFAULT 2700,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Answer table
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "answerText" TEXT NOT NULL,
    "score" INTEGER,
    "lastSavedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Answer_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Admin table
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");
CREATE INDEX "Assessment_candidateEmail_idx" ON "Assessment"("candidateEmail");
CREATE UNIQUE INDEX "Answer_assessmentId_questionNumber_key" ON "Answer"("assessmentId", "questionNumber");
CREATE INDEX "Answer_assessmentId_idx" ON "Answer"("assessmentId");
```

### Step 3: Seed Admin Account (Optional)

After migrations are complete, you can seed an admin account:

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel environment variables
2. Or run the seed script locally after pulling env vars:
```bash
vercel env pull .env.local
npm run db:seed
```

### Step 4: Test the Connection

After migrations, try creating an assessment on your Vercel site. It should work!

## Troubleshooting

If you get "Database tables not found" error:
- Make sure migrations have been run
- Check that DATABASE_URL is correctly set
- Verify the database is active in Vercel Storage

If you get connection errors:
- Verify DATABASE_URL format is correct (should start with `postgresql://`)
- Check database is not paused
- Ensure network access is allowed
