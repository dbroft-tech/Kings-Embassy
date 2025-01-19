/**
 * Kings Embassy Custom JavaScript
 * Default JavaScript file for custom functionality
 * Last updated: 2025-01-19
 */

// Tailwind Configuration
tailwind.config = {
    important: true, // This helps Tailwind override Bootstrap styles when needed
    theme: {
        extend: {},
    }
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize your custom scripts here
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    setupEventListeners();
    setupTestimonyForm();
    setupTestimonyFilters();
    setupFirstTimerForm();
    setupDiscipleshipForm();
    setupPrayerRequestForm();
    setupEventRegistrationForm();
    setupOnlineGivingForm();
    setupContactForm();
    initializeLazyLoading();
    initializeCalendar();
    initializeGoogleMap();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Add your event listeners here
}

/**
 * Testimony Form Handling
 */
function setupTestimonyForm() {
    const form = document.getElementById('testimonyForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            category: document.getElementById('category').value,
            testimony: document.getElementById('testimony').value,
            consent: document.getElementById('consent').checked
        };

        // Validate form data
        if (!validateTestimonyForm(formData)) return;

        // Show success message
        showAlert('Thank you for sharing your testimony! It will be reviewed and posted soon.', 'success');
        
        // Reset form
        form.reset();
    });
}

/**
 * Validate testimony form data
 */
function validateTestimonyForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showAlert('Please enter a valid name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.category) {
        showAlert('Please select a testimony category', 'error');
        return false;
    }

    if (!data.testimony || data.testimony.trim().length < 50) {
        showAlert('Please share your testimony (minimum 50 characters)', 'error');
        return false;
    }

    if (!data.consent) {
        showAlert('Please consent to share your testimony', 'error');
        return false;
    }

    return true;
}

/**
 * Setup testimony category filters
 */
function setupTestimonyFilters() {
    const filterButtons = document.querySelectorAll('.btn-outline-primary');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically filter the testimonies
            // For now, we'll just show a message
            const category = this.textContent;
            if (category === 'All') {
                showAlert('Showing all testimonies', 'info');
            } else {
                showAlert(`Showing ${category} testimonies`, 'info');
            }
        });
    });
}

/**
 * First Timer Form Handling
 */
function setupFirstTimerForm() {
    const form = document.getElementById('firstTimerForm');
    if (!form) return;

    // Set minimum date to today
    const visitDateInput = document.getElementById('visitDate');
    if (visitDateInput) {
        const today = new Date().toISOString().split('T')[0];
        visitDateInput.min = today;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            visitDate: document.getElementById('visitDate').value,
            service: document.getElementById('service').value,
            familySize: document.getElementById('familySize').value,
            childcare: document.querySelector('input[name="childcare"]:checked').value,
            questions: document.getElementById('questions').value
        };

        // Validate form data
        if (!validateFirstTimerForm(formData)) return;

        // Show success message
        showAlert('Thank you for planning your visit! We look forward to meeting you.', 'success');
        
        // Reset form
        form.reset();
    });
}

/**
 * Validate first timer form data
 */
function validateFirstTimerForm(data) {
    if (!data.fullName || data.fullName.trim().length < 2) {
        showAlert('Please enter your full name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        showAlert('Please enter a valid phone number', 'error');
        return false;
    }

    if (!data.visitDate) {
        showAlert('Please select your planned visit date', 'error');
        return false;
    }

    if (!data.service) {
        showAlert('Please select a service time', 'error');
        return false;
    }

    return true;
}

/**
 * Discipleship Form Handling
 */
function setupDiscipleshipForm() {
    const form = document.getElementById('discipleshipForm');
    if (!form) return;

    // Set maximum date to today for conversion date
    const conversionDateInput = document.getElementById('conversionDate');
    if (conversionDateInput) {
        const today = new Date().toISOString().split('T')[0];
        conversionDateInput.max = today;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            conversionDate: document.getElementById('conversionDate').value,
            preferredTime: document.getElementById('preferredTime').value,
            growthAreas: Array.from(document.querySelectorAll('input[name="growthAreas"]:checked')).map(cb => cb.value),
            questions: document.getElementById('questions').value
        };

        // Validate form data
        if (!validateDiscipleshipForm(formData)) return;

        // Show success message
        showAlert('Thank you for registering! We will contact you with class details.', 'success');
        
        // Reset form
        form.reset();
    });
}

/**
 * Validate discipleship form data
 */
function validateDiscipleshipForm(data) {
    if (!data.fullName || data.fullName.trim().length < 2) {
        showAlert('Please enter your full name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        showAlert('Please enter a valid phone number', 'error');
        return false;
    }

    if (!data.conversionDate) {
        showAlert('Please enter your conversion date', 'error');
        return false;
    }

    if (!data.preferredTime) {
        showAlert('Please select your preferred class time', 'error');
        return false;
    }

    if (data.growthAreas.length === 0) {
        showAlert('Please select at least one area you would like to grow in', 'error');
        return false;
    }

    return true;
}

/**
 * Prayer Request Form Handling
 */
function setupPrayerRequestForm() {
    const form = document.getElementById('prayerRequestForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            category: document.getElementById('prayerCategory').value,
            request: document.getElementById('prayerRequest').value,
            urgent: document.getElementById('urgent').checked,
            followup: document.getElementById('followup').checked
        };

        // Validate form data
        if (!validatePrayerRequestForm(formData)) return;

        // Show success message
        const message = formData.urgent 
            ? 'Your urgent prayer request has been received. Our prayer team will pray for you immediately.'
            : 'Thank you for submitting your prayer request. We will keep you in our prayers.';
            
        showAlert(message, 'success');
        
        // Reset form
        form.reset();
    });
}

