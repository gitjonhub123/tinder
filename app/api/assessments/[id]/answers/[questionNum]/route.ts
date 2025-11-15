import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeInput } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; questionNum: string } }
) {
  try {
    const assessmentId = params.id
    const questionNumber = parseInt(params.questionNum)

    const answer = await prisma.answer.findUnique({
      where: {
        assessmentId_questionNumber: {
          assessmentId,
          questionNumber,
        },
      },
    })

    return NextResponse.json(answer || { answerText: '' })
  } catch (error) {
    console.error('Error fetching answer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch answer' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; questionNum: string } }
) {
  try {
    const assessmentId = params.id
    const questionNumber = parseInt(params.questionNum)
    const body = await request.json()
    const { answerText } = body

    if (!answerText || typeof answerText !== 'string') {
      return NextResponse.json(
        { error: 'Answer text is required' },
        { status: 400 }
      )
    }

    if (answerText.length > 10000) {
      return NextResponse.json(
        { error: 'Answer must be 10,000 characters or less' },
        { status: 400 }
      )
    }

    const sanitizedAnswer = sanitizeInput(answerText)

    // Upsert answer
    await prisma.answer.upsert({
      where: {
        assessmentId_questionNumber: {
          assessmentId,
          questionNumber,
        },
      },
      update: {
        answerText: sanitizedAnswer,
        lastSavedAt: new Date(),
      },
      create: {
        assessmentId,
        questionNumber,
        answerText: sanitizedAnswer,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving answer:', error)
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    )
  }
}
