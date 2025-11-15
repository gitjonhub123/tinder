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

    const answers = await prisma.answer.findMany({
      where: { assessmentId },
      orderBy: { questionNumber: 'asc' },
      select: {
        questionNumber: true,
        answerText: true,
        score: true,
      },
    })

    return NextResponse.json(answers)
  } catch (error) {
    console.error('Error fetching answers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    )
  }
}
