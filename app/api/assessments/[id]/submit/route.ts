import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Check if all 4 answers exist
    const answers = await prisma.answer.findMany({
      where: { assessmentId },
    })

    if (answers.length < 4) {
      return NextResponse.json(
        { error: 'All 4 questions must be answered' },
        { status: 400 }
      )
    }

    // Update assessment status
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
