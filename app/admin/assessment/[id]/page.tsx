'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { QUESTIONS } from '@/lib/questions'

interface Answer {
  questionNumber: number
  answerText: string
  score: number | null
}

export default function ReviewAssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<{
    candidateName: string
    candidateEmail: string
    submittedAt: string
  } | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [scores, setScores] = useState<{ [key: number]: number }>({})
  const [adminNotes, setAdminNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [assessmentId])

  const loadData = async () => {
    try {
      const [assessmentRes, answersRes] = await Promise.all([
        fetch(`/api/admin/assessments/${assessmentId}`),
        fetch(`/api/admin/assessments/${assessmentId}/answers`),
      ])

      if (assessmentRes.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!assessmentRes.ok || !answersRes.ok) {
        throw new Error('Failed to load data')
      }

      const assessmentData = await assessmentRes.json()
      const answersData = await answersRes.json()

      setAssessment(assessmentData)
      setAnswers(answersData)

      // Initialize scores
      const initialScores: { [key: number]: number } = {}
      answersData.forEach((answer: Answer) => {
        if (answer.score !== null) {
          initialScores[answer.questionNumber] = answer.score
        }
      })
      setScores(initialScores)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScoreChange = (questionNumber: number, value: string) => {
    const score = parseInt(value) || 0
    if (score >= 0 && score <= 500) {
      setScores({ ...scores, [questionNumber]: score })
    }
  }

  const calculateTotal = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }

  const handleSave = async (sendEmail = false) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/assessments/${assessmentId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          adminNotes,
          sendEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save scores')
      }

      if (sendEmail) {
        alert('Scores saved and email sent!')
      } else {
        alert('Scores saved!')
      }

      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error saving scores:', error)
      alert('Failed to save scores. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-[60px] min-h-screen bg-white flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </>
    )
  }

  if (!assessment) {
    return (
      <>
        <Header />
        <main className="pt-[60px] min-h-screen bg-white flex items-center justify-center">
          <div>Assessment not found</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-atlas-text mb-6">Review & Score</h2>

          <div className="mb-8 p-6 bg-atlas-gray rounded">
            <p className="text-base text-atlas-text">
              <strong>Candidate:</strong> {assessment.candidateName}
            </p>
            <p className="text-base text-atlas-text">
              <strong>Email:</strong> {assessment.candidateEmail}
            </p>
            <p className="text-base text-atlas-text">
              <strong>Submitted:</strong> {new Date(assessment.submittedAt).toLocaleString()}
            </p>
          </div>

          <div className="space-y-8 mb-8">
            {QUESTIONS.map((question, index) => {
              const questionNum = index + 1
              const answer = answers.find((a) => a.questionNumber === questionNum)
              const score = scores[questionNum] || 0

              return (
                <div key={questionNum} className="border border-gray-300 rounded p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-atlas-text mb-2">
                      Question {questionNum}: {question.title}
                    </h3>
                    <div className="prose max-w-none mb-4">
                      <p className="text-base leading-relaxed text-atlas-text whitespace-pre-line">
                        {question.text}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-atlas-text mb-2">
                      Candidate Answer:
                    </h4>
                    <div className="p-4 bg-atlas-gray rounded border border-gray-300">
                      <p className="text-base leading-relaxed text-atlas-text whitespace-pre-wrap">
                        {answer?.answerText || 'No answer provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-atlas-text mb-2">
                      Score (0-500):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={score}
                      onChange={(e) => handleScoreChange(questionNum, e.target.value)}
                      className="w-32 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-atlas-blue-light"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mb-6 p-6 bg-atlas-gray rounded">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-atlas-text">Total Score:</span>
              <span className="text-2xl font-bold text-atlas-text">
                {calculateTotal()} / 2000
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-atlas-text mb-2">
              Admin Notes:
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full min-h-[150px] p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-atlas-blue-light"
              placeholder="Add any notes about this assessment..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="bg-atlas-gray text-atlas-text py-3 px-8 rounded font-semibold h-12 hover:bg-opacity-90 transition disabled:opacity-50"
            >
              Save Scores
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="bg-atlas-blue-light text-white py-3 px-8 rounded font-semibold h-12 hover:bg-opacity-90 transition disabled:opacity-50"
            >
              Save & Email Results
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
