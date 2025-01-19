// Admin Dashboard Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    setupNavigation();
    setupContentManagement();
    setupMediaManagement();
    setupEventManagement();
    setupTestimonyManagement();
    setupPrayerRequestManagement();
    setupResourceManagement();
    setupUserManagement();
}

/**
 * Navigation Setup
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('aside a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active', 'bg-gray-100'));
            // Add active class to clicked link
            this.classList.add('active', 'bg-gray-100');
            // Load corresponding content
            loadContent(this.getAttribute('href').substring(1));
        });
    });
}

/**
 * Content Management
 */
function setupContentManagement() {
    const contentTypes = {
        sermons: {
            fields: ['title', 'preacher', 'date', 'category', 'description', 'audio', 'video', 'notes'],
            validation: {
                title: 'required',
                preacher: 'required',
                date: 'required',
                category: 'required'
            }
        },
        events: {
            fields: ['title', 'date', 'time', 'venue', 'description', 'image', 'registration'],
            validation: {
                title: 'required',
                date: 'required',
                time: 'required',
                venue: 'required'
            }
        },
        testimonies: {
            fields: ['author', 'title', 'category', 'content', 'date', 'status'],
            validation: {
                author: 'required',
                content: 'required',
                category: 'required'
            }
        },
        resources: {
            fields: ['title', 'type', 'category', 'file', 'description', 'access_level'],
            validation: {
                title: 'required',
                type: 'required',
                file: 'required'
            }
        },
        news: {
            fields: ['title', 'content', 'author', 'date', 'image', 'category'],
            validation: {
                title: 'required',
                content: 'required',
                author: 'required'
            }
        }
    };

    // Setup content form handlers
    Object.keys(contentTypes).forEach(type => {
        const form = document.getElementById(`${type}Form`);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleContentSubmission(type, this);
            });
        }
    });
}

/**
 * Media Management
 */
function setupMediaManagement() {
    const mediaUploader = document.getElementById('mediaUploader');
    if (mediaUploader) {
        mediaUploader.addEventListener('change', handleMediaUpload);
    }

    // Image gallery functionality
    setupImageGallery();
    
    // Video integration
    setupVideoPlayers();
    
    // Audio sermon player
    setupAudioPlayers();
    
    // Live streaming setup
    setupLiveStreaming();
}

/**
 * Event Management
 */
function setupEventManagement() {
    // Event calendar initialization
    const calendar = document.getElementById('eventCalendar');
    if (calendar) {
        initializeEventCalendar(calendar);
    }

    // Event registration handling
    const eventForms = document.querySelectorAll('.event-registration-form');
    eventForms.forEach(form => {
        form.addEventListener('submit', handleEventRegistration);
    });
}

/**
 * Testimony Management
 */
function setupTestimonyManagement() {
    // Testimony moderation
    const testimonyList = document.getElementById('testimonyList');
    if (testimonyList) {
        loadTestimonies();
        setupTestimonyModeration();
    }
}

/**
 * Prayer Request Management
 */
function setupPrayerRequestManagement() {
    // Prayer request tracking
    const prayerList = document.getElementById('prayerList');
    if (prayerList) {
        loadPrayerRequests();
        setupPrayerRequestTracking();
    }
}

/**
 * Resource Management
 */
function setupResourceManagement() {
    // Resource upload and categorization
    const resourceUploader = document.getElementById('resourceUploader');
    if (resourceUploader) {
        resourceUploader.addEventListener('change', handleResourceUpload);
    }

    // Resource access management
    setupResourceAccess();
}

/**
 * User Management
 */
function setupUserManagement() {
    // User roles and permissions
    const userTable = document.getElementById('userTable');
    if (userTable) {
        loadUsers();
        setupUserPermissions();
    }
}

/**
 * Content Loading Functions
 */
function loadContent(section) {
    // Simulate API call to load content
    console.log(`Loading ${section} content...`);
    // Here you would typically fetch content from your backend
}

function handleContentSubmission(type, form) {
    // Validate form
    if (!validateForm(form)) return;

    // Collect form data
    const formData = new FormData(form);
    
    // Simulate API call to save content
    console.log(`Saving ${type} content...`, Object.fromEntries(formData));
    
    // Show success message
    showNotification('Content saved successfully!', 'success');
}

/**
 * Utility Functions
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => notification.remove(), 3000);
}

function handleMediaUpload(e) {
    const files = e.target.files;
    // Process each file
    Array.from(files).forEach(file => {
        // Check file type and size
        if (validateMediaFile(file)) {
            uploadMedia(file);
        }
    });
}

function validateMediaFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mpeg'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('File too large (max 50MB)', 'error');
        return false;
    }
    
    return true;
}

function uploadMedia(file) {
    // Simulate file upload
    console.log(`Uploading ${file.name}...`);
    
    // Here you would typically upload to your server
    setTimeout(() => {
        showNotification(`${file.name} uploaded successfully!`, 'success');
    }, 1500);
}

// Initialize live streaming capabilities
function setupLiveStreaming() {
    // This would integrate with your streaming service
    console.log('Live streaming setup initialized');
}

// Setup resource access controls
function setupResourceAccess() {
    // Implement access level controls
    console.log('Resource access controls initialized');
}

// Load and display users
function loadUsers() {
    // Simulate API call to load users
    console.log('Loading users...');
}

// Setup user permission management
function setupUserPermissions() {
    // Implement role-based access control
    console.log('User permissions initialized');
}
