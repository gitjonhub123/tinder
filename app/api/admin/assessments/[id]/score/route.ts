import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { sendResultsEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const assessmentId = params.id
    const body = await request.json()
    const { scores, adminNotes, sendEmail } = body

    // Update scores for each answer
    for (const [questionNumber, score] of Object.entries(scores)) {
      const qNum = parseInt(questionNumber)
      if (qNum >= 1 && qNum <= 4 && typeof score === 'number' && score >= 0 && score <= 500) {
        await prisma.answer.updateMany({
          where: {
            assessmentId,
            questionNumber: qNum,
          },
          data: {
            score,
          },
        })
      }
    }

    // Update assessment status
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: 'scored',
      },
    })

    // Send email if requested
    if (sendEmail) {
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: {
          answers: {
            orderBy: { questionNumber: 'asc' },
          },
        },
      })

      if (assessment) {
        await sendResultsEmail(assessment, scores, adminNotes)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving scores:', error)
    return NextResponse.json(
      { error: 'Failed to save scores' },
      { status: 500 }
    )
  }
}
