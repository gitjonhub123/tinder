import { Resend } from 'resend'
import { Assessment, Answer } from '@prisma/client'

function getResend() {
  const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('EMAIL_API_KEY or RESEND_API_KEY environment variable is required')
  }
  return new Resend(apiKey)
}

export async function sendResultsEmail(
  assessment: Assessment & { answers: Answer[] },
  scores: { [key: number]: number },
  adminNotes: string
) {
  try {
    // If no email provided, skip sending
    if (!assessment.candidateEmail) {
      console.log('No email provided, skipping email send')
      return { success: true, skipped: true }
    }

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const adminEmail = process.env.ADMIN_EMAIL || 'jongreat177@gmail.com'

    const emailContent = `
Your Atlas Assessment Results

Dear ${assessment.candidateName},

Thank you for completing the Atlas Machine Learning Assessment. Your responses have been reviewed and scored.

SCORES:
${assessment.answers.map((answer, index) => {
  const questionNum = index + 1
  const score = scores[questionNum] || 0
  return `Question ${questionNum}: ${score} / 500 points`
}).join('\n')}

Total Score: ${totalScore} / 2000 points

${adminNotes ? `\nAdmin Notes:\n${adminNotes}\n` : ''}

Thank you for participating in the Atlas Assessment.

Best regards,
Atlas Assessment Team
    `.trim()

    // Send to candidate
    const resend = getResend()
    await resend.emails.send({
      from: 'Atlas Assessment <noreply@atlas-assessment.com>',
      to: assessment.candidateEmail,
      cc: adminEmail,
      subject: 'Your Atlas Assessment Results',
      text: emailContent,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
