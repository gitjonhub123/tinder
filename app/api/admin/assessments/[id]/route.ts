import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const assessmentId = params.id

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        candidateName: true,
        candidateEmail: true,
        submittedAt: true,
        status: true,
      },
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      candidateName: assessment.candidateName,
      candidateEmail: assessment.candidateEmail,
      submittedAt: assessment.submittedAt?.toISOString() || null,
      status: assessment.status,
    })
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}
