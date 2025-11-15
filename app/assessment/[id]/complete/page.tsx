'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'

export default function CompletePage() {
  const params = useParams()
  const assessmentId = params.id as string
  const [assessment, setAssessment] = useState<{
    candidateName: string
    candidateEmail: string
    submittedAt: string
  } | null>(null)

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${assessmentId}`)
        if (response.ok) {
          const data = await response.json()
          setAssessment({
            candidateName: data.candidateName,
            candidateEmail: data.candidateEmail,
            submittedAt: data.submittedAt,
          })
        }
      } catch (error) {
        console.error('Error loading assessment:', error)
      }
    }

    loadAssessment()
  }, [assessmentId])

  if (!assessment) {
    return (
      <>
        <Header />
        <main className="pt-[60px] min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </>
    )
  }

  const submittedDate = new Date(assessment.submittedAt).toLocaleString()

  return (
    <>
      <Header />
      <main className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-[700px] mx-auto px-8 py-16">
          <h2 className="text-3xl font-bold text-atlas-success mb-8">
            Assessment Complete
          </h2>

          <p className="text-base leading-relaxed text-atlas-text mb-8">
            Your assessment has been successfully submitted.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-atlas-success text-xl">✓</span>
              <span className="text-base text-atlas-text">All 4 answers received</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-atlas-success text-xl">✓</span>
              <span className="text-base text-atlas-text">
                Submission time: {submittedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-atlas-success text-xl">✓</span>
              <span className="text-base text-atlas-text">
                Candidate: {assessment.candidateName}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-atlas-text mb-4">
              What happens next:
            </h3>
            <p className="text-base leading-relaxed text-atlas-text mb-4">
              Your responses will be reviewed and scored by senior machine learning engineers.
            </p>
            <p className="text-base leading-relaxed text-atlas-text mb-4">
              Each answer is scored out of 500 points (maximum 2000 total).
            </p>
            <p className="text-base leading-relaxed text-atlas-text">
              Results will be sent to: <strong>{assessment.candidateEmail}</strong>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-base text-atlas-text">Thank you for participating.</p>
            <p className="text-lg font-semibold text-atlas-text mt-2">Atlas Assessment</p>
          </div>
        </div>
      </main>
    </>
  )
}
