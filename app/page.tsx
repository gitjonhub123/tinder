'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function StartPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: { name?: string; email?: string } = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/assessments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMessage = data.error || 'Failed to create assessment'
        throw new Error(errorMessage)
      }

      const data = await response.json()
      router.push(`/assessment/${data.assessmentId}/instructions`)
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-[700px] mx-auto px-8 py-16">
          <h2 className="text-2xl font-bold text-atlas-text mb-4">
            Atlas Machine Learning Assessment
          </h2>
          
          <div className="space-y-6 mb-8">
            <p className="text-base leading-relaxed text-atlas-text">
              Welcome. This assessment contains 4 advanced machine learning questions.
            </p>
            <p className="text-base leading-relaxed text-atlas-text">
              You have 45 minutes to complete all questions.
            </p>
            
            <div className="mt-6">
              <p className="font-semibold text-atlas-text mb-3">Before you begin:</p>
              <ul className="list-disc list-inside space-y-2 text-atlas-text ml-4">
                <li>Answer all questions to the best of your ability</li>
                <li>You may navigate between questions freely</li>
                <li>Your progress is automatically saved</li>
                <li>Timer cannot be paused once started</li>
              </ul>
            </div>

            <p className="font-semibold text-atlas-text mt-6">
              Enter your information to begin:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-atlas-text mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border rounded ${
                  errors.name ? 'border-atlas-error' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-atlas-blue-light`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-atlas-error">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-atlas-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded ${
                  errors.email ? 'border-atlas-error' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-atlas-blue-light`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-atlas-error">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-atlas-blue-light text-white py-3 px-6 rounded font-semibold text-base h-12 hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Start Assessment'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}