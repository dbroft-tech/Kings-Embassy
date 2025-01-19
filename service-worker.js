// Media Service Worker

const CACHE_NAME = 'kings-embassy-media-v1';
const MEDIA_CACHE_NAME = 'kings-embassy-media-content-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/js/media.js',
    '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('kings-embassy-') &&
                                   cacheName !== CACHE_NAME &&
                                   cacheName !== MEDIA_CACHE_NAME;
                        })
                        .map(cacheName => caches.delete(cacheName))
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Handle media files differently
    if (isMediaFile(url.pathname)) {
        event.respondWith(handleMediaFetch(request));
    }
    // Handle other requests
    else {
        event.respondWith(handleNormalFetch(request));
    }
});

/**
 * Media Fetch Handler
 */
async function handleMediaFetch(request) {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.ok) {
            const cache = await caches.open(MEDIA_CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('Media fetch failed:', error);
        // Return offline media placeholder if available
        return caches.match('/assets/offline-media.jpg');
    }
}

/**
 * Normal Fetch Handler
 */
async function handleNormalFetch(request) {
    // Network first, falling back to cache
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

/**
 * Background Sync
 */
self.addEventListener('sync', event => {
    if (event.tag === 'media-upload') {
        event.waitUntil(handleMediaUploadSync());
    }
});

async function handleMediaUploadSync() {
    try {
        const mediaQueue = await getMediaUploadQueue();
        await Promise.all(
            mediaQueue.map(async mediaItem => {
                try {
                    await uploadMedia(mediaItem);
                    await removeFromQueue(mediaItem.id);
                } catch (error) {
                    console.error('Failed to upload media:', error);
                }
            })
        );
    } catch (error) {
        console.error('Media sync failed:', error);
        throw error;
    }
}

/**
 * Push Notifications
 */
self.addEventListener('push', event => {
    if (!event.data) return;

    const data = event.data.json();
    if (data.type === 'media-processed') {
        event.waitUntil(
            self.registration.showNotification('Media Processing Complete', {
                body: data.message,
                icon: '/assets/icon-192x192.png',
                badge: '/assets/badge-72x72.png',
                data: { url: data.url }
            })
        );
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

/**
 * Utility Functions
 */
function isMediaFile(pathname) {
    const mediaExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.mp4', '.webm', '.ogg',
        '.mp3', '.wav', '.m4a'
    ];
    return mediaExtensions.some(ext => pathname.toLowerCase().endsWith(ext));
}

// These functions would be implemented with IndexedDB
async function getMediaUploadQueue() {
    // Implementation would use IndexedDB
    return [];
}

async function uploadMedia(mediaItem) {
    // Implementation would use Fetch API
}

async function removeFromQueue(id) {
    // Implementation would use IndexedDB
}
