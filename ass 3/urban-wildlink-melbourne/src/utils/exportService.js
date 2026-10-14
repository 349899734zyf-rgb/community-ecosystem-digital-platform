/**
 * exportService.js
 * BR (E.4): Data Export (CSV & PDF)
 * 
 * Clean, standard utility for exporting dataset records to CSV and PDF files.
 * Zero complex wrappers - purely native Blob for CSV, and standard jsPDF for PDF.
 */

import jsPDF from 'jspdf'

/**
 * Export Adoption Applications to CSV format
 * @param {Array} applications - list of adoption application objects
 */
export function exportApplicationsToCSV(applications) {
  if (!applications || applications.length === 0) {
    alert('No application records to export.')
    return
  }

  // 1. Define CSV Header Columns
  const headers = [
    'Application ID',
    'Applicant Name',
    'Contact Email',
    'Suburb Address',
    'Requested Plant',
    'Quantity',
    'Garden Type',
    'Status',
    'Submitted Timestamp'
  ]

  // 2. Format row values with proper escaping
  const rows = applications.map(app => [
    `"${app.id || ''}"`,
    `"${(app.applicantName || app.userName || '').replace(/"/g, '""')}"`,
    `"${(app.contactEmail || app.userEmail || '').replace(/"/g, '""')}"`,
    `"${(app.address || '').replace(/"/g, '""')}"`,
    `"${(app.plantName || '').replace(/"/g, '""')}"`,
    app.quantity || 1,
    `"${(app.gardenType || '').replace(/"/g, '""')}"`,
    `"${app.status || 'Pending'}"`,
    `"${app.submittedAt || ''}"`
  ])

  // 3. Combine header and rows into CSV string
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')

  // 4. Trigger browser download using native Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `Urban_WildLink_Adoptions_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export Master Species Inventory to PDF format
 * @param {Array} plants - list of plant species objects
 */
export function exportInventoryToPDF(plants) {
  if (!plants || plants.length === 0) {
    alert('No species inventory records to export.')
    return
  }

  // 1. Initialize jsPDF document (A4 portrait)
  const doc = new jsPDF()

  // 2. Title & Organization Header
  doc.setFontSize(18)
  doc.setTextColor(40, 167, 69) // Success Green
  doc.text('Urban WildLink Melbourne', 14, 20)

  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.text('Official Native Flora Inventory & Stock Control Report', 14, 28)

  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(`Generated Date: ${new Date().toLocaleString()} | Total Species: ${plants.length}`, 14, 34)

  // Divider line
  doc.setDrawColor(200, 200, 200)
  doc.line(14, 38, 196, 38)

  // 3. Render Plant Records
  let yPosition = 46
  doc.setFontSize(10)

  plants.forEach((plant, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }

    doc.setTextColor(30, 30, 30)
    doc.setFont(undefined, 'bold')
    doc.text(`${index + 1}. ${plant.name} [${plant.category}]`, 14, yPosition)

    doc.setFont(undefined, 'normal')
    doc.setTextColor(100, 100, 100)
    const stockText = `Stock: ${plant.stock} seedlings | Adoptions: ${plant.adoptedCount || 0} | Water: ${plant.waterNeeds || 'Moderate'}`
    doc.text(stockText, 14, yPosition + 5)

    yPosition += 12
  })

  // 4. Save file
  doc.save(`Urban_WildLink_Inventory_${new Date().toISOString().slice(0, 10)}.pdf`)
}
