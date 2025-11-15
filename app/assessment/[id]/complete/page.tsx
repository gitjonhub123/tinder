'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'

export default function CompletePage() {
  const params = useParams()
  const assessmentId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${assessmentId}`)
        if (response.ok) {
          // Assessment loaded successfully
        }
      } catch (error) {
        console.error('Error loading assessment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessment()
  }, [assessmentId])

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-[60px] min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-[700px] mx-auto px-8 py-16">
          <h2 className="text-[40px] md:text-[36px] sm:text-[32px] font-bold mb-8" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#1E3A5F' }}>
            Assessment Complete
          </h2>

          <p className="text-[18px] md:text-[16px] sm:text-[15px] font-normal text-center mb-8" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#333333', lineHeight: '1.8' }}>
            Your assessment has been submitted.
          </p>

          <div className="mb-[100px]"></div>

          <p className="text-[18px] md:text-[16px] sm:text-[15px] font-normal text-center mb-8" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#333333', lineHeight: '1.8' }}>
            Top performers will be invited to technical interviews at leading AI organizations.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#333333' }}>
              What happens next:
            </h3>
            <p className="text-[18px] md:text-[16px] sm:text-[15px] leading-relaxed mb-4" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#333333', lineHeight: '1.8' }}>
              Your responses will be reviewed and scored by senior machine learning engineers.
            </p>
            <p className="text-[18px] md:text-[16px] sm:text-[15px] leading-relaxed mb-4" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#333333', lineHeight: '1.8' }}>
              Each answer is scored out of 500 points (maximum 2000 total).
            </p>
            <p className="text-[18px] md:text-[16px] sm:text-[15px] leading-relaxed" style={{ fontFamily: 'Georgia, Garamond, serif', color: '#333333', lineHeight: '1.8' }}>
              Your assessment has been submitted successfully. Results will be available through the admin dashboard.
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
