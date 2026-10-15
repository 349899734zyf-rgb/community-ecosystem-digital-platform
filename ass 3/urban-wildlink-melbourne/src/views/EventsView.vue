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
          Community Workshops Booking
        </h2>
        <p class="text-muted small mb-0">
          Book hands-on habitat restoration workshops.
        </p>
      </div>
      <div>
        <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
          My Bookings: {{ myBookedEvents.length }}
        </span>
      </div>
    </div>

    <!-- Alert / Toast Messages -->
    <div v-if="toastMsg" class="alert mb-4 d-flex justify-content-between align-items-center" :class="toastClass" role="alert">
      <div><i class="bi me-2" :class="toastIcon"></i>{{ toastMsg }}</div>
      <button type="button" class="btn-close" @click="toastMsg = ''"></button>
    </div>

    <!-- Main Layout: Calendar Grid + Details Sidebar -->
    <div class="row g-4">
      <!-- Left: FullCalendar Component (70% width) -->
      <div class="col-lg-8 col-12">
        <div class="card border-0 bg-white p-3" :class="{ 'is-admin': currentUser && currentUser.role === 'Administrator' }">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <!-- Right: Booking & Event Details Drawer (30% width) -->
      <div class="col-lg-4 col-12">
        <div class="card border-0 bg-white p-4">
          <h5 class="fw-bold text-success mb-3 border-bottom pb-2">
            Workshop Reservation
          </h5>

          <div v-if="selectedEvent">
            <h6 class="fw-bold text-dark mb-2">{{ selectedEvent.title }}</h6>
            <div class="small text-muted mb-2">
              Date: <strong>{{ selectedEvent.date }}</strong>
            </div>
            <div class="small text-muted mb-2">
              Location: <strong>{{ selectedEvent.location }}</strong>
            </div>
            <div class="small text-muted mb-3">
              {{ selectedEvent.description }}
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
              <div class="alert alert-success py-2 small mb-2 text-center">
                You have already booked this workshop!
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
            <p class="small mb-0">Click any workshop event on the calendar to view details and reserve your seat.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Administrator Add Workshop Modal -->
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-calendar-plus me-2"></i>Create New Community Workshop
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleCreateWorkshop">
              <!-- Workshop Title -->
              <div class="mb-3">
                <label for="eventTitleInput" class="form-label small fw-bold">Workshop Title *</label>
                <input 
                  id="eventTitleInput"
                  v-model.trim="newEventForm.title" 
                  type="text" 
                  class="form-control" 
                  placeholder="e.g. Native Seed Harvesting & Propagation"
                  required
                >
              </div>

              <!-- Date & Seat Capacity -->
              <div class="row g-2 mb-3">
                <div class="col-md-7">
                  <label for="eventDateInput" class="form-label small fw-bold">Date *</label>
                  <input 
                    id="eventDateInput"
                    v-model="newEventForm.date" 
                    type="date" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="col-md-5">
                  <label for="eventSeatsInput" class="form-label small fw-bold">Seat Capacity *</label>
                  <input 
                    id="eventSeatsInput"
                    v-model.number="newEventForm.totalSeats" 
                    type="number" 
                    min="1" 
                    max="100"
                    class="form-control" 
                    required
                  >
                </div>
              </div>

              <!-- Location -->
              <div class="mb-3">
                <label for="eventLocationInput" class="form-label small fw-bold">Location / Venue *</label>
                <input 
                  id="eventLocationInput"
                  v-model.trim="newEventForm.location" 
                  type="text" 
                  class="form-control" 
                  placeholder="e.g. Clayton Community Garden, VIC"
                  required
                >
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label for="eventDescInput" class="form-label small fw-bold">Workshop Description</label>
                <textarea 
                  id="eventDescInput"
                  v-model.trim="newEventForm.description" 
                  class="form-control" 
                  rows="3" 
                  placeholder="Provide an overview of activities and learning outcomes..."
                ></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2 pt-2">
                <button type="button" class="btn btn-secondary btn-sm" @click="showAddModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">
                  <i class="bi bi-check-lg me-1"></i>Publish Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { plantStore } from '../store/plantStore'

const toastMsg = ref('')
const toastClass = ref('alert-success')
const toastIcon = ref('bi-check-circle-fill')

const currentUser = computed(() => plantStore.state.currentUser)

// Workshop Events Initial Dataset
const defaultEvents = [
  {
    id: 'evt-1',
    title: 'Native Tree Planting Bee',
    date: '2026-10-17',
    location: 'Clayton Community Park, VIC',
    description: 'Join volunteers to plant 150 Eucalyptus seedlings along the local biodiversity corridor.',
    totalSeats: 20,
    availableSeats: 6,
    color: '#198754'
  },
  {
    id: 'evt-2',
    title: 'Urban Wildlife Nest Box Workshop',
    date: '2026-10-21',
    location: 'Monash Maker Space, Clayton Campus',
    description: 'Learn how to build timber hollow nesting boxes for native parrots and micro-bats.',
    totalSeats: 15,
    availableSeats: 4,
    color: '#198754'
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
    color: '#198754'
  }
]

