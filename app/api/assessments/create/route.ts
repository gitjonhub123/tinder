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
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (!validateName(name)) {
      return NextResponse.json(
        { error: 'Invalid name' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email.toLowerCase())

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
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}
