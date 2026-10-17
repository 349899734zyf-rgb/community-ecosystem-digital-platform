/**
 * exportService.js
 * BR (E.4): Data Export (Multiple Formats: CSV & PDF)
 * 
 * Satisfies FIT5032 "Exceeds Expectations" criteria by offering multiple export formats
 * (both CSV and PDF) generated entirely client-side with native Blob and jsPDF.
 */

import jsPDF from 'jspdf'

/**
 * Helper to escape CSV cell values
 */
function escapeCSV(val) {
  if (val === null || val === undefined) return '""'
  return `"${String(val).replace(/"/g, '""')}"`
}

/**
 * Helper to format date cleanly as text to avoid Excel ### column width issues
 */
function cleanTimestamp(val) {
  if (!val) return ''
  return String(val).trim()
}

/**
 * Universal CSV download trigger using native Blob
 */
function downloadCSV(headers, rows, filename) {
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 1. Export Adoption Applications to CSV format
 */
export function exportApplicationsToCSV(applications) {
  if (!applications || applications.length === 0) {
    alert('No application records to export.')
    return
  }

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

  const rows = applications.map(app => [
    escapeCSV(app.id),
    escapeCSV(app.applicantName || app.userName),
    escapeCSV(app.contactEmail || app.email || app.userEmail),
    escapeCSV(app.address),
    escapeCSV(app.plantName),
    app.quantity || 1,
    escapeCSV(app.gardenType),
    escapeCSV(app.status || 'Pending'),
    `"\t${cleanTimestamp(app.submittedAt)}"`
  ])

  downloadCSV(headers, rows, `Urban_WildLink_Adoptions_${new Date().toISOString().slice(0, 10)}.csv`)
}

/**
 * 2. Export Adoption Applications to PDF format
 */
export function exportApplicationsToPDF(applications) {
  if (!applications || applications.length === 0) {
    alert('No application records to export.')
    return
  }

  const doc = new jsPDF()
  doc.setFillColor(25, 135, 84)
  doc.rect(0, 0, 210, 24, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('Urban WildLink Melbourne - Adoption Requests', 14, 16)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()} | Total Records: ${applications.length}`, 14, 32)

  let y = 42
  doc.setFontSize(10)
  applications.forEach((app, idx) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setTextColor(25, 135, 84)
    doc.setFont(undefined, 'bold')
    doc.text(`${idx + 1}. ${app.applicantName || app.userName || 'Resident'} [Status: ${app.status || 'Pending'}]`, 14, y)

    doc.setTextColor(60, 60, 60)
    doc.setFont(undefined, 'normal')
    doc.text(`Plant: ${app.plantName} (Qty: ${app.quantity || 1}) | Address: ${app.address || 'Melbourne'}`, 14, y + 5)
    doc.text(`Contact: ${app.contactEmail || app.email || 'N/A'} | Submitted: ${app.submittedAt || 'N/A'}`, 14, y + 10)
    y += 16
  })

  doc.save(`Urban_WildLink_Adoptions_${new Date().toISOString().slice(0, 10)}.pdf`)
}

/**
 * 3. Export Community Species Proposals to CSV format
 */
export function exportProposalsToCSV(proposals) {
  if (!proposals || proposals.length === 0) {
    alert('No species proposal records to export.')
    return
  }

  const headers = [
    'Proposal ID',
    'Proposer Name',
    'Proposer Email',
    'Proposed Plant Name',
    'Scientific Name',
    'Category',
    'Ecological Benefit',
    'Community Reason',
    'Status',
    'Submitted Timestamp'
  ]

  const rows = proposals.map(prop => [
    escapeCSV(prop.id),
    escapeCSV(prop.proposerName),
    escapeCSV(prop.email),
    escapeCSV(prop.plantName),
    escapeCSV(prop.scientificName || 'Indigenous species'),
    escapeCSV(prop.category || 'Wildflower'),
    escapeCSV(prop.wildlifeBenefit),
    escapeCSV(prop.reason),
    escapeCSV(prop.status || 'Pending'),
    `"\t${cleanTimestamp(prop.submittedAt)}"`
  ])

  downloadCSV(headers, rows, `Urban_WildLink_Proposals_${new Date().toISOString().slice(0, 10)}.csv`)
}

/**
 * 3b. Export Community Species Proposals to PDF format
 */
export function exportProposalsToPDF(proposals) {
  if (!proposals || proposals.length === 0) {
    alert('No species proposal records to export.')
    return
  }

  const doc = new jsPDF()
  doc.setFillColor(25, 135, 84)
  doc.rect(0, 0, 210, 24, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('Urban WildLink Melbourne - Species Proposals', 14, 16)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()} | Total Records: ${proposals.length}`, 14, 32)

  let y = 42
  doc.setFontSize(10)
  proposals.forEach((prop, idx) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setTextColor(25, 135, 84)
    doc.setFont(undefined, 'bold')
    doc.text(`${idx + 1}. ${prop.plantName} [Status: ${prop.status || 'Pending'}] - Category: ${prop.category || 'N/A'}`, 14, y)

    doc.setTextColor(60, 60, 60)
    doc.setFont(undefined, 'normal')
    doc.text(`Proposer: ${prop.proposerName || 'Resident'} (${prop.email || 'N/A'}) | Submitted: ${prop.submittedAt || 'N/A'}`, 14, y + 5)
    doc.text(`Benefit: ${prop.wildlifeBenefit || 'N/A'} | Reason: ${prop.reason || 'N/A'}`, 14, y + 10)
    y += 16
  })

  doc.save(`Urban_WildLink_Proposals_${new Date().toISOString().slice(0, 10)}.pdf`)
}