/**
 * Validate prayer request form data
 */
function validatePrayerRequestForm(data) {
    if (!data.fullName || data.fullName.trim().length < 2) {
        showAlert('Please enter your full name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    if (data.phone && !isValidPhone(data.phone)) {
        showAlert('Please enter a valid phone number or leave it blank', 'error');
        return false;
    }

    if (!data.category) {
        showAlert('Please select a prayer category', 'error');
        return false;
    }

    if (!data.request || data.request.trim().length < 10) {
        showAlert('Please share your prayer request (minimum 10 characters)', 'error');
        return false;
    }

    return true;
}

/**
 * Event Registration Form Handling
 */
function setupEventRegistrationForm() {
    const form = document.getElementById('eventRegistrationForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            event: document.getElementById('event').value,
            tickets: document.getElementById('tickets').value,
            dietary: document.getElementById('dietary').value,
            newsletter: document.getElementById('newsletter').checked
        };

        // Validate form data
        if (!validateEventRegistrationForm(formData)) return;

        // Show success message
        showAlert('Thank you for registering! You will receive a confirmation email shortly.', 'success');
        
        // Reset form
        form.reset();
    });
}

/**
 * Validate event registration form data
 */
function validateEventRegistrationForm(data) {
    if (!data.fullName || data.fullName.trim().length < 2) {
        showAlert('Please enter your full name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        showAlert('Please enter a valid phone number', 'error');
        return false;
    }

    if (!data.event) {
        showAlert('Please select an event', 'error');
        return false;
    }

    if (!data.tickets) {
        showAlert('Please select the number of tickets', 'error');
        return false;
    }

    return true;
}

/**
 * Online Giving Form Handling
 */
function setupOnlineGivingForm() {
    const form = document.getElementById('onlineGivingForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            amount: document.getElementById('amount').value,
            category: document.getElementById('givingCategory').value,
            frequency: document.getElementById('frequency').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            anonymous: document.getElementById('anonymous').checked
        };

        // Validate form data
        if (!validateOnlineGivingForm(formData)) return;

        // Show success message
        showAlert('Thank you for your generous gift! You will be redirected to our secure payment gateway.', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
        }, 3000);
    });
}

/**
 * Validate online giving form data
 */
function validateOnlineGivingForm(data) {
    if (!data.amount || data.amount < 1) {
        showAlert('Please enter a valid amount', 'error');
        return false;
    }

    if (!data.category) {
        showAlert('Please select a giving category', 'error');
        return false;
    }

    if (!data.frequency) {
        showAlert('Please select giving frequency', 'error');
        return false;
    }

    if (!data.fullName || data.fullName.trim().length < 2) {
        showAlert('Please enter your full name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

/**
 * Contact Form Handling
 */
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form data
        if (!validateContactForm(formData)) return;

        // Show success message
        showAlert('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        form.reset();
    });
}

/**
 * Validate contact form data
 */
function validateContactForm(data) {
    if (!data.fullName || data.fullName.trim().length < 2) {
        showAlert('Please enter your full name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }

    if (data.phone && !isValidPhone(data.phone)) {
        showAlert('Please enter a valid phone number or leave it blank', 'error');
        return false;
    }

    if (!data.subject || data.subject.trim().length < 2) {
        showAlert('Please enter a subject', 'error');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showAlert('Please enter your message (minimum 10 characters)', 'error');
        return false;
    }

    return true;
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const observer = lozad();
    observer.observe();
}

/**
 * Initialize FullCalendar
 */
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title: 'Annual Conference 2025',
                start: '2025-03-15',
                end: '2025-03-17',
                className: 'bg-primary'
            },
            {
                title: 'Worship Night',
                start: '2025-02-28',
                className: 'bg-success'
            },
            {
                title: 'Bible Study Conference',
                start: '2025-04-10',
                end: '2025-04-12',
                className: 'bg-info'
            }
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        }
    });

    calendar.render();
}

/**
 * Initialize Google Map
 */
function initializeGoogleMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Church location coordinates
    const churchLocation = { lat: 40.7128, lng: -74.0060 }; // Replace with actual coordinates

    // Create map
    const map = new google.maps.Map(mapElement, {
        center: churchLocation,
        zoom: 15,
        styles: [
            {
                "featureType": "poi.business",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            }
        ]
    });

    // Add marker
    const marker = new google.maps.Marker({
        position: churchLocation,
        map: map,
        title: 'Kings Embassy Church'
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-2">
                <h3 class="font-bold mb-1">Kings Embassy Church</h3>
                <p class="text-sm">123 Church Street, City</p>
                <p class="text-sm mt-1">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${churchLocation.lat},${churchLocation.lng}" 
                       target="_blank" class="text-blue-600">
                        Get Directions
                    </a>
                </p>
            </div>
        `
    });

    // Show info window on marker click
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

/**
 * Utility Functions
 */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-4 w-auto`;
    alert.style.maxWidth = '500px';
    alert.style.zIndex = '9999';
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add alert to page
    document.body.appendChild(alert);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

/**
 * UI Handlers
 */

// Add your UI handler functions here

/**
 * API Handlers
 */

// Add your API interaction functions here