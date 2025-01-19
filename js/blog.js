// Blog and News System

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogSystem();
});

function initializeBlogSystem() {
    setupBlogGrid();
    setupBlogSearch();
    setupBlogFilters();
    setupBlogPagination();
    setupSocialSharing();
    setupComments();
}

/**
 * Blog Grid Setup
 */
function setupBlogGrid() {
    loadFeaturedPosts();
    loadRecentPosts();
    loadPopularPosts();
    setupMasonryGrid();
}

function loadFeaturedPosts() {
    const container = document.getElementById('featuredPosts');
    if (!container) return;

    const posts = getFeaturedPosts();
    renderPosts(container, posts, 'featured');
}

function loadRecentPosts() {
    const container = document.getElementById('recentPosts');
    if (!container) return;

    const posts = getRecentPosts();
    renderPosts(container, posts, 'recent');
}

function loadPopularPosts() {
    const container = document.getElementById('popularPosts');
    if (!container) return;

    const posts = getPopularPosts();
    renderPosts(container, posts, 'popular');
}

function setupMasonryGrid() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    // Initialize Masonry layout
    new Masonry(grid, {
        itemSelector: '.blog-item',
        columnWidth: '.blog-sizer',
        percentPosition: true
    });
}

/**
 * Post Rendering
 */
function renderPosts(container, posts, type = 'regular') {
    container.innerHTML = posts.map(post => `
        <div class="col-md-6 col-lg-4 mb-4 blog-item" data-category="${post.category}">
            <div class="card h-100">
                <div class="card-img-top position-relative">
                    <img src="${post.thumbnail}" alt="${post.title}" class="img-fluid">
                    ${type === 'featured' ? '<span class="badge bg-primary position-absolute top-0 end-0 m-2">Featured</span>' : ''}
                    <div class="category-badge position-absolute top-0 start-0 m-2">
                        <span class="badge bg-secondary">${post.category}</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="/blog/${post.slug}" class="text-decoration-none text-dark">
                            ${post.title}
                        </a>
                    </h5>
                    <p class="card-text">${post.excerpt}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="author d-flex align-items-center">
                            <img src="${post.author.avatar}" alt="${post.author.name}" 
                                 class="rounded-circle me-2" width="30" height="30">
                            <small class="text-muted">${post.author.name}</small>
                        </div>
                        <small class="text-muted">${formatDate(post.date)}</small>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="engagement">
                            <span class="me-3">
                                <i class="bi bi-heart"></i> ${post.likes}
                            </span>
                            <span class="me-3">
                                <i class="bi bi-chat"></i> ${post.comments}
                            </span>
                            <span>
                                <i class="bi bi-eye"></i> ${post.views}
                            </span>
                        </div>
                        <div class="share-buttons">
                            <button class="btn btn-sm btn-outline-primary share-btn" 
                                    data-post-id="${post.id}" data-platform="facebook">
                                <i class="bi bi-facebook"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info share-btn" 
                                    data-post-id="${post.id}" data-platform="twitter">
                                <i class="bi bi-twitter"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners
    setupPostInteractions(container);
}

/**
 * Post Interactions
 */
function setupPostInteractions(container) {
    // Like buttons
    container.querySelectorAll('.bi-heart').forEach(heart => {
        heart.addEventListener('click', () => {
            const postId = heart.closest('.blog-item').dataset.postId;
            toggleLike(postId);
        });
    });

    // Share buttons
    container.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.dataset.postId;
            const platform = btn.dataset.platform;
            sharePost(postId, platform);
        });
    });
}

/**
 * Search and Filtering
 */
function setupBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        filterPosts(query);
    }, 300));
}

function setupBlogFilters() {
    const filterButtons = document.querySelectorAll('.blog-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterPosts('', filter);
        });
    });
}

function filterPosts(query = '', category = '') {
    const items = document.querySelectorAll('.blog-item');
    items.forEach(item => {
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const excerpt = item.querySelector('.card-text').textContent.toLowerCase();
        const itemCategory = item.dataset.category;

        const matchesQuery = !query || 
            title.includes(query) || 
            excerpt.includes(query);
            
        const matchesCategory = !category || 
            itemCategory === category;

        item.style.display = matchesQuery && matchesCategory ? 'block' : 'none';
    });

    // Re-layout Masonry grid
    const grid = document.getElementById('blogGrid');
    if (grid) {
        new Masonry(grid).layout();
    }
}

/**
 * Pagination
 */
function setupBlogPagination() {
    const pagination = document.getElementById('blogPagination');
    if (!pagination) return;

    pagination.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();
            const page = e.target.dataset.page;
            loadPage(page);
        }
    });
}

async function loadPage(page) {
    try {
        const posts = await fetchPosts(page);
        const container = document.getElementById('blogGrid');
        if (container) {
            renderPosts(container, posts);
            updatePaginationUI(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error loading page:', error);
        showNotification('Error loading posts', 'error');
    }
}

/**
 * Social Sharing
 */
function setupSocialSharing() {
    setupShareButtons();
    setupCopyLink();
}

function sharePost(postId, platform) {
    const post = getPostById(postId);
    if (!post) return;

    const url = encodeURIComponent(window.location.origin + '/blog/' + post.slug);
    const title = encodeURIComponent(post.title);

    let shareUrl;
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        default:
            return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Comments System
 */
function setupComments() {
    const commentForm = document.getElementById('commentForm');
    if (!commentForm) return;

    commentForm.addEventListener('submit', handleCommentSubmission);
    loadComments();
}

async function handleCommentSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateComment(data)) return;

    try {
        await submitComment(data);
        form.reset();
        showNotification('Comment posted successfully!', 'success');
        loadComments(); // Reload comments
    } catch (error) {
        console.error('Comment submission error:', error);
        showNotification('Error posting comment', 'error');
    }
}

function validateComment(data) {
    if (!data.content?.trim()) {
        showNotification('Please enter a comment', 'error');
        return false;
    }
    return true;
}

/**
 * Data Management
 */
function getFeaturedPosts() {
    // This will be replaced with actual API call
    return JSON.parse(localStorage.getItem('featuredPosts') || '[]');
}

function getRecentPosts() {
    // This will be replaced with actual API call
    return JSON.parse(localStorage.getItem('recentPosts') || '[]');
}

function getPopularPosts() {
    // This will be replaced with actual API call
    return JSON.parse(localStorage.getItem('popularPosts') || '[]');
}

function getPostById(id) {
    const posts = [
        ...getFeaturedPosts(),
        ...getRecentPosts(),
        ...getPopularPosts()
    ];
    return posts.find(p => p.id === id);
}

async function fetchPosts(page) {
    // This will be replaced with actual API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(localStorage.getItem(`posts_page_${page}`) || '[]'));
        }, 500);
    });
}

/**
 * Utility Functions
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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
        filterPosts,
        formatDate,
        validateComment,
        getPostById
    };
}
