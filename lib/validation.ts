import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')
export const nameSchema = z.string().min(1, 'Name is required').max(100, 'Name too long')
export const answerSchema = z.string().max(10000, 'Answer must be 10,000 characters or less')

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function validateName(name: string): boolean {
  return nameSchema.safeParse(name).success
}

export function sanitizeInput(input: string): string {
  // Basic XSS prevention
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
