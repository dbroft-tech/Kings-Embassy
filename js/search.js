// Global Search Implementation

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    setupSearchForm();
    setupSearchSuggestions();
    setupSearchFilters();
}

/**
 * Search Form Functions
 */
function setupSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', handleSearch);
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
}

async function handleSearch(e) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) return;

    try {
        const results = await performSearch(query);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Error performing search', 'error');
    }
}

async function handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        hideSuggestions();
        return;
    }

    try {
        const suggestions = await fetchSearchSuggestions(query);
        displaySearchSuggestions(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

/**
 * Search API Functions
 */
async function performSearch(query) {
    // This will be replaced with actual API call
    // Simulated search results
    return [
        {
            type: 'event',
            title: 'Youth Conference 2025',
            url: '/html/events.html#youth-conference',
            description: 'Annual youth conference focusing on spiritual growth...'
        },
        {
            type: 'sermon',
            title: 'Walking in Faith',
            url: '/sermons/walking-in-faith',
            description: 'A powerful message about trusting God...'
        },
        {
            type: 'testimony',
            title: 'God\'s Healing Power',
            url: '/html/testimonies.html#healing',
            description: 'An inspiring testimony of divine healing...'
        }
    ];
}

async function fetchSearchSuggestions(query) {
    // This will be replaced with actual API call
    // Simulated suggestions
    return [
        'Sunday Service',
        'Prayer Meeting',
        'Bible Study',
        'Youth Ministry',
        'Children\'s Church'
    ].filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    );
}

/**
 * Display Functions
 */
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                No results found. Try different keywords or browse our categories.
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = results.map(result => `
        <div class="search-result card mb-3" data-type="${result.type}">
            <div class="card-body">
                <h3 class="h5 card-title">
                    <a href="${result.url}" class="text-decoration-none">
                        ${escapeHtml(result.title)}
                    </a>
                </h3>
                <p class="card-text text-muted small mb-2">
                    ${capitalizeFirstLetter(result.type)}
                </p>
                <p class="card-text">
                    ${escapeHtml(result.description)}
                </p>
            </div>
        </div>
    `).join('');
}

function displaySearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }

    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <button class="suggestion-item list-group-item list-group-item-action">
            ${escapeHtml(suggestion)}
        </button>
    `).join('');

    suggestionsContainer.style.display = 'block';
    setupSuggestionClickHandlers();
}

function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

/**
 * Filter Functions
 */
function setupSearchFilters() {
    const filterButtons = document.querySelectorAll('.search-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            filterSearchResults(type);
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function filterSearchResults(type) {
    const results = document.querySelectorAll('.search-result');
    results.forEach(result => {
        if (type === 'all' || result.dataset.type === type) {
            result.style.display = 'block';
        } else {
            result.style.display = 'none';
        }
    });
}

/**
 * Event Handlers
 */
function setupSuggestionClickHandlers() {
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            searchInput.value = suggestion.textContent.trim();
            hideSuggestions();
            searchInput.focus();
        });
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        performSearch,
        fetchSearchSuggestions,
        escapeHtml,
        capitalizeFirstLetter,
        debounce
    };
}
