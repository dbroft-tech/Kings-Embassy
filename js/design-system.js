// Design System JavaScript Utilities

document.addEventListener('DOMContentLoaded', function() {
    initializeDesignSystem();
});

function initializeDesignSystem() {
    setupAccessibility();
    setupAnimations();
    setupInteractions();
    setupResponsiveness();
    setupThemeToggle();
}

/**
 * Accessibility
 */
function setupAccessibility() {
    setupKeyboardNavigation();
    setupScreenReaderAnnouncements();
    setupFocusManagement();
    setupARIA();
}

function setupKeyboardNavigation() {
    // Skip to main content
    const skipLink = document.getElementById('skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.tabIndex = -1;
                main.focus();
            }
        });
    }

    // Keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

function setupScreenReaderAnnouncements() {
    const announcer = document.getElementById('sr-announcer');
    if (!announcer) {
        const div = document.createElement('div');
        div.id = 'sr-announcer';
        div.setAttribute('aria-live', 'polite');
        div.className = 'sr-only';
        document.body.appendChild(div);
    }
}

function setupFocusManagement() {
    // Trap focus in modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            trapFocus(modal);
        });
    });
}

function setupARIA() {
    // Dynamic ARIA labels
    const toggleButtons = document.querySelectorAll('[data-toggle]');
    toggleButtons.forEach(button => {
        const targetId = button.dataset.toggle;
        const target = document.getElementById(targetId);
        if (target) {
            button.setAttribute('aria-controls', targetId);
            button.setAttribute('aria-expanded', 'false');
            target.setAttribute('aria-hidden', 'true');
        }
    });
}

/**
 * Animations
 */
function setupAnimations() {
    setupScrollAnimations();
    setupTransitionObserver();
    setupLoadingStates();
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function setupTransitionObserver() {
    document.addEventListener('transitionend', (e) => {
        if (e.target.classList.contains('transitioning')) {
            e.target.classList.remove('transitioning');
        }
    });
}

function setupLoadingStates() {
    const buttons = document.querySelectorAll('.btn[data-loading]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            showLoading(button);
        });
    });
}

/**
 * Interactions
 */
function setupInteractions() {
    setupHoverEffects();
    setupRippleEffect();
    setupTooltips();
}

function setupHoverEffects() {
    const hoverElements = document.querySelectorAll('[data-hover]');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            element.classList.remove('hover');
        });
    });
}

function setupRippleEffect() {
    const rippleElements = document.querySelectorAll('[data-ripple]');
    rippleElements.forEach(element => {
        element.addEventListener('click', (e) => {
            createRipple(e, element);
        });
    });
}

function setupTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            positionTooltip(tooltip, element);
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.remove();
        });
    });
}

/**
 * Responsiveness
 */
function setupResponsiveness() {
    setupBreakpointObserver();
    setupImageResponsiveness();
    setupTableResponsiveness();
}

function setupBreakpointObserver() {
    const breakpoints = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
    };

    Object.entries(breakpoints).forEach(([size, value]) => {
        const mediaQuery = window.matchMedia(`(min-width: ${value})`);
        
        function handleBreakpoint(e) {
            document.body.classList.toggle(`breakpoint-${size}`, e.matches);
        }
        
        mediaQuery.addListener(handleBreakpoint);
        handleBreakpoint(mediaQuery);
    });
}

function setupImageResponsiveness() {
    const images = document.querySelectorAll('img[data-responsive]');
    images.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }
    });
}

function setupTableResponsiveness() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

/**
 * Theme Management
 */
function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    setTheme(getStoredTheme() || (prefersDark.matches ? 'dark' : 'light'));
    
    // Handle toggle click
    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    // Handle system theme changes
    prefersDark.addListener((e) => {
        if (!getStoredTheme()) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Utility Functions
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = element.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    element.appendChild(circle);
}

function positionTooltip(tooltip, element) {
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    tooltip.style.top = `${rect.top + scrollTop - tooltip.offsetHeight - 10}px`;
    tooltip.style.left = `${rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
}

function showLoading(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.classList.add('loading');
    button.textContent = button.dataset.loading;

    return () => {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
    };
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        toggle.querySelector('i').className = `bi bi-${theme === 'dark' ? 'sun' : 'moon'}`;
    }
}

function getStoredTheme() {
    return localStorage.getItem('theme');
}

function announceToScreenReader(message) {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
        announcer.textContent = message;
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trapFocus,
        createRipple,
        positionTooltip,
        setTheme,
        getStoredTheme
    };
}
