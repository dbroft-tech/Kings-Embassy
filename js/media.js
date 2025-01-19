// Media Integration System

document.addEventListener('DOMContentLoaded', function() {
    initializeMedia();
});

function initializeMedia() {
    setupMediaGallery();
    setupVideoPlayers();
    setupAudioPlayers();
    setupLiveStream();
    setupMediaOptimization();
}

/**
 * Media Gallery Functions
 */
function setupMediaGallery() {
    const gallery = document.querySelector('.media-gallery');
    if (!gallery) return;

    // Initialize Masonry layout
    const masonry = new Masonry(gallery, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-sizer',
        percentPosition: true
    });

    // Initialize lightbox
    const lightbox = GLightbox({
        selector: '.gallery-item',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });

    // Setup lazy loading
    const lazyLoadInstance = new LazyLoad({
        elements_selector: '.lazy',
        callback_loaded: (el) => {
            masonry.layout(); // Refresh layout when images load
        }
    });

    // Setup filters
    setupGalleryFilters(masonry);
}

function setupGalleryFilters(masonry) {
    const filterButtons = document.querySelectorAll('.gallery-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterGalleryItems(filter, masonry);
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function filterGalleryItems(filter, masonry) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    masonry.layout();
}

/**
 * Video Player Functions
 */
function setupVideoPlayers() {
    const videoPlayers = document.querySelectorAll('.video-player');
    videoPlayers.forEach(player => {
        initializeVideoPlayer(player);
    });
}

function initializeVideoPlayer(container) {
    const videoId = container.dataset.videoId;
    const player = new Plyr(container, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        settings: ['captions', 'quality', 'speed'],
        quality: {
            default: 720,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        }
    });

    // Handle quality changes based on network
    player.on('ready', () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            adjustVideoQuality(player, connection);
            connection.addEventListener('change', () => adjustVideoQuality(player, connection));
        }
    });
}

function adjustVideoQuality(player, connection) {
    const speed = connection.downlink; // Mbps
    let quality = 360; // Default to 360p

    if (speed > 10) quality = 1080;
    else if (speed > 5) quality = 720;
    else if (speed > 2) quality = 480;

    player.quality = quality;
}

/**
 * Audio Player Functions
 */
function setupAudioPlayers() {
    const audioPlayers = document.querySelectorAll('.audio-player');
    audioPlayers.forEach(player => {
        initializeAudioPlayer(player);
    });
}

function initializeAudioPlayer(container) {
    const player = new Plyr(container, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
        settings: ['speed']
    });

    // Add download button if allowed
    if (container.dataset.allowDownload === 'true') {
        addDownloadButton(container);
    }
}

function addDownloadButton(container) {
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'plyr__control';
    downloadBtn.innerHTML = '<i class="bi bi-download"></i>';
    downloadBtn.addEventListener('click', () => {
        const audioUrl = container.querySelector('audio').src;
        downloadMedia(audioUrl);
    });
    container.querySelector('.plyr__controls').appendChild(downloadBtn);
}

/**
 * Live Streaming Functions
 */
function setupLiveStream() {
    const streamContainer = document.getElementById('liveStream');
    if (!streamContainer) return;

    // Initialize HLS.js
    if (Hls.isSupported()) {
        const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            enableWorker: true,
            lowLatencyMode: true
        });

        const videoElement = streamContainer.querySelector('video');
        hls.loadSource(streamContainer.dataset.streamUrl);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play();
        });

        // Handle network issues
        setupStreamErrorHandling(hls, videoElement);
    }
    // For Safari
    else if (streamContainer.querySelector('video').canPlayType('application/vnd.apple.mpegurl')) {
        const videoElement = streamContainer.querySelector('video');
        videoElement.src = streamContainer.dataset.streamUrl;
        videoElement.addEventListener('loadedmetadata', () => {
            videoElement.play();
        });
    }
}

function setupStreamErrorHandling(hls, video) {
    hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
            switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    console.log('Fatal network error encountered, trying to recover...');
                    hls.startLoad();
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log('Fatal media error encountered, trying to recover...');
                    hls.recoverMediaError();
                    break;
                default:
                    console.error('Fatal error, cannot recover:', data);
                    hls.destroy();
                    break;
            }
        }
    });
}

/**
 * Media Optimization Functions
 */
function setupMediaOptimization() {
    // Implement responsive images
    setupResponsiveImages();
    
    // Setup service worker for caching
    setupMediaCaching();
    
    // Monitor network conditions
    setupNetworkMonitoring();
}

function setupResponsiveImages() {
    const images = document.querySelectorAll('img[srcset]');
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.saveData) {
            // If data saver is enabled, force low quality images
            images.forEach(img => {
                const smallestSrc = getSmallestImage(img.srcset);
                img.src = smallestSrc;
            });
        }
    }
}

function setupMediaCaching() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Media service worker registered:', registration);
            })
            .catch(error => {
                console.error('Media service worker registration failed:', error);
            });
    }
}

function setupNetworkMonitoring() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        connection.addEventListener('change', handleNetworkChange);
    }
}

/**
 * Utility Functions
 */
function getSmallestImage(srcset) {
    const sources = srcset.split(',');
    let smallestWidth = Infinity;
    let smallestSrc = '';

    sources.forEach(source => {
        const [url, width] = source.trim().split(' ');
        const numWidth = parseInt(width);
        if (numWidth < smallestWidth) {
            smallestWidth = numWidth;
            smallestSrc = url;
        }
    });

    return smallestSrc;
}

function downloadMedia(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleNetworkChange(e) {
    const connection = e.target;
    const videoPlayers = document.querySelectorAll('.video-player');
    
    videoPlayers.forEach(container => {
        const player = new Plyr(container);
        adjustVideoQuality(player, connection);
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        adjustVideoQuality,
        getSmallestImage
    };
}
