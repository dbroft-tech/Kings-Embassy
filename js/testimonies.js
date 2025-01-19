// Testimony Submission System

document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonies();
});

function initializeTestimonies() {
    setupTestimonyForm();
    setupTestimonyFilters();
    loadTestimonies();
}

/**
 * Testimony Form Functions
 */
function setupTestimonyForm() {
    const form = document.getElementById('testimonyForm');
    if (!form) return;

    form.addEventListener('submit', handleTestimonySubmission);
}

async function handleTestimonySubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateTestimonyForm(data)) return;

    try {
        // This will be replaced with actual API call
        console.log('Submitting testimony:', data);
        showNotification('Thank you for sharing your testimony! It will be reviewed shortly.', 'success');
        form.reset();
    } catch (error) {
        console.error('Error submitting testimony:', error);
        showNotification('Error submitting testimony. Please try again.', 'error');
    }
}

function validateTestimonyForm(data) {
    if (!data.title?.trim()) {
        showNotification('Please enter a title for your testimony', 'error');
        return false;
    }
    if (!data.content?.trim()) {
        showNotification('Please share your testimony', 'error');
        return false;
    }
    if (!data.category) {
        showNotification('Please select a category', 'error');
        return false;
    }
    return true;
}

/**
 * Testimony Display Functions
 */
async function loadTestimonies() {
    const container = document.getElementById('testimoniesContainer');
    if (!container) return;

    try {
        // This will be replaced with actual API call
        const testimonies = [
            {
                id: 1,
                title: 'God\'s Healing Power',
                content: 'I was diagnosed with a chronic condition...',
                author: 'John D.',
                date: '2025-01-15',
                category: 'healing'
            },
            {
                id: 2,
                title: 'Financial Breakthrough',
                content: 'After months of unemployment...',
                author: 'Sarah M.',
                date: '2025-01-10',
                category: 'provision'
            }
        ];

        renderTestimonies(testimonies);
    } catch (error) {
        console.error('Error loading testimonies:', error);
        showNotification('Error loading testimonies', 'error');
    }
}

function renderTestimonies(testimonies) {
    const container = document.getElementById('testimoniesContainer');
    if (!container) return;

    container.innerHTML = testimonies.map(testimony => `
        <div class="testimony-card card mb-4" data-category="${testimony.category}">
            <div class="card-body">
                <h3 class="card-title h5">${escapeHtml(testimony.title)}</h3>
                <p class="card-text">${escapeHtml(testimony.content)}</p>
                <div class="text-muted">
                    <small>
                        Shared by ${escapeHtml(testimony.author)} on 
                        ${new Date(testimony.date).toLocaleDateString()}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Filter Functions
 */
function setupTestimonyFilters() {
    const filterButtons = document.querySelectorAll('.testimony-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterTestimonies(category);
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function filterTestimonies(category) {
    const testimonies = document.querySelectorAll('.testimony-card');
    testimonies.forEach(testimony => {
        if (category === 'all' || testimony.dataset.category === category) {
            testimony.style.display = 'block';
        } else {
            testimony.style.display = 'none';
        }
    });
}

/**
 * Search Functions
 */
function setupTestimonySearch() {
    const searchInput = document.getElementById('testimonySearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        searchTestimonies(query);
    }, 300));
}

function searchTestimonies(query) {
    const testimonies = document.querySelectorAll('.testimony-card');
    testimonies.forEach(testimony => {
        const title = testimony.querySelector('.card-title').textContent.toLowerCase();
        const content = testimony.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(query) || content.includes(query)) {
            testimony.style.display = 'block';
        } else {
            testimony.style.display = 'none';
        }
    });
}

/**
 * Utility Functions
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateTestimonyForm,
        escapeHtml,
        debounce
    };
}
