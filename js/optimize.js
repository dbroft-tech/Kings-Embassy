// Performance Optimization and Testing

document.addEventListener('DOMContentLoaded', function() {
    initializeOptimizations();
});

function initializeOptimizations() {
    setupPerformanceMonitoring();
    setupResponsiveImages();
    setupLazyLoading();
    setupCriticalCSS();
    setupSecurityMeasures();
    setupBrowserCompatibility();
}

/**
 * Performance Monitoring
 */
function setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    monitorWebVitals();
    
    // Monitor Resource Timing
    monitorResourceTiming();
    
    // Monitor User Interactions
    monitorUserInteractions();
}

function monitorWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        reportToAnalytics('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
            reportToAnalytics('FID', entry.processingStart - entry.startTime);
        });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            console.log('CLS:', entry.value);
            reportToAnalytics('CLS', entry.value);
        });
    }).observe({ entryTypes: ['layout-shift'] });
}

function monitorResourceTiming() {
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            if (entry.initiatorType === 'img' || entry.initiatorType === 'script') {
                const timing = {
                    name: entry.name,
                    duration: entry.duration,
                    size: entry.transferSize,
                    type: entry.initiatorType
                };
                reportToAnalytics('ResourceTiming', timing);
            }
        });
    }).observe({ entryTypes: ['resource'] });
}

function monitorUserInteractions() {
    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    reportToAnalytics('TTFB', ttfb);

    // Time to Interactive
    const tti = performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-contentful-paint').startTime;
    reportToAnalytics('TTI', tti);
}

/**
 * Responsive Images
 */
function setupResponsiveImages() {
    // Use native lazy loading where supported
    document.querySelectorAll('img').forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });

    // Setup responsive srcset
    setupResponsiveSrcSet();

    // Monitor viewport changes
    setupViewportMonitoring();
}

function setupResponsiveSrcSet() {
    document.querySelectorAll('img[data-srcset]').forEach(img => {
        const srcset = img.dataset.srcset;
        if (srcset) {
            img.srcset = srcset;
        }
    });
}

function setupViewportMonitoring() {
    const observer = new ResizeObserver(entries => {
        entries.forEach(entry => {
            updateImagesForViewport(entry.contentRect.width);
        });
    });
    observer.observe(document.body);
}

/**
 * Lazy Loading
 */
function setupLazyLoading() {
    // Setup Intersection Observer for elements
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '50px 0px',
            threshold: 0.1
        }
    );

    // Observe all lazy elements
    document.querySelectorAll('[data-lazy]').forEach(element => {
        observer.observe(element);
    });
}

function loadElement(element) {
    if (element.tagName.toLowerCase() === 'img') {
        element.src = element.dataset.src;
    } else if (element.tagName.toLowerCase() === 'iframe') {
        element.src = element.dataset.src;
    } else {
        element.style.backgroundImage = `url(${element.dataset.src})`;
    }
}

/**
 * Critical CSS
 */
function setupCriticalCSS() {
    // Inline critical CSS
    inlineCriticalCSS();
    
    // Defer non-critical CSS
    deferNonCriticalCSS();
}

function inlineCriticalCSS() {
    const criticalCSS = document.getElementById('critical-css');
    if (criticalCSS) {
        const style = document.createElement('style');
        style.textContent = criticalCSS.textContent;
        document.head.appendChild(style);
        criticalCSS.remove();
    }
}

function deferNonCriticalCSS() {
    document.querySelectorAll('link[rel="stylesheet"][data-defer]').forEach(link => {
        link.media = 'print';
        link.onload = () => {
            link.media = 'all';
        };
    });
}

/**
 * Security Measures
 */
function setupSecurityMeasures() {
    // Content Security Policy
    setupCSP();
    
    // XSS Protection
    setupXSSProtection();
    
    // Input Sanitization
    setupInputSanitization();
}

function setupCSP() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
        default-src 'self';
        script-src 'self' https://cdn.jsdelivr.net;
        style-src 'self' https://cdn.jsdelivr.net;
        img-src 'self' data: https:;
        font-src 'self' https://cdn.jsdelivr.net;
        connect-src 'self';
        media-src 'self';
        object-src 'none';
        frame-src 'self';
        worker-src 'self';
    `;
    document.head.appendChild(meta);
}

function setupXSSProtection() {
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = sanitizeInput(e.target.value);
        });
    });
}

function setupInputSanitization() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const formData = new FormData(form);
            for (let [key, value] of formData.entries()) {
                formData.set(key, sanitizeInput(value));
            }
        });
    });
}

/**
 * Browser Compatibility
 */
function setupBrowserCompatibility() {
    // Feature Detection
    setupFeatureDetection();
    
    // Polyfills
    loadPolyfills();
    
    // Browser-specific styles
    setupBrowserStyles();
}

function setupFeatureDetection() {
    const features = {
        grid: 'grid' in document.documentElement.style,
        flexbox: 'flexbox' in document.documentElement.style,
        webp: checkWebPSupport(),
        touch: 'ontouchstart' in window
    };
    
    document.documentElement.className = Object.entries(features)
        .filter(([, supported]) => supported)
        .map(([feature]) => `has-${feature}`)
        .join(' ');
}

async function loadPolyfills() {
    if (!('IntersectionObserver' in window)) {
        await import('intersection-observer');
    }
    if (!('ResizeObserver' in window)) {
        await import('resize-observer-polyfill');
    }
}

function setupBrowserStyles() {
    const ua = navigator.userAgent;
    if (ua.includes('Safari') && !ua.includes('Chrome')) {
        document.documentElement.classList.add('is-safari');
    } else if (ua.includes('Firefox')) {
        document.documentElement.classList.add('is-firefox');
    }
}

/**
 * Utility Functions
 */
function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
}

function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

function reportToAnalytics(metric, value) {
    // This would be replaced with actual analytics reporting
    console.log(`Analytics: ${metric} = ${value}`);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeInput,
        checkWebPSupport,
        monitorWebVitals
    };
}
