'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '@/components/Header'
import { QUESTIONS } from '@/lib/questions'

export default function QuestionPage() {
  const params = useParams()
  const assessmentId = params.id as string
  const questionNum = parseInt(params.questionNum as string)
  const router = useRouter()

  const [answer, setAnswer] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(2700)
  const [isSaving, setIsSaving] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const question = QUESTIONS[questionNum - 1]
  const isLastQuestion = questionNum === 4

  // Load assessment and answer
  useEffect(() => {
    const loadData = async () => {
      try {
        const [assessmentRes, answerRes] = await Promise.all([
          fetch(`/api/assessments/${assessmentId}`),
          fetch(`/api/assessments/${assessmentId}/answers/${questionNum}`),
        ])

        if (assessmentRes.ok) {
          const assessment = await assessmentRes.json()
          setTimeRemaining(assessment.timeRemaining)
        }

        if (answerRes.ok) {
          const answerData = await answerRes.json()
          if (answerData.answerText) {
            setAnswer(answerData.answerText)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [assessmentId, questionNum])

  const saveAnswer = useCallback(async (isAutoSave = false) => {
    if (answer.length > 10000) {
      alert('Answer must be 10,000 characters or less')
      return
    }

    setIsSaving(true)
    try {
      await fetch(`/api/assessments/${assessmentId}/answers/${questionNum}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerText: answer }),
      })
      if (!isAutoSave) {
        alert('Answer saved!')
      }
    } catch (error) {
      console.error('Error saving answer:', error)
      if (!isAutoSave) {
        alert('Failed to save answer. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }, [answer, assessmentId, questionNum])

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveIntervalRef.current = setInterval(() => {
      saveAnswer(true)
    }, 30000) // 30 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [saveAnswer])

  const handleAutoSubmit = useCallback(async () => {
    // Save current answer first
    await saveAnswer(true)
    
    // Submit all answers
    try {
      await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
      })
      router.push(`/assessment/${assessmentId}/complete`)
    } catch (error) {
      console.error('Error submitting:', error)
    }
  }, [assessmentId, router, saveAnswer])

  // Timer countdown
  useEffect(() => {
    let lastServerUpdate = timeRemaining
    
    const timerInterval = setInterval(async () => {
      setTimeRemaining((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1
        
        // Update server every minute
        if (newTime % 60 === 0 && newTime !== lastServerUpdate) {
          lastServerUpdate = newTime
          fetch(`/api/assessments/${assessmentId}/timer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timeRemaining: newTime }),
          }).catch(console.error)
        }
        
        if (newTime === 0) {
          handleAutoSubmit()
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [assessmentId, handleAutoSubmit])

  const handleSubmit = async () => {
    // Save current answer first
    await saveAnswer(true)
    
    // Submit all answers
    try {
      await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
      })
      router.push(`/assessment/${assessmentId}/complete`)
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Failed to submit. Please try again.')
    }
  }

  const handlePrevious = () => {
    if (questionNum > 1) {
      router.push(`/assessment/${assessmentId}/question/${questionNum - 1}`)
    }
  }

  const handleNext = () => {
    if (questionNum < 4) {
      router.push(`/assessment/${assessmentId}/question/${questionNum + 1}`)
    }
  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <>
      <Header
        title={`Atlas Assessment | Question ${questionNum} of 4`}
        timerSeconds={timeRemaining}
        onTimerExpire={handleAutoSubmit}
      />
      <main className="pt-[100px] min-h-screen bg-white">
        <div className="max-w-[900px] mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-atlas-text mb-6">
            Question {questionNum} of 4
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-atlas-text mb-4">
              {question.title}
            </h3>
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed text-atlas-text whitespace-pre-line">
                {question.text}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="answer" className="block text-lg font-semibold text-atlas-text mb-3">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => {
                if (e.target.value.length <= 10000) {
                  setAnswer(e.target.value)
                }
              }}
              className="w-full min-h-[500px] p-4 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-atlas-blue-light resize-y"
              placeholder="Type your answer here..."
            />
            <div className="mt-2 text-sm text-atlas-text">
              Character count: {answer.length} / 10,000
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={questionNum === 1}
              className="bg-atlas-gray text-atlas-text py-3 px-6 rounded font-semibold h-12 hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => saveAnswer(false)}
                disabled={isSaving}
                className="bg-atlas-gray text-atlas-text py-3 px-6 rounded font-semibold h-12 hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Answer'}
              </button>

              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  className="bg-atlas-blue-light text-white py-3 px-6 rounded font-semibold h-12 hover:bg-opacity-90 transition"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-atlas-success text-white py-3 px-6 rounded font-semibold h-12 hover:bg-opacity-90 transition"
                >
                  Submit All Answers
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {showSubmitModal && (
        <SubmitModal
          timeRemaining={timeRemaining}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </>
  )
}

function SubmitModal({
  timeRemaining,
  onConfirm,
  onCancel,
}: {
  timeRemaining: number
  onConfirm: () => void
  onCancel: () => void
}) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-atlas-text mb-4">Submit Assessment?</h3>
        <p className="text-base text-atlas-text mb-4">
          You are about to submit your answers.
        </p>
        <ul className="list-disc list-inside space-y-2 text-atlas-text mb-4 ml-4">
          <li>You cannot change answers after submission</li>
          <li>Time remaining: {displayTime}</li>
        </ul>
        <div className="flex gap-4 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-atlas-gray text-atlas-text py-3 px-6 rounded font-semibold h-12 hover:bg-opacity-90 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-atlas-blue-light text-white py-3 px-6 rounded font-semibold h-12 hover:bg-opacity-90 transition"
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  )
}
