import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id
    const body = await request.json()
    const { timeRemaining } = body

    if (typeof timeRemaining !== 'number' || timeRemaining < 0) {
      return NextResponse.json(
        { error: 'Invalid time remaining' },
        { status: 400 }
      )
    }

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { timeRemaining },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating timer:', error)
    return NextResponse.json(
      { error: 'Failed to update timer' },
      { status: 500 }
    )
  }
}
