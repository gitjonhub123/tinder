import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (filter === 'submitted') {
      where.status = 'submitted'
    } else if (filter === 'scored') {
      where.status = 'scored'
    }

    // Get assessments with total score
    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          answers: {
            select: {
              score: true,
            },
          },
        },
      }),
      prisma.assessment.count({ where }),
    ])

    // Calculate total scores
    const assessmentsWithScores = assessments.map((assessment) => {
      const totalScore = assessment.answers.reduce(
        (sum, answer) => sum + (answer.score || 0),
        0
      )
      return {
        id: assessment.id,
        candidateName: assessment.candidateName,
        candidateEmail: assessment.candidateEmail,
        startedAt: assessment.startedAt.toISOString(),
        submittedAt: assessment.submittedAt?.toISOString() || null,
        status: assessment.status,
        totalScore: assessment.status === 'scored' ? totalScore : null,
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      assessments: assessmentsWithScores,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}
