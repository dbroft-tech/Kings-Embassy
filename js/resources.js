// Resource Downloads System

document.addEventListener('DOMContentLoaded', function() {
    initializeResourceSystem();
});

function initializeResourceSystem() {
    setupResourceLibrary();
    setupDownloadTracking();
    setupResourceSearch();
    setupResourceFilters();
}

/**
 * Resource Library Setup
 */
function setupResourceLibrary() {
    loadResourceCategories();
    loadFeaturedResources();
    loadRecentResources();
    setupResourceGrid();
}

function loadResourceCategories() {
    const categories = [
        { id: 'sermons', name: 'Sermons', icon: 'bi-mic' },
        { id: 'bible-studies', name: 'Bible Studies', icon: 'bi-book' },
        { id: 'devotionals', name: 'Devotionals', icon: 'bi-heart' },
        { id: 'music', name: 'Music', icon: 'bi-music-note' },
        { id: 'books', name: 'Books', icon: 'bi-journal' },
        { id: 'teachings', name: 'Teachings', icon: 'bi-mortarboard' }
    ];

    const container = document.getElementById('resourceCategories');
    if (!container) return;

    container.innerHTML = categories.map(category => `
        <div class="col-md-4 col-lg-2 mb-4">
            <div class="card h-100 text-center resource-category" data-category="${category.id}">
                <div class="card-body">
                    <i class="bi ${category.icon} fs-1"></i>
                    <h5 class="card-title mt-3">${category.name}</h5>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.resource-category').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterResourcesByCategory(category);
        });
    });
}

function loadFeaturedResources() {
    const container = document.getElementById('featuredResources');
    if (!container) return;

    const resources = getFeaturedResources();
    renderResources(container, resources);
}

function loadRecentResources() {
    const container = document.getElementById('recentResources');
    if (!container) return;

    const resources = getRecentResources();
    renderResources(container, resources);
}

function setupResourceGrid() {
    const grid = document.getElementById('resourceGrid');
    if (!grid) return;

    // Initialize Masonry layout
    new Masonry(grid, {
        itemSelector: '.resource-item',
        columnWidth: '.resource-sizer',
        percentPosition: true
    });
}

/**
 * Resource Rendering
 */
function renderResources(container, resources) {
    container.innerHTML = resources.map(resource => `
        <div class="col-md-6 col-lg-4 mb-4 resource-item" data-category="${resource.category}">
            <div class="card h-100">
                <div class="card-img-top position-relative">
                    <img src="${resource.thumbnail}" alt="${resource.title}" class="img-fluid">
                    <span class="badge bg-primary position-absolute top-0 end-0 m-2">${resource.category}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${resource.title}</h5>
                    <p class="card-text">${resource.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${formatDate(resource.date)}</small>
                        <button class="btn btn-primary btn-sm download-btn" 
                                data-resource-id="${resource.id}"
                                ${resource.requiresLogin && !isLoggedIn() ? 'disabled' : ''}>
                            ${resource.requiresLogin && !isLoggedIn() ? 'Login to Download' : 'Download'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add download handlers
    container.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const resourceId = btn.dataset.resourceId;
            handleResourceDownload(resourceId);
        });
    });
}

/**
 * Download Handling
 */
function handleResourceDownload(resourceId) {
    if (!isLoggedIn()) {
        showLoginPrompt();
        return;
    }

    const resource = getResourceById(resourceId);
    if (!resource) {
        showNotification('Resource not found', 'error');
        return;
    }

    try {
        // Track download
        trackDownload(resourceId);
        
        // Initiate download
        initiateDownload(resource);
        
        showNotification('Download started!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Error starting download', 'error');
    }
}

function initiateDownload(resource) {
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Download Tracking
 */
function setupDownloadTracking() {
    // This will be replaced with actual analytics integration
    window.addEventListener('resourceDownload', (e) => {
        const { resourceId, userId } = e.detail;
        logDownload(resourceId, userId);
    });
}

function trackDownload(resourceId) {
    const userId = getCurrentUserId();
    const downloadEvent = new CustomEvent('resourceDownload', {
        detail: { resourceId, userId }
    });
    window.dispatchEvent(downloadEvent);
}

function logDownload(resourceId, userId) {
    const downloads = getStoredDownloads();
    downloads.push({
        resourceId,
        userId,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('downloads', JSON.stringify(downloads));
}

/**
 * Search and Filtering
 */
function setupResourceSearch() {
    const searchInput = document.getElementById('resourceSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        filterResources(query);
    }, 300));
}

function setupResourceFilters() {
    const filterButtons = document.querySelectorAll('.resource-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterResources('', filter);
        });
    });
}

function filterResources(query = '', category = '') {
    const items = document.querySelectorAll('.resource-item');
    items.forEach(item => {
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const description = item.querySelector('.card-text').textContent.toLowerCase();
        const itemCategory = item.dataset.category;

        const matchesQuery = !query || 
            title.includes(query) || 
            description.includes(query);
            
        const matchesCategory = !category || 
            itemCategory === category;

        item.style.display = matchesQuery && matchesCategory ? 'block' : 'none';
    });

    // Re-layout Masonry grid
    const grid = document.getElementById('resourceGrid');
    if (grid) {
        new Masonry(grid).layout();
    }
}

/**
 * Data Management
 */
function getFeaturedResources() {
    // This will be replaced with actual API call
    return JSON.parse(localStorage.getItem('featuredResources') || '[]');
}

function getRecentResources() {
    // This will be replaced with actual API call
    return JSON.parse(localStorage.getItem('recentResources') || '[]');
}

function getResourceById(id) {
    const resources = [
        ...getFeaturedResources(),
        ...getRecentResources()
    ];
    return resources.find(r => r.id === id);
}

function getStoredDownloads() {
    return JSON.parse(localStorage.getItem('downloads') || '[]');
}

/**
 * Utility Functions
 */
function isLoggedIn() {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    return !!session.token && new Date(session.expiresAt) > new Date();
}

function getCurrentUserId() {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    return session.member?.id;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showLoginPrompt() {
    const modal = new bootstrap.Modal(document.getElementById('loginPromptModal'));
    modal.show();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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
        filterResources,
        formatDate,
        isLoggedIn,
        getResourceById
    };
}
