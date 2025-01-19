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
 * Utility Functions
 */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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