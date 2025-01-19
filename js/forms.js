// Form Handling Functions

document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
});

function initializeForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // First Timer Form
    const firstTimerForm = document.getElementById('firstTimerForm');
    if (firstTimerForm) {
        firstTimerForm.addEventListener('submit', handleFirstTimerForm);
    }

    // Prayer Request Form
    const prayerRequestForm = document.getElementById('prayerRequestForm');
    if (prayerRequestForm) {
        prayerRequestForm.addEventListener('submit', handlePrayerRequestForm);
    }

    // Initialize form validation
    setupFormValidation();
}

/**
 * Contact Form Handler
 */
function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate form data
    if (!validateContactForm(data)) return;

    // Send to backend (to be implemented)
    console.log('Contact form submitted:', data);
    showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
    e.target.reset();
}

/**
 * First Timer Form Handler
 */
function handleFirstTimerForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate form data
    if (!validateFirstTimerForm(data)) return;

    // Send to backend (to be implemented)
    console.log('First timer form submitted:', data);
    showNotification('Welcome to Kings Embassy! We look forward to meeting you.', 'success');
    e.target.reset();
}

/**
 * Prayer Request Form Handler
 */
function handlePrayerRequestForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate form data
    if (!validatePrayerRequestForm(data)) return;

    // Send to backend (to be implemented)
    console.log('Prayer request submitted:', data);
    showNotification('Your prayer request has been received. We are standing with you in prayer.', 'success');
    e.target.reset();
}

/**
 * Form Validation Functions
 */
function setupFormValidation() {
    // Add validation classes to required fields
    document.querySelectorAll('form [required]').forEach(field => {
        field.addEventListener('invalid', (e) => {
            e.preventDefault();
            field.classList.add('is-invalid');
        });

        field.addEventListener('input', () => {
            if (field.validity.valid) {
                field.classList.remove('is-invalid');
            }
        });
    });
}

function validateContactForm(data) {
    if (!data.name?.trim()) {
        showNotification('Please enter your name', 'error');
        return false;
    }
    if (!data.email?.trim() || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    if (!data.message?.trim()) {
        showNotification('Please enter your message', 'error');
        return false;
    }
    return true;
}

function validateFirstTimerForm(data) {
    if (!data.name?.trim()) {
        showNotification('Please enter your name', 'error');
        return false;
    }
    if (!data.email?.trim() || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    if (!data.phone?.trim()) {
        showNotification('Please enter your phone number', 'error');
        return false;
    }
    return true;
}

function validatePrayerRequestForm(data) {
    if (!data.name?.trim()) {
        showNotification('Please enter your name', 'error');
        return false;
    }
    if (!data.email?.trim() || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    if (!data.prayerRequest?.trim()) {
        showNotification('Please enter your prayer request', 'error');
        return false;
    }
    return true;
}

/**
 * Utility Functions
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Google Maps Integration
function initMap() {
    const mapElement = document.getElementById('locationMap');
    if (!mapElement) return;

    const churchLocation = { lat: YOUR_CHURCH_LAT, lng: YOUR_CHURCH_LNG };
    const map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: churchLocation,
    });

    const marker = new google.maps.Marker({
        position: churchLocation,
        map: map,
        title: 'Kings Embassy'
    });
}

// Initialize map when Google Maps API is loaded
if (window.google && window.google.maps) {
    initMap();
}
