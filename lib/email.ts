import { Resend } from 'resend'
import { Assessment, Answer } from '@prisma/client'
import { generateResultsPDF } from './pdf'

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

export async function sendResultsPDF(
  assessments: Array<{
    id: string
    candidateName: string
    candidateEmail: string | null
    startedAt: string
    submittedAt: string | null
    status: string
    totalScore: number | null
    createdAt: string
  }>,
  sortBy: string = 'score',
  sortOrder: string = 'desc'
) {
  // Check if email API key is configured
  const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY
  if (!apiKey) {
    const error = new Error('EMAIL_API_KEY or RESEND_API_KEY environment variable is not set. Please configure it in Vercel environment variables.')
    console.error('Email configuration error:', error.message)
    throw error
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'jongreat177@gmail.com'
    const dateStr = new Date().toLocaleDateString()

    console.log(`Generating PDF for ${assessments.length} assessments...`)
    
    // Generate PDF
    let pdfBuffer: Buffer
    try {
      pdfBuffer = await generateResultsPDF(assessments, sortBy, sortOrder)
      console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`)
    } catch (pdfError: any) {
      console.error('Error generating PDF:', pdfError)
      throw new Error(`PDF generation failed: ${pdfError?.message || 'Unknown error'}`)
    }

    // Use a verified email address for Resend
    // Resend free tier allows sending from onboarding@resend.dev or verified domains
    // For production, you should verify your domain in Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    console.log(`Sending email to ${adminEmail} from ${fromEmail}...`)

    // Send email with PDF attachment
    const resend = getResend()
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Atlas Assessment Results - ${dateStr}`,
      text: `Please find attached the Atlas Assessment Results report.\n\nTotal Assessments: ${assessments.length}\nSorted by: ${sortBy} (${sortOrder})`,
      attachments: [
        {
          filename: `atlas-assessment-results-${dateStr.replace(/\//g, '-')}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    })

    console.log('Email sent successfully:', emailResult)

    return { success: true }
  } catch (error: any) {
    console.error('Error sending PDF email:', error)
    
    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      throw new Error('Email API key is invalid or not configured. Please check EMAIL_API_KEY in Vercel environment variables.')
    } else if (error?.message?.includes('domain') || error?.message?.includes('from')) {
      throw new Error('Email "from" address is not verified. Please verify your domain in Resend or set RESEND_FROM_EMAIL to a verified email.')
    } else if (error?.message) {
      throw new Error(`Email sending failed: ${error.message}`)
    } else {
      throw new Error(`Email sending failed: ${error?.toString() || 'Unknown error'}`)
    }
  }
}
