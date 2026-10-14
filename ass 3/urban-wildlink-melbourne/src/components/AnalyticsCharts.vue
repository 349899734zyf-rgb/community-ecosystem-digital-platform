<!--
  AnalyticsCharts.vue
  BR (F.1-2): Innovation - Interactive Charts
  
  Visualizes plant inventory stock and community adoption counts across categories using Chart.js.
  Features:
  - Dynamic dataset calculation from plantStore reactive state
  - Bar Chart & Doughnut Chart modes
  - Clean, responsive canvas rendering with tooltips and legends
-->

<template>
  <div class="card border-0 shadow-sm bg-white p-4 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div>
        <h5 class="fw-bold text-success mb-1">
          <i class="bi bi-bar-chart-line-fill me-2"></i>Ecological Impact & Species Analytics
        </h5>
        <p class="text-muted small mb-0">
          Visual comparison of available nursery stock and community adoptions by category.
        </p>
      </div>

      <div class="btn-group btn-group-sm" role="group">
        <button 
          type="button" 
          class="btn" 
          :class="chartType === 'bar' ? 'btn-success fw-bold' : 'btn-outline-success'"
          @click="switchChartType('bar')"
        >
          Bar Chart
        </button>
        <button 
          type="button" 
          class="btn" 
          :class="chartType === 'doughnut' ? 'btn-success fw-bold' : 'btn-outline-success'"
          @click="switchChartType('doughnut')"
        >
          Doughnut Chart
        </button>
      </div>
    </div>

    <!-- Chart Canvas Container -->
    <div style="position: relative; height: 320px; width: 100%;">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { plantStore } from '../store/plantStore'

// Register all standard Chart.js controllers and elements
Chart.register(...registerables)

const chartCanvas = ref(null)
let chartInstance = null
const chartType = ref('bar') // 'bar' or 'doughnut'

// Categories to display
const categories = ['Tree', 'Shrub', 'Grass', 'Wildflower']

function computeChartData() {
  const stockData = [0, 0, 0, 0]
  const adoptedData = [0, 0, 0, 0]

  plantStore.state.plants.forEach(plant => {
    const idx = categories.indexOf(plant.category)
    if (idx !== -1) {
      stockData[idx] += Number(plant.stock) || 0
      adoptedData[idx] += Number(plant.adoptedCount) || 0
    }
  })

  if (chartType.value === 'bar') {
    return {
      labels: categories,
      datasets: [
        {
          label: 'Available Nursery Stock',
          data: stockData,
          backgroundColor: 'rgba(40, 167, 69, 0.75)', // Green
          borderColor: 'rgb(40, 167, 69)',
          borderWidth: 1
        },
        {
          label: 'Adopted Seedlings',
          data: adoptedData,
          backgroundColor: 'rgba(13, 110, 253, 0.75)', // Blue
          borderColor: 'rgb(13, 110, 253)',
          borderWidth: 1
        }
      ]
    }
  } else {
    // Doughnut chart showing adoption distribution by category
    return {
      labels: categories,
      datasets: [
        {
          label: 'Adopted Plants',
          data: adoptedData,
          backgroundColor: [
            'rgba(40, 167, 69, 0.85)',
            'rgba(255, 193, 7, 0.85)',
            'rgba(13, 110, 253, 0.85)',
            'rgba(220, 53, 69, 0.85)'
          ]
        }
      ]
    }
  }
}

function renderChart() {
  if (!chartCanvas.value) return

  // Destroy previous instance to avoid memory leak and canvas reuse errors
  if (chartInstance) {
    chartInstance.destroy()
  }

  const data = computeChartData()

  chartInstance = new Chart(chartCanvas.value, {
    type: chartType.value,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      },
      scales: chartType.value === 'bar' ? {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Seedlings'
          }
        }
      } : {}
    }
  })
}

function switchChartType(type) {
  chartType.value = type
  nextTick(() => {
    renderChart()
  })
}

onMounted(() => {
  renderChart()
})

// Re-render when plant store changes
watch(() => plantStore.state.plants, () => {
  renderChart()
}, { deep: true })
</script>
