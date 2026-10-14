<!--
  EventsView.vue
  BR (F.1-1): Innovation - Interactive Appointment Booking with Calendar
  
  Integrates FullCalendar to manage biodiversity community workshops.
  Features:
  1. FullCalendar interactive monthly view.
  2. Booking constraints & seat capacity limits.
  3. Booking conflict management (prevents double-booking on overlapping dates/times).
-->

<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-success mb-1">
          <i class="bi bi-calendar-event-fill me-2"></i>Community Workshops & Event Booking
        </h2>
        <p class="text-muted small mb-0">
          Book hands-on habitat restoration workshops. Intelligent booking constraint & conflict detection enabled.
        </p>
      </div>
      <div>
        <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
          <i class="bi bi-person-check me-1"></i> My Bookings: {{ myBookedEvents.length }}
        </span>
      </div>
    </div>

    <!-- Alert / Toast Messages -->
    <div v-if="toastMsg" class="alert mb-4 shadow-sm d-flex justify-content-between align-items-center" :class="toastClass" role="alert">
      <div><i class="bi me-2" :class="toastIcon"></i>{{ toastMsg }}</div>
      <button type="button" class="btn-close" @click="toastMsg = ''"></button>
    </div>

    <!-- Main Layout: Calendar Grid + Details Sidebar -->
    <div class="row g-4">
      <!-- Left: FullCalendar Component (70% width) -->
      <div class="col-lg-8 col-12">
        <div class="card border-0 shadow-sm bg-white p-3">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <!-- Right: Booking & Event Details Drawer (30% width) -->
      <div class="col-lg-4 col-12">
        <div class="card border-0 shadow-sm bg-white p-4 sticky-top" style="top: 80px;">
          <h5 class="fw-bold text-success mb-3 border-bottom pb-2">
            Workshop Reservation
          </h5>

          <div v-if="selectedEvent">
            <h6 class="fw-bold text-dark mb-2">{{ selectedEvent.title }}</h6>
            <div class="small text-muted mb-2">
              <i class="bi bi-calendar-check me-1 text-success"></i> Date: <strong>{{ selectedEvent.date }}</strong>
            </div>
            <div class="small text-muted mb-2">
              <i class="bi bi-geo-alt me-1 text-danger"></i> Location: {{ selectedEvent.location }}
            </div>
            <div class="small text-muted mb-3">
              <i class="bi bi-info-circle me-1 text-primary"></i> {{ selectedEvent.description }}
            </div>

            <!-- Capacity Indicator -->
            <div class="p-3 bg-light rounded-3 mb-3">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>Available Seats:</span>
                <span :class="selectedEvent.availableSeats > 0 ? 'text-success' : 'text-danger'">
                  {{ selectedEvent.availableSeats }} / {{ selectedEvent.totalSeats }}
                </span>
              </div>
              <div class="progress" style="height: 6px;">
                <div 
                  class="progress-bar bg-success" 
                  :style="{ width: ((selectedEvent.totalSeats - selectedEvent.availableSeats) / selectedEvent.totalSeats * 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Booking Action or Status -->
            <div v-if="isAlreadyBooked(selectedEvent.id)">
              <div class="alert alert-info py-2 small mb-2 text-center">
                <i class="bi bi-check-circle-fill me-1"></i> You have already booked this workshop!
              </div>
              <button class="btn btn-outline-danger btn-sm w-100" @click="cancelBooking(selectedEvent.id)">
                Cancel Reservation
              </button>
            </div>
            <div v-else-if="selectedEvent.availableSeats <= 0">
              <button class="btn btn-secondary w-100" disabled>
                Workshop Fully Booked
              </button>
            </div>
            <div v-else>
              <button class="btn btn-success fw-bold w-100 shadow-sm" @click="handleBookWorkshop">
                <i class="bi bi-check-lg me-1"></i> Confirm RSVP & Reserve Seat
              </button>
            </div>
          </div>

          <div v-else class="text-center text-muted py-5">
            <i class="bi bi-hand-index-thumb fs-2 d-block mb-2 text-success opacity-50"></i>
            <p class="small mb-0">Click any workshop event on the calendar to view details and reserve your seat.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const toastMsg = ref('')
const toastClass = ref('alert-success')
const toastIcon = ref('bi-check-circle-fill')

