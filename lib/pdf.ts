import PDFDocument from 'pdfkit'

interface AssessmentWithScore {
  id: string
  candidateName: string
  candidateEmail: string | null
  startedAt: string
  submittedAt: string | null
  status: string
  totalScore: number | null
  createdAt: string
}

export async function generateResultsPDF(
  assessments: AssessmentWithScore[],
  sortBy: string = 'score',
  sortOrder: string = 'desc'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers)
        resolve(pdfBuffer)
      })
      doc.on('error', reject)

      // Header
      doc.fontSize(20).text('Atlas Assessment Results', { align: 'center' })
      doc.moveDown(0.5)
      doc
        .fontSize(12)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
      doc.moveDown(1)

      // Sort info
      const sortLabel =
        sortBy === 'score'
          ? 'Score'
          : sortBy === 'name'
          ? 'Name'
          : sortBy === 'submittedAt'
          ? 'Submission Date'
          : 'Created Date'
      doc
        .fontSize(10)
        .text(`Sorted by: ${sortLabel} (${sortOrder === 'desc' ? 'Descending' : 'Ascending'})`, {
          align: 'left',
        })
      doc.moveDown(1)

      // Table header
      const startX = 50
      const startY = doc.y
      let currentY = startY

      // Header row background
      doc
        .rect(startX, currentY, 500, 25)
        .fillColor('#1E3A5F')
        .fill()
        .fillColor('black')

      // Header text
      doc.fontSize(10).fillColor('white')
      doc.text('Rank', startX + 5, currentY + 8)
      doc.text('Name', startX + 50, currentY + 8)
      doc.text('Email', startX + 200, currentY + 8)
      doc.text('Score', startX + 350, currentY + 8)
      doc.text('Status', startX + 420, currentY + 8)
      doc.fillColor('black')
      currentY += 25

      // Data rows
      assessments.forEach((assessment, index) => {
        // Check if we need a new page
        if (currentY > 700) {
          doc.addPage()
          currentY = 50
        }

        const rank = index + 1
        const name = assessment.candidateName || 'N/A'
        const email = assessment.candidateEmail || 'N/A'
        const score =
          assessment.totalScore !== null
            ? `${assessment.totalScore} / 2000`
            : 'Not Scored'
        const status = assessment.status || 'N/A'

        // Row background (alternating)
        if (index % 2 === 0) {
          doc
            .rect(startX, currentY, 500, 20)
            .fillColor('#f5f5f5')
            .fill()
            .fillColor('black')
        }

        // Row text
        doc.fontSize(9).fillColor('black')
        doc.text(rank.toString(), startX + 5, currentY + 6)
        doc.text(name.substring(0, 25), startX + 50, currentY + 6)
        doc.text(email.substring(0, 25), startX + 200, currentY + 6)
        doc.text(score, startX + 350, currentY + 6)
        doc.text(status, startX + 420, currentY + 6)

        currentY += 20
      })

      // Footer
      doc.moveDown(2)
      doc
        .fontSize(10)
        .text(`Total Assessments: ${assessments.length}`, { align: 'center' })
      doc
        .fontSize(10)
        .text(
          `Scored: ${assessments.filter((a) => a.status === 'scored').length} | Submitted: ${assessments.filter((a) => a.status === 'submitted').length}`,
          { align: 'center' }
        )

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

