import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        candidateName: true,
        candidateEmail: true,
        timeRemaining: true,
        status: true,
        startedAt: true,
        submittedAt: true,
      },
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Delete assessment (cascade will delete answers)
    await prisma.assessment.delete({
      where: { id: assessmentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting assessment:', error)
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    )
  }
}