const STORAGE_EVENTS_KEY = 'urban_wildlink_workshops_all_v2'

function loadStoredEvents() {
  const saved = localStorage.getItem(STORAGE_EVENTS_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch (e) {
      console.error('Failed to parse workshops from storage:', e)
    }
  }
  localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(defaultEvents))
  return [...defaultEvents]
}

function saveEventsToStorage(events) {
  try {
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events))
  } catch (e) {
    console.error('Failed to save workshops to storage:', e)
  }
}

const eventsData = ref(loadStoredEvents())

// Administrator Create Workshop Form State
const showAddModal = ref(false)
const newEventForm = ref({
  title: '',
  date: '2026-10-29',
  location: '',
  totalSeats: 20,
  description: ''
})

function openAddEventModal() {
  if (!currentUser.value || currentUser.value.role !== 'Administrator') return
  newEventForm.value = {
    title: '',
    date: '2026-10-29',
    location: '',
    totalSeats: 20,
    description: ''
  }
  showAddModal.value = true
}

function handleCreateWorkshop() {
  if (!currentUser.value || currentUser.value.role !== 'Administrator') {
    showToast('Only administrators can publish new workshops.', 'alert-danger', 'bi-shield-exclamation')
    return
  }
  if (!newEventForm.value.title || !newEventForm.value.date || !newEventForm.value.location) return

  const seats = parseInt(newEventForm.value.totalSeats, 10) || 20
  const newEvent = {
    id: `evt-${Date.now()}`,
    title: newEventForm.value.title.trim(),
    date: newEventForm.value.date,
    location: newEventForm.value.location.trim(),
    description: newEventForm.value.description.trim() || 'Community hands-on biodiversity and habitat workshop.',
    totalSeats: seats,
    availableSeats: seats,
    color: '#198754'
  }

  eventsData.value.push(newEvent)
  saveEventsToStorage(eventsData.value)
  syncCalendarEvents()

  showAddModal.value = false
  showToast(`Successfully published workshop "${newEvent.title}" on ${newEvent.date}!`, 'alert-success', 'bi-check-circle-fill')
}

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
  saveEventsToStorage(eventsData.value)
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
    saveEventsToStorage(eventsData.value)
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
  return eventsData.value.map(e => {
    const booked = isAlreadyBooked(e.id)
    return {
      id: e.id,
      title: booked ? `[Booked] ${e.title}` : `${e.title} (${e.availableSeats} left)`,
      date: e.date,
      backgroundColor: booked ? '#0f5132' : '#198754',
      borderColor: booked ? '#0a3622' : '#146c43'
    }
  })
}

// FullCalendar Configuration (stable reactive options avoiding re-initialization crashes)
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  initialDate: '2026-10-15',
  customButtons: {
    addWorkshopBtn: {
      text: '+ Add Workshop Event',
      click: () => {
        openAddEventModal()
      }
    }
  },
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'addWorkshopBtn'
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

/* Day Numbers: Replace default Bootstrap link blue with neutral dark slate #334155 */
:deep(.fc-daygrid-day-number) {
  color: #334155 !important;
  text-decoration: none !important;
  font-weight: 500;
  padding: 4px 6px;
}

:deep(.fc-daygrid-day-number:hover) {
  color: #198754 !important;
}

/* Weekday Column Headers (Sun, Mon, Tue...): Theme green #198754 */
:deep(.fc-col-header-cell-cushion) {
  color: #198754 !important;
  text-decoration: none !important;
  font-weight: 600;
  padding: 6px 0;
}

/* Today's cell: Soft natural green tint instead of blue/yellow */
:deep(.fc-day-today) {
  background-color: #f0fdf4 !important;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  color: #198754 !important;
  font-weight: 700;
}

/* Other month days: Muted slate grey */
:deep(.fc-day-other .fc-daygrid-day-number) {
  color: #94a3b8 !important;
  opacity: 0.6;
}

.modal-backdrop {
  opacity: 0.5;
}

/* Toolbar chunk flex alignment to vertically align title and admin button */
:deep(.fc-toolbar-chunk) {
  display: inline-flex;
  align-items: center;
}

/* Administrator Add Workshop Button on the right of Calendar Header */
:deep(.fc-addWorkshopBtn-button) {
  display: none !important;
  background-color: #198754 !important;
  border-color: #198754 !important;
  color: #ffffff !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  padding: 5px 12px !important;
  border-radius: 6px !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.2s ease !important;
}

:deep(.fc-addWorkshopBtn-button:hover) {
  background-color: #157347 !important;
  border-color: #157347 !important;
  transform: translateY(-1px);
}

.is-admin :deep(.fc-addWorkshopBtn-button) {
  display: inline-flex !important;
  align-items: center !important;
}
</style>
