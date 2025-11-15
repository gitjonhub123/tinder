'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'

export default function InstructionsPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string
  const [isLoading, setIsLoading] = useState(false)

  const handleBegin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/start`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to start assessment')
      router.push(`/assessment/${assessmentId}/question/1`)
    } catch (error) {
      alert('Failed to start assessment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel? This will delete your assessment.')) {
      return
    }

    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to cancel assessment')
      router.push('/')
    } catch (error) {
      alert('Failed to cancel assessment. Please try again.')
    }
  }

  return (
    <>
      <Header />
      <main className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-[800px] mx-auto px-8 py-16">
          <h2 className="text-2xl font-bold text-atlas-text mb-8">Instructions</h2>
          
          <div className="space-y-6 mb-8">
            <p className="text-base leading-relaxed text-atlas-text">
              You are about to begin the Atlas assessment.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-atlas-text mb-3">Assessment Structure:</h3>
              <ul className="list-disc list-inside space-y-2 text-atlas-text ml-4">
                <li>4 machine learning questions</li>
                <li>45 minutes total</li>
                <li>Navigate freely between questions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-atlas-text mb-3">Scoring:</h3>
              <ul className="list-disc list-inside space-y-2 text-atlas-text ml-4">
                <li>Each answer scored out of 500 points</li>
                <li>Maximum total: 2000 points</li>
                <li>Answers evaluated by senior ML engineers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-atlas-text mb-3">Guidelines:</h3>
              <ul className="list-disc list-inside space-y-2 text-atlas-text ml-4">
                <li>Type directly in the text box</li>
                <li>Include code, formulas, and reasoning</li>
                <li>Reference research and methods</li>
              </ul>
            </div>

            <p className="text-base leading-relaxed text-atlas-text mt-6">
              Ready to begin?
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBegin}
              disabled={isLoading}
              className="bg-atlas-blue-light text-white py-3 px-8 rounded font-semibold text-base h-12 hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Begin Assessment
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-atlas-gray text-atlas-text py-3 px-8 rounded font-semibold text-base h-12 hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
