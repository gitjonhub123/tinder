import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Update assessment to mark as started (timer starts)
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        // Timer starts when this is called
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error starting assessment:', error)
    return NextResponse.json(
      { error: 'Failed to start assessment' },
      { status: 500 }
    )
  }
}
