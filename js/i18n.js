// Multi-language Support System

const i18n = {
    en: {
        nav: {
            home: 'Home',
            about: 'About Us',
            testimonies: 'Testimonies',
            firstTimers: 'First Timers',
            newConverts: 'New Converts',
            prayerRequest: 'Prayer Request',
            contact: 'Contact',
            media: 'Media',
            events: 'Events'
        },
        home: {
            welcome: 'Welcome to Kings Embassy',
            tagline: 'A Place of Divine Encounter',
            worship: 'Join Us in Worship',
            services: 'Service Times',
            location: 'Our Location',
            about: 'About Us'
        },
        forms: {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            message: 'Message',
            submit: 'Submit',
            required: 'Required field',
            success: 'Successfully submitted',
            error: 'Error submitting form'
        }
    },
    sw: {
        nav: {
            home: 'Nyumbani',
            about: 'Kuhusu Sisi',
            testimonies: 'Shuhuda',
            firstTimers: 'Wageni',
            newConverts: 'Waongofu Wapya',
            prayerRequest: 'Maombi',
            contact: 'Wasiliana',
            media: 'Midia',
            events: 'Matukio'
        },
        home: {
            welcome: 'Karibu Kings Embassy',
            tagline: 'Mahali pa Kukutana na Mungu',
            worship: 'Jiunge Nasi Kuabudu',
            services: 'Nyakati za Ibada',
            location: 'Mahali Tulipo',
            about: 'Kuhusu Sisi'
        },
        forms: {
            name: 'Jina',
            email: 'Barua Pepe',
            phone: 'Simu',
            message: 'Ujumbe',
            submit: 'Tuma',
            required: 'Inahitajika',
            success: 'Imetumwa kikamilifu',
            error: 'Hitilafu kutuma fomu'
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSupport();
});

function initializeLanguageSupport() {
    setupLanguageSelector();
    loadUserLanguage();
    setupLanguageObserver();
}

/**
 * Language Selector Setup
 */
function setupLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (!selector) return;

    // Add event listener
    selector.addEventListener('change', (e) => {
        const lang = e.target.value;
        changeLanguage(lang);
    });

    // Set initial value
    const currentLang = getCurrentLanguage();
    selector.value = currentLang;
}

/**
 * Language Loading
 */
function loadUserLanguage() {
    const lang = getCurrentLanguage();
    translatePage(lang);
}

function getCurrentLanguage() {
    return localStorage.getItem('preferred_language') || 
           navigator.language.split('-')[0] || 
           'en';
}

/**
 * Language Change
 */
function changeLanguage(lang) {
    if (!i18n[lang]) {
        console.error(`Language ${lang} not supported`);
        return;
    }

    localStorage.setItem('preferred_language', lang);
    translatePage(lang);
    document.documentElement.lang = lang;
    
    // Update meta tags
    updateMetaTags(lang);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}

/**
 * Translation
 */
function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.dataset.i18n;
        const translation = getTranslation(key, lang);
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

function getTranslation(key, lang) {
    const keys = key.split('.');
    let translation = i18n[lang];
    
    for (const k of keys) {
        if (!translation[k]) return null;
        translation = translation[k];
    }
    
    return translation;
}

/**
 * Dynamic Content Observer
 */
function setupLanguageObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const lang = getCurrentLanguage();
                translateNewContent(mutation.addedNodes, lang);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function translateNewContent(nodes, lang) {
    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const elements = node.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.dataset.i18n;
                const translation = getTranslation(key, lang);
                if (translation) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            });
        }
    });
}

/**
 * Meta Tags Update
 */
function updateMetaTags(lang) {
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    
    if (metaDescription) {
        metaDescription.content = getTranslation('meta.description', lang);
    }
    
    if (metaKeywords) {
        metaKeywords.content = getTranslation('meta.keywords', lang);
    }
}

/**
 * Date and Time Formatting
 */
function formatDate(date, lang) {
    return new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(date, lang) {
    return new Intl.DateTimeFormat(lang, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);
}

/**
 * Currency Formatting
 */
function formatCurrency(amount, currency, lang) {
    return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentLanguage,
        getTranslation,
        formatDate,
        formatTime,
        formatCurrency
    };
}
