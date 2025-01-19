// Event Calendar Implementation

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
});

function initializeCalendar() {
    const calendarEl = document.getElementById('eventCalendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        themeSystem: 'bootstrap5',
        events: loadEvents,
        eventClick: handleEventClick,
        dateClick: handleDateClick,
        loading: handleLoading,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
        }
    });

    calendar.render();
    setupEventFilters();
}

/**
 * Event Loading Functions
 */
async function loadEvents(info, successCallback, failureCallback) {
    try {
        // This will be replaced with actual API call
        const events = [
            {
                title: 'Sunday Service',
                daysOfWeek: [0], // Sunday
                startTime: '09:00:00',
                endTime: '12:00:00',
                color: '#4F46E5',
                recurring: true
            },
            {
                title: 'Bible Study',
                daysOfWeek: [3], // Wednesday
                startTime: '18:00:00',
                endTime: '20:00:00',
                color: '#059669',
                recurring: true
            },
            {
                title: 'Prayer Meeting',
                daysOfWeek: [5], // Friday
                startTime: '18:00:00',
                endTime: '20:00:00',
                color: '#7C3AED',
                recurring: true
            }
        ];

        // Add some special events
        const specialEvents = [
            {
                title: 'Youth Conference',
                start: '2025-02-15',
                end: '2025-02-17',
                color: '#DC2626'
            },
            {
                title: 'Leadership Summit',
                start: '2025-03-01T09:00:00',
                end: '2025-03-01T17:00:00',
                color: '#2563EB'
            }
        ];

        successCallback([...events, ...specialEvents]);
    } catch (error) {
        console.error('Error loading events:', error);
        failureCallback(error);
    }
}

/**
 * Event Handlers
 */
function handleEventClick(info) {
    const event = info.event;
    showEventModal(event);
}

function handleDateClick(info) {
    if (isAdmin()) {
        showAddEventModal(info.date);
    }
}

function handleLoading(isLoading) {
    const loadingIndicator = document.getElementById('calendarLoading');
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}

/**
 * Modal Functions
 */
function showEventModal(event) {
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    const modalTitle = document.getElementById('eventModalTitle');
    const modalBody = document.getElementById('eventModalBody');

    modalTitle.textContent = event.title;
    modalBody.innerHTML = `
        <p><strong>Date:</strong> ${formatEventDate(event)}</p>
        <p><strong>Time:</strong> ${formatEventTime(event)}</p>
        ${event.extendedProps.description ? `<p>${event.extendedProps.description}</p>` : ''}
        ${event.extendedProps.location ? `<p><strong>Location:</strong> ${event.extendedProps.location}</p>` : ''}
    `;

    modal.show();
}

function showAddEventModal(date) {
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    const dateInput = document.getElementById('eventDate');
    dateInput.value = date.toISOString().split('T')[0];
    modal.show();
}

/**
 * Filter Functions
 */
function setupEventFilters() {
    const filterButtons = document.querySelectorAll('.event-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterEvents(category);
        });
    });
}

function filterEvents(category) {
    const calendar = document.querySelector('#eventCalendar').FullCalendar;
    if (!calendar) return;

    if (category === 'all') {
        calendar.getEvents().forEach(event => event.show());
    } else {
        calendar.getEvents().forEach(event => {
            if (event.extendedProps.category === category) {
                event.show();
            } else {
                event.hide();
            }
        });
    }
}

/**
 * Utility Functions
 */
function formatEventDate(event) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (event.allDay) {
        return event.start.toLocaleDateString(undefined, options);
    }
    return `${event.start.toLocaleDateString(undefined, options)}`;
}

function formatEventTime(event) {
    if (event.allDay) return 'All Day';
    const options = { hour: 'numeric', minute: '2-digit' };
    return `${event.start.toLocaleTimeString(undefined, options)} - ${event.end.toLocaleTimeString(undefined, options)}`;
}

function isAdmin() {
    // This will be replaced with actual admin check
    return false;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatEventDate,
        formatEventTime,
        loadEvents
    };
}