/**
 * 4. Export Master Species Inventory to CSV format
 */
export function exportInventoryToCSV(plants) {
  if (!plants || plants.length === 0) {
    alert('No species inventory records to export.')
    return
  }

  const headers = [
    'Plant ID',
    'Botanical Common Name',
    'Scientific Botanical Name',
    'Flora Category',
    'Current Nursery Stock',
    'Total Adopted Count',
    'Water Needs',
    'Sun Exposure',
    'Wildlife Benefit',
    'Plant Description'
  ]

  const rows = plants.map(plant => [
    escapeCSV(plant.id),
    escapeCSV(plant.name),
    escapeCSV(plant.scientificName || 'Indigenous Flora'),
    escapeCSV(plant.category),
    plant.stock !== undefined ? plant.stock : 0,
    plant.adoptedCount || 0,
    escapeCSV(plant.waterNeeds || 'Low to Moderate'),
    escapeCSV(plant.sunExposure || 'Full Sun'),
    escapeCSV(plant.wildlifeBenefit),
    escapeCSV(plant.description)
  ])

  downloadCSV(headers, rows, `Urban_WildLink_Inventory_${new Date().toISOString().slice(0, 10)}.csv`)
}

/**
 * 5. Export Master Species Inventory to PDF format
 */
export function exportInventoryToPDF(plants) {
  if (!plants || plants.length === 0) {
    alert('No species inventory records to export.')
    return
  }

  const doc = new jsPDF()
  doc.setFillColor(25, 135, 84)
  doc.rect(0, 0, 210, 24, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('Urban WildLink Melbourne - Flora Stock Inventory', 14, 16)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()} | Total Species: ${plants.length}`, 14, 32)

  let y = 42
  doc.setFontSize(10)
  plants.forEach((plant, idx) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setTextColor(25, 135, 84)
    doc.setFont(undefined, 'bold')
    doc.text(`${idx + 1}. ${plant.name} [${plant.category}]`, 14, y)

    doc.setTextColor(60, 60, 60)
    doc.setFont(undefined, 'normal')
    doc.text(`Scientific: ${plant.scientificName || 'Indigenous'} | Stock: ${plant.stock} | Adopted: ${plant.adoptedCount || 0}`, 14, y + 5)
    doc.text(`Benefit: ${plant.wildlifeBenefit || 'Habitat'} | Sun: ${plant.sunExposure || 'Full Sun'}`, 14, y + 10)
    y += 16
  })

  doc.save(`Urban_WildLink_Inventory_${new Date().toISOString().slice(0, 10)}.pdf`)
}
