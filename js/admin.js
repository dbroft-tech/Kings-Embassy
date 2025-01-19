/**
 * Initialize the admin dashboard
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTables();
    setupEventListeners();
    initializeLazyLoading();
});

/**
 * Initialize DataTables
 */
function initializeTables() {
    const tables = {
        'prayerRequestsTable': {
            order: [[3, 'desc']], // Sort by date
            columns: [
                { width: '15%' },
                { width: '10%' },
                { width: '30%' },
                { width: '15%' },
                { width: '10%' },
                { width: '20%' }
            ]
        },
        'testimoniesTable': {
            order: [[3, 'desc']], // Sort by date
            columns: [
                { width: '15%' },
                { width: '10%' },
                { width: '30%' },
                { width: '15%' },
                { width: '10%' },
                { width: '20%' }
            ]
        },
        'eventsTable': {
            order: [[1, 'asc']], // Sort by date
            columns: [
                { width: '20%' },
                { width: '15%' },
                { width: '20%' },
                { width: '15%' },
                { width: '10%' },
                { width: '20%' }
            ]
        },
        'registrationsTable': {
            order: [[4, 'desc']], // Sort by date
            columns: [
                { width: '15%' },
                { width: '10%' },
                { width: '20%' },
                { width: '15%' },
                { width: '15%' },
                { width: '10%' },
                { width: '15%' }
            ]
        }
    };

    // Initialize each table with its specific configuration
    for (const [tableId, config] of Object.entries(tables)) {
        const table = document.getElementById(tableId);
        if (table) {
            $(table).DataTable({
                ...config,
                responsive: true,
                pageLength: 10,
                lengthChange: false,
                dom: '<"top"f>rt<"bottom"p><"clear">',
                language: {
                    search: '',
                    searchPlaceholder: 'Search...'
                }
            });
        }
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation (to be implemented)
            const section = this.getAttribute('href').substring(1);
            navigateToSection(section);
        });
    });

    // Action Buttons
    setupActionButtons();
}

/**
 * Setup Action Button Event Listeners
 */
function setupActionButtons() {
    // View buttons
    document.querySelectorAll('[title="View"]').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.dataset.id;
            viewItem(id);
        });
    });

    // Edit buttons
    document.querySelectorAll('[title="Edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.dataset.id;
            editItem(id);
        });
    });

    // Delete buttons
    document.querySelectorAll('[title="Delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.dataset.id;
            deleteItem(id);
        });
    });

    // Mark as Prayed buttons
    document.querySelectorAll('[title="Mark as Prayed"]').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.dataset.id;
            markAsPrayed(id);
        });
    });
}

/**
 * Navigate to Section
 */
function navigateToSection(section) {
    // Implementation for section navigation
    console.log(`Navigating to ${section}`);
}

/**
 * View Item
 */
function viewItem(id) {
    // Implementation for viewing items
    console.log(`Viewing item ${id}`);
}

/**
 * Edit Item
 */
function editItem(id) {
    // Implementation for editing items
    console.log(`Editing item ${id}`);
}

/**
 * Delete Item
 */
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        // Implementation for deleting items
        console.log(`Deleting item ${id}`);
    }
}

/**
 * Mark Prayer Request as Prayed
 */
function markAsPrayed(id) {
    // Implementation for marking prayer requests as prayed
    console.log(`Marking prayer request ${id} as prayed`);
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const observer = lozad();
    observer.observe();
}

/**
 * Show Alert Message
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

/**
 * Format Date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format Time
 */
function formatTime(time) {
    return new Date(time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Export Data to CSV
 */
function exportToCSV(tableId, filename) {
    const table = $(`#${tableId}`).DataTable();
    const csv = table.data().toArray().map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
