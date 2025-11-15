import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For local development, use SQLite. For production (Vercel), use PostgreSQL
// Set DATABASE_URL environment variable:
// - Local: "file:./dev.db" (SQLite)
// - Vercel: PostgreSQL connection string
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma