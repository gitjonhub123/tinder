import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'jongreat177@gmail.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const config = {
      hasApiKey: !!apiKey,
      adminEmail,
      fromEmail,
      apiKeyLength: apiKey ? apiKey.length : 0,
    }

    return NextResponse.json({
      configured: !!apiKey,
      config,
      message: apiKey
        ? 'Email configuration looks good!'
        : 'EMAIL_API_KEY or RESEND_API_KEY is not set. Please configure it in Vercel environment variables.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check email configuration', details: error?.message },
      { status: 500 }
    )
  }
}

