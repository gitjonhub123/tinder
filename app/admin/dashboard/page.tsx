'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'

interface Assessment {
  id: string
  candidateName: string
  candidateEmail: string
  startedAt: string
  submittedAt: string | null
  status: string
  totalScore: number | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filter, setFilter] = useState<'all' | 'submitted' | 'scored'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSortBy, setExportSortBy] = useState<'score' | 'name' | 'submittedAt' | 'createdAt'>('score')
  const [exportSortOrder, setExportSortOrder] = useState<'asc' | 'desc'>('desc')
  const [emailConfigStatus, setEmailConfigStatus] = useState<{ configured: boolean; message: string } | null>(null)

  const itemsPerPage = 20

  useEffect(() => {
    loadAssessments()
    checkEmailConfig()
  }, [filter, currentPage])

  const checkEmailConfig = async () => {
    try {
      const response = await fetch('/api/admin/check-email-config')
      if (response.ok) {
        const data = await response.json()
        setEmailConfigStatus({ configured: data.configured, message: data.message })
      }
    } catch (error) {
      console.error('Error checking email config:', error)
    }
  }

  const loadAssessments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/admin/assessments?filter=${filter}&page=${currentPage}&limit=${itemsPerPage}`
      )
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to load assessments')
      }
      const data = await response.json()
      setAssessments(data.assessments)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error loading assessments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(
        `/api/admin/assessments/export-pdf?filter=${filter}&sortBy=${exportSortBy}&sortOrder=${exportSortOrder}`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.details || data.error || 'Failed to export PDF'
        console.error('PDF export error:', errorMsg)
        alert(`Error: ${errorMsg}\n\nPlease check:\n1. EMAIL_API_KEY is set in Vercel\n2. Email address is verified in Resend\n3. Check browser console for details`)
        return
      }

      alert(`PDF report sent to your email! (${data.count} assessments)\n\nCheck: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jongreat177@gmail.com'}`)
    } catch (error: any) {
      console.error('Error exporting PDF:', error)
      const errorMsg = error?.message || 'Network error or server unavailable'
      alert(`Failed to export PDF: ${errorMsg}\n\nPlease check your connection and try again.`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-atlas-text mb-6">Assessments</h2>

          <div className="mb-6 flex flex-col gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded font-semibold ${
                  filter === 'all'
                    ? 'bg-atlas-blue-light text-white'
                    : 'bg-atlas-gray text-atlas-text'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('submitted')}
                className={`px-4 py-2 rounded font-semibold ${
                  filter === 'submitted'
                    ? 'bg-atlas-blue-light text-white'
                    : 'bg-atlas-gray text-atlas-text'
                }`}
              >
                Submitted
              </button>
              <button
                onClick={() => setFilter('scored')}
                className={`px-4 py-2 rounded font-semibold ${
                  filter === 'scored'
                    ? 'bg-atlas-blue-light text-white'
                    : 'bg-atlas-gray text-atlas-text'
                }`}
              >
                Scored
              </button>
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              {emailConfigStatus && !emailConfigStatus.configured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  <strong>⚠️ Email Not Configured:</strong> {emailConfigStatus.message}
                </div>
              )}
              <div className="flex gap-4 items-center">
                <span className="text-sm font-semibold text-atlas-text">Export PDF:</span>
                <select
                  value={exportSortBy}
                  onChange={(e) => setExportSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  disabled={isExporting}
                >
                  <option value="score">Sort by Score</option>
                  <option value="name">Sort by Name</option>
                  <option value="submittedAt">Sort by Submission Date</option>
                  <option value="createdAt">Sort by Created Date</option>
                </select>
                <select
                  value={exportSortOrder}
                  onChange={(e) => setExportSortOrder(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  disabled={isExporting}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-6 py-2 bg-atlas-blue-light text-white rounded font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? 'Sending...' : 'Export & Email PDF'}
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-atlas-gray">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Candidate Name
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Started
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Submitted
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Total Score
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td className="border border-gray-300 px-4 py-3">
                          {assessment.candidateName}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {assessment.candidateEmail}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {formatDate(assessment.startedAt)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {formatDate(assessment.submittedAt)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              assessment.status === 'scored'
                                ? 'bg-atlas-success text-white'
                                : assessment.status === 'submitted'
                                ? 'bg-atlas-warning text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            {assessment.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {assessment.totalScore !== null
                            ? `${assessment.totalScore} / 2000`
                            : 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <Link
                            href={`/admin/assessment/${assessment.id}`}
                            className="text-atlas-blue-light hover:underline"
                          >
                            Review & Score
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-atlas-gray rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-atlas-gray rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
