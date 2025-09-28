// Histori & Log JavaScript
const API_BASE_URL = './api';

document.addEventListener('DOMContentLoaded', function() {
    initializeHistoriLog();
    setupSidebar();
    setupEventListeners();
    loadStatistics();
    loadLogData();
});

function initializeHistoriLog() {
    // Set default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('start-date').value = startDate.toISOString().split('T')[0];
    document.getElementById('end-date').value = endDate.toISOString().split('T')[0];
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-hidden');
        });
    }
    
    // Sidebar close button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('sidebar-hidden');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 1024) {
            if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
                sidebar.classList.add('sidebar-hidden');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('sidebar-hidden');
        }
    });
}

function setupEventListeners() {
    // Filter button
    document.getElementById('filter-btn').addEventListener('click', function() {
        loadLogData();
    });
    
    // Export button
    document.getElementById('export-log-btn').addEventListener('click', function() {
        exportLogData();
    });
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadStatistics();
        loadLogData();
    }, 30000);
}

function loadStatistics() {
    fetch(`${API_BASE_URL}/files.php?action=log_stats`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateStatistics(data.data);
            } else {
                console.error('Error loading statistics:', data.message);
            }
        })
        .catch(error => {
            console.error('Error loading statistics:', error);
        });
}

function updateStatistics(stats) {
    document.getElementById('total-uploads').textContent = stats.total_uploads || 0;
    document.getElementById('total-downloads').textContent = stats.total_downloads || 0;
    document.getElementById('total-views').textContent = stats.total_views || 0;
    document.getElementById('today-activities').textContent = stats.today_activities || 0;
}

function loadLogData() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const actionFilter = document.getElementById('action-filter').value;
    
    const params = new URLSearchParams({
        action: 'logs',
        start_date: startDate,
        end_date: endDate,
        action_filter: actionFilter
    });
    
    fetch(`${API_BASE_URL}/files.php?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.data.length === 0) {
                    showEmptyState();
                } else {
                    showLogTable(data.data);
                }
            } else {
                console.error('Error loading log data:', data.message);
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading log data:', error);
            showEmptyState();
        });
}

function showEmptyState() {
    document.getElementById('log-empty-state').classList.remove('hidden');
    document.querySelector('#log-table').style.display = 'none';
}

function showLogTable(logs) {
    document.getElementById('log-empty-state').classList.add('hidden');
    document.querySelector('#log-table').style.display = 'table';
    
    populateLogTable(logs);
}

function populateLogTable(logs) {
    const tbody = document.getElementById('log-table-body');
    tbody.innerHTML = '';
    
    logs.forEach(log => {
        const row = createLogRow(log);
        tbody.appendChild(row);
    });
    
    // Initialize or reinitialize DataTable
    if ($.fn.DataTable.isDataTable('#log-table')) {
        $('#log-table').DataTable().destroy();
    }
    
    $('#log-table').DataTable({
        responsive: true,
        pageLength: 25,
        order: [[0, 'desc']], // Sort by date descending
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
        }
    });
}

function createLogRow(log) {
    const row = document.createElement('tr');
    row.className = 'log-item';
    
    const actionBadge = getActionBadge(log.action);
    const formattedDate = formatDate(log.accessed_at);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${formattedDate}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            ${actionBadge}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
            <div class="flex items-center">
                <i class="fas fa-file text-gray-400 mr-2"></i>
                <div>
                    <div class="font-medium">${log.file_title || 'File tidak ditemukan'}</div>
                    <div class="text-xs text-gray-500">${log.original_filename || ''}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${log.uploader_name || 'System'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${log.ip_address || '-'}
        </td>
    `;
    
    return row;
}

function getActionBadge(action) {
    const badges = {
        'upload': '<span class="action-badge action-upload"><i class="fas fa-upload mr-1"></i>Upload</span>',
        'download': '<span class="action-badge action-download"><i class="fas fa-download mr-1"></i>Download</span>',
        'view': '<span class="action-badge action-view"><i class="fas fa-eye mr-1"></i>View</span>',
        'update': '<span class="action-badge action-update"><i class="fas fa-edit mr-1"></i>Update</span>',
        'delete': '<span class="action-badge action-delete"><i class="fas fa-trash mr-1"></i>Delete</span>'
    };
    
    return badges[action] || `<span class="action-badge">${action}</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

function exportLogData() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const actionFilter = document.getElementById('action-filter').value;
    
    const params = new URLSearchParams({
        action: 'export_logs',
        start_date: startDate,
        end_date: endDate,
        action_filter: actionFilter
    });
    
    // Create download link
    const downloadUrl = `${API_BASE_URL}/files.php?${params}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `log_aktivitas_${startDate}_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility functions
function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