// Workshop Events Dataset
const eventsData = ref([
  {
    id: 'evt-1',
    title: 'Native Tree Planting Bee',
    date: '2026-10-17',
    location: 'Clayton Community Park, VIC',
    description: 'Join volunteers to plant 150 Eucalyptus seedlings along the local biodiversity corridor.',
    totalSeats: 20,
    availableSeats: 6,
    color: '#28a745'
  },
  {
    id: 'evt-2',
    title: 'Urban Wildlife Nest Box Workshop',
    date: '2026-10-21',
    location: 'Monash Maker Space, Clayton Campus',
    description: 'Learn how to build timber hollow nesting boxes for native parrots and micro-bats.',
    totalSeats: 15,
    availableSeats: 4,
    color: '#0d6efd'
  },
  {
    id: 'evt-3',
    title: 'Suburban Soil & Composting Masterclass',
    date: '2026-10-25',
    location: 'Oakleigh Eco Learning Centre',
    description: 'Optimize soil microbiomes and build clay-tolerant native plant beds for water conservation.',
    totalSeats: 25,
    availableSeats: 12,
    color: '#198754'
  },
  {
    id: 'evt-4',
    title: 'Micro-Habitat Balcony Gardening',
    date: '2026-10-28',
    location: 'Glen Waverley Library Hub',
    description: 'How apartment renters can create pollinator hotspots in balconies and small courtyards.',
    totalSeats: 18,
    availableSeats: 1,
    color: '#fd7e14'
  }
])

// User's current bookings stored in LocalStorage
const myBookedEvents = ref(JSON.parse(localStorage.getItem('my_workshop_bookings') || '[]'))
const selectedEvent = ref(null)

function isAlreadyBooked(eventId) {
  return myBookedEvents.value.some(b => b.id === eventId)
}

function handleEventClick(info) {
  const target = eventsData.value.find(e => e.id === info.event.id)
  if (target) {
    selectedEvent.value = target
  }
}

// BR (F.1-1): Booking Constraint & Conflict Management
function handleBookWorkshop() {
  if (!selectedEvent.value) return

  const target = selectedEvent.value

  // 1. Constraint Check: Seat Availability
  if (target.availableSeats <= 0) {
    showToast('Cannot book: This workshop is fully booked.', 'alert-danger', 'bi-exclamation-triangle-fill')
    return
  }

  // 2. Conflict Management: Check if user already has a booking on the SAME DATE
  const hasDateConflict = myBookedEvents.value.some(b => b.date === target.date && b.id !== target.id)
  if (hasDateConflict) {
    showToast(
      `Booking Conflict Detected: You already have a registered workshop on ${target.date}! Please reschedule or cancel existing session.`,
      'alert-warning',
      'bi-exclamation-circle-fill'
    )
    return
  }

  // 3. Confirm Reservation
  target.availableSeats--
  myBookedEvents.value.push({
    id: target.id,
    title: target.title,
    date: target.date,
    location: target.location
  })
  localStorage.setItem('my_workshop_bookings', JSON.stringify(myBookedEvents.value))
  syncCalendarEvents()

  showToast(`Success! Your seat for "${target.title}" is confirmed.`, 'alert-success', 'bi-check-circle-fill')
}

function cancelBooking(eventId) {
  const target = eventsData.value.find(e => e.id === eventId)
  if (target) {
    target.availableSeats++
  }
  myBookedEvents.value = myBookedEvents.value.filter(b => b.id !== eventId)
  localStorage.setItem('my_workshop_bookings', JSON.stringify(myBookedEvents.value))
  syncCalendarEvents()

  showToast('Your reservation has been cancelled.', 'alert-info', 'bi-info-circle-fill')
}

function showToast(msg, cls, icon) {
  toastMsg.value = msg
  toastClass.value = cls
  toastIcon.value = icon
}

function formatEvents() {
  return eventsData.value.map(e => ({
    id: e.id,
    title: `${e.title} (${e.availableSeats} left)`,
    date: e.date,
    backgroundColor: isAlreadyBooked(e.id) ? '#198754' : e.color,
    borderColor: isAlreadyBooked(e.id) ? '#0f5132' : e.color
  }))
}

// FullCalendar Configuration (stable reactive options avoiding re-initialization crashes)
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  initialDate: '2026-10-15',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  events: formatEvents(),
  eventClick: handleEventClick,
  height: 'auto',
  contentHeight: 460
})

function syncCalendarEvents() {
  calendarOptions.events = formatEvents()
}
</script>

<style scoped>
:deep(.fc-toolbar-title) {
  font-size: 1.15rem;
  font-weight: bold;
  color: #198754;
}

:deep(.fc-button-primary) {
  background-color: #198754;
  border-color: #198754;
}

:deep(.fc-button-primary:hover) {
  background-color: #157347;
  border-color: #157347;
}

:deep(.fc-event) {
  cursor: pointer;
  padding: 2px 4px;
  font-size: 11px;
}
</style>
