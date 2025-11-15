import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { sendResultsPDF } from '@/lib/email'

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'all'
    const sortBy = searchParams.get('sortBy') || 'score'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}
    if (filter === 'submitted') {
      where.status = 'submitted'
    } else if (filter === 'scored') {
      where.status = 'scored'
    }

    // Get all assessments (no pagination for export)
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        answers: {
          select: {
            score: true,
          },
        },
      },
    })

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
        createdAt: assessment.createdAt.toISOString(),
      }
    })

    // Sort the results
    assessmentsWithScores.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'score':
          aValue = a.totalScore ?? -1
          bValue = b.totalScore ?? -1
          break
        case 'name':
          aValue = a.candidateName.toLowerCase()
          bValue = b.candidateName.toLowerCase()
          break
        case 'submittedAt':
          aValue = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
          bValue = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          aValue = a.totalScore ?? -1
          bValue = b.totalScore ?? -1
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    // Generate PDF and send email
    try {
      await sendResultsPDF(assessmentsWithScores, sortBy, sortOrder)
    } catch (emailError: any) {
      console.error('Error sending PDF email:', emailError)
      // Return detailed error message
      const errorMessage = emailError?.message || 'Unknown error occurred'
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: errorMessage,
          count: assessmentsWithScores.length,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'PDF report sent to your email',
      count: assessmentsWithScores.length,
    })
  } catch (error: any) {
    console.error('Error exporting PDF:', error)
    const errorMessage = error?.message || 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: 'Failed to export PDF',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

