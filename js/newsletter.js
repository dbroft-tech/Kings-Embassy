// Newsletter System

document.addEventListener('DOMContentLoaded', function() {
    initializeNewsletter();
});

function initializeNewsletter() {
    setupNewsletterForm();
    setupPreferences();
    setupUnsubscribe();
}

/**
 * Newsletter Form Setup
 */
function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', handleNewsletterSubmission);
}

async function handleNewsletterSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateNewsletterForm(data)) return;

    try {
        // This will be replaced with actual API call
        console.log('Newsletter subscription:', data);
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        form.reset();
        
        // Save subscription preferences
        saveSubscriptionPreferences(data);
        
        // Show preference modal
        showPreferenceModal();
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Error subscribing to newsletter. Please try again.', 'error');
    }
}

function validateNewsletterForm(data) {
    if (!data.email?.trim()) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    return true;
}

/**
 * Subscription Preferences
 */
function setupPreferences() {
    const preferencesForm = document.getElementById('newsletterPreferences');
    if (!preferencesForm) return;

    // Load saved preferences
    loadSubscriptionPreferences();

    // Setup preference toggles
    setupPreferenceToggles();
}

function setupPreferenceToggles() {
    const toggles = document.querySelectorAll('.preference-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', async (e) => {
            const preference = e.target.dataset.preference;
            const enabled = e.target.checked;
            
            try {
                await updatePreference(preference, enabled);
                showNotification('Preferences updated successfully', 'success');
            } catch (error) {
                console.error('Error updating preferences:', error);
                showNotification('Error updating preferences', 'error');
                e.target.checked = !enabled; // Revert toggle
            }
        });
    });
}

function loadSubscriptionPreferences() {
    const preferences = getStoredPreferences();
    const toggles = document.querySelectorAll('.preference-toggle');
    
    toggles.forEach(toggle => {
        const preference = toggle.dataset.preference;
        toggle.checked = preferences[preference] || false;
    });
}

function saveSubscriptionPreferences(data) {
    const preferences = {
        email: data.email,
        weekly_updates: true,
        event_notifications: true,
        prayer_requests: true,
        testimonies: true
    };
    
    localStorage.setItem('newsletter_preferences', JSON.stringify(preferences));
}

function getStoredPreferences() {
    const stored = localStorage.getItem('newsletter_preferences');
    return stored ? JSON.parse(stored) : {};
}

async function updatePreference(preference, enabled) {
    // This will be replaced with actual API call
    const preferences = getStoredPreferences();
    preferences[preference] = enabled;
    localStorage.setItem('newsletter_preferences', JSON.stringify(preferences));
}

/**
 * Unsubscribe Handling
 */
function setupUnsubscribe() {
    const unsubscribeForm = document.getElementById('unsubscribeForm');
    if (!unsubscribeForm) return;

    unsubscribeForm.addEventListener('submit', handleUnsubscribe);
}

async function handleUnsubscribe(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateUnsubscribeForm(data)) return;

    try {
        // This will be replaced with actual API call
        console.log('Newsletter unsubscribe:', data);
        showNotification('You have been unsubscribed from our newsletter.', 'success');
        form.reset();
        
        // Clear stored preferences
        localStorage.removeItem('newsletter_preferences');
    } catch (error) {
        console.error('Unsubscribe error:', error);
        showNotification('Error processing unsubscribe request. Please try again.', 'error');
    }
}

function validateUnsubscribeForm(data) {
    if (!data.email?.trim()) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    if (!data.reason?.trim()) {
        showNotification('Please provide a reason for unsubscribing', 'error');
        return false;
    }
    return true;
}

/**
 * Modal Functions
 */
function showPreferenceModal() {
    const modal = new bootstrap.Modal(document.getElementById('preferenceModal'));
    modal.show();
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

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateNewsletterForm,
        isValidEmail,
        getStoredPreferences
    };
}
