import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'default-secret-change-in-production'
)

export async function createSession(adminId: string): Promise<string> {
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
  
  return token
}

export async function verifySession(token: string): Promise<{ adminId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return { adminId: payload.adminId as string }
  } catch {
    return null
  }
}

export async function getSession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-session')?.value
  if (!token) return null
  return verifySession(token)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
