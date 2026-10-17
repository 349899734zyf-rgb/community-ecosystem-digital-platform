<!--
  Academic References & Acknowledgements:
  - Purpose: Official Digital Certificate View & PDF Downloader for Adoptions & Species Proposals (BR D.2)
  - Accessibility: WCAG 2.1 AA compliant typography and contrast
-->

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        
        <!-- Action Toolbar -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <router-link to="/" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left me-1"></i>Back to Home
          </router-link>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-success btn-sm fw-bold" @click="handlePrint">
              <i class="bi bi-printer me-1"></i>Print
            </button>
            <button class="btn btn-success btn-sm fw-bold px-3" @click="handleDownloadPDF">
              <i class="bi bi-download me-1"></i>Download Official PDF
            </button>
          </div>
        </div>

        <!-- Official Certificate Card -->
        <div class="card border p-4 p-md-5 bg-white text-center certificate-frame position-relative">
          
          <!-- Green Header Banner -->
          <div class="mb-4">
            <span class="badge bg-success px-3 py-2 text-uppercase letter-spacing-1 fw-bold mb-2">
              Urban WildLink Melbourne
            </span>
            <h2 class="fw-bold text-success mt-2 mb-1">
              {{ isProposal ? 'Species Proposal Acceptance Certificate' : 'Certificate of Plant Adoption' }}
            </h2>
            <p class="text-muted small">
              {{ isProposal ? 'Community Biodiversity Contribution & Botanical Catalog Ingestion' : 'Indigenous Biodiversity Corridor Stewardship Program' }}
            </p>
            <hr class="w-50 mx-auto border-success opacity-50">
          </div>

          <!-- Recipient Statement -->
          <div class="my-3">
            <p class="text-secondary mb-1">
              {{ isProposal ? 'This official acceptance certificate is awarded to:' : 'This official certificate is proudly presented to:' }}
            </p>
            <h3 class="fw-bold text-dark text-decoration-underline text-success my-2">
              {{ applicantName }}
            </h3>
            <p class="text-secondary mt-3 mb-1">
              {{ isProposal ? 'For successfully proposing the native species now added to Melbourne inventory:' : 'In recognition of adopting and nurturing seedling(s) of:' }}
            </p>
            <h4 class="fw-bold text-success my-2">
              {{ plantName }}
            </h4>
          </div>

          <!-- Metadata Box (Adoption) -->
          <div v-if="!isProposal" class="bg-light border rounded p-3 my-4 mx-auto text-start small" style="max-width: 520px;">
            <div class="row g-2">
              <div class="col-6">
                <span class="text-muted">Certificate ID:</span>
                <div class="fw-bold text-dark font-monospace">{{ certificateId }}</div>
              </div>
              <div class="col-6">
                <span class="text-muted">Issued Date:</span>
                <div class="fw-bold text-dark">{{ issueDate }}</div>
              </div>
              <div class="col-12 mt-2">
                <span class="text-muted">Registered Address:</span>
                <div class="fw-bold text-dark">{{ deliveryAddress }}</div>
              </div>
            </div>
          </div>

          <!-- Metadata Box (Proposal) -->
          <div v-else class="bg-light border rounded p-3 my-4 mx-auto text-start small" style="max-width: 520px;">
            <div class="row g-2">
              <div class="col-6">
                <span class="text-muted">Proposal ID:</span>
                <div class="fw-bold text-dark font-monospace">{{ certificateId }}</div>
              </div>
              <div class="col-6">
                <span class="text-muted">Approval Date:</span>
                <div class="fw-bold text-dark">{{ issueDate }}</div>
              </div>
              <div class="col-6 mt-2">
                <span class="text-muted">Category:</span>
                <div class="fw-bold text-dark">{{ category }}</div>
              </div>
              <div class="col-6 mt-2">
                <span class="text-muted">Status:</span>
                <div class="fw-bold text-success">Approved & Active</div>
              </div>
              <div class="col-12 mt-2">
                <span class="text-muted">Ecological Benefit:</span>
                <div class="fw-bold text-dark">{{ benefit }}</div>
              </div>
            </div>
          </div>

          <!-- Seal Footer -->
          <div class="pt-3 border-top mt-3 d-flex justify-content-between align-items-center text-muted small flex-wrap gap-2">
            <div>
              <i class="bi bi-shield-check text-success me-1"></i>
              <span>Officially Verified by City of Melbourne Nursery</span>
            </div>
            <div>
              <span>Urban WildLink Biodiversity Protocol</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { generateAdoptionCertificatePDF, generateProposalAcceptancePDF } from '../utils/emailService'

const route = useRoute()

const isProposal = computed(() => route.query.type === 'proposal')
const applicantName = computed(() => route.query.name || 'Community Member')
const plantName = computed(() => route.query.plant || 'Indigenous Flora')
const quantity = computed(() => route.query.quantity || '1')
const certificateId = computed(() => route.query.id || (isProposal.value ? 'PROP-' : 'UWL-') + Date.now().toString().slice(-6))
const issueDate = computed(() => route.query.date || new Date().toLocaleDateString())
const deliveryAddress = computed(() => route.query.address || 'Melbourne, VIC 3000')
const category = computed(() => route.query.category || 'Native Flora')
const benefit = computed(() => route.query.benefit || 'Supports native pollinators and urban habitat')

function handleDownloadPDF() {
  if (isProposal.value) {
    const proposal = {
      proposerName: applicantName.value,
      plantName: plantName.value,
      scientificName: route.query.scientific || 'Native Indigenous',
      category: category.value,
      wildlifeBenefit: benefit.value,
      id: certificateId.value
    }
    const blob = generateProposalAcceptancePDF(proposal)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Proposal_Approval_${plantName.value.replace(/\s+/g, '_')}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  } else {
    const application = {
      applicantName: applicantName.value,
      plantName: plantName.value,
      quantity: quantity.value,
      id: certificateId.value,
      address: deliveryAddress.value
    }
    const blob = generateAdoptionCertificatePDF(application)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Certificate_${applicantName.value.replace(/\s+/g, '_')}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }
}

function handlePrint() {
  window.print()
}
</script>

<style scoped>
.certificate-frame {
  border: 3px double #198754 !important;
  border-radius: 8px;
}
.letter-spacing-1 {
  letter-spacing: 1.5px;
}
@media print {
  .btn, .toolbar {
    display: none !important;
  }
}
</style>
