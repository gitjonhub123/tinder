import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateEmail, validateName, sanitizeInput } from '@/lib/validation'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 assessments per IP per hour
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(`assessment:${ip}`, 3, 3600000) // 1 hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!validateName(name)) {
      return NextResponse.json(
        { error: 'Invalid name' },
        { status: 400 }
      )
    }

    // Email is optional, but if provided, must be valid
    let sanitizedEmail: string | null = null
    if (email && email.trim()) {
      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }
      sanitizedEmail = sanitizeInput(email.toLowerCase())
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        candidateName: sanitizedName,
        candidateEmail: sanitizedEmail,
        timeRemaining: 2700, // 45 minutes
        status: 'in_progress',
      },
    })

    return NextResponse.json({ assessmentId: assessment.id })
  } catch (error: any) {
    console.error('Error creating assessment:', error)
    
    // Check for Prisma connection errors
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check DATABASE_URL configuration.' },
        { status: 500 }
      )
    }
    
    // Check for Prisma schema errors
    if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database tables not found. Please run Prisma migrations.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to create assessment. Please try again.' },
      { status: 500 }
    )
  }
}
