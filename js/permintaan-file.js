// Permintaan File JavaScript
const API_BASE_URL = './api';

document.addEventListener('DOMContentLoaded', function() {
    initializePermintaanFile();
    setupSidebar();
    setupEventListeners();
    setupModal();
    loadStatistics();
    loadRequests();
});

function initializePermintaanFile() {
    // Set minimum date to today for deadline
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('request-deadline').min = today;
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
        loadRequests();
    });
    
    // New request buttons
    document.getElementById('new-request-btn').addEventListener('click', function() {
        showModal();
    });
    
    document.getElementById('create-first-request-btn').addEventListener('click', function() {
        showModal();
    });
    
    // Form submission
    document.getElementById('request-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitRequest();
    });
}

function setupModal() {
    const modal = document.getElementById('request-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-request-btn');
    
    // Close modal events
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
}

function showModal() {
    document.getElementById('request-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Reset form
    document.getElementById('request-form').reset();
    
    // Focus on first input
    document.getElementById('request-title').focus();
}

function hideModal() {
    document.getElementById('request-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function loadStatistics() {
    fetch(`${API_BASE_URL}/files.php?action=request_stats`)
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
    document.getElementById('pending-count').textContent = stats.pending || 0;
    document.getElementById('approved-count').textContent = stats.approved || 0;
    document.getElementById('completed-count').textContent = stats.completed || 0;
    document.getElementById('rejected-count').textContent = stats.rejected || 0;
}

function loadRequests() {
    const statusFilter = document.getElementById('status-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    
    const params = new URLSearchParams({
        action: 'requests',
        status_filter: statusFilter,
        priority_filter: priorityFilter,
        category_filter: categoryFilter
    });
    
    fetch(`${API_BASE_URL}/files.php?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.data.length === 0) {
                    showEmptyState();
                } else {
                    showRequestsTable(data.data);
                }
            } else {
                console.error('Error loading requests:', data.message);
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading requests:', error);
            showEmptyState();
        });
}

function showEmptyState() {
    document.getElementById('requests-empty-state').classList.remove('hidden');
    document.querySelector('#requests-table').style.display = 'none';
}

function showRequestsTable(requests) {
    document.getElementById('requests-empty-state').classList.add('hidden');
    document.querySelector('#requests-table').style.display = 'table';
    
    populateRequestsTable(requests);
}

function populateRequestsTable(requests) {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '';
    
    requests.forEach(request => {
        const row = createRequestRow(request);
        tbody.appendChild(row);
    });
    
    // Initialize or reinitialize DataTable
    if ($.fn.DataTable.isDataTable('#requests-table')) {
        $('#requests-table').DataTable().destroy();
    }
    
    $('#requests-table').DataTable({
        responsive: true,
        pageLength: 25,
        order: [[0, 'desc']], // Sort by date descending
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
        }
    });
}

function createRequestRow(request) {
    const row = document.createElement('tr');
    row.className = 'request-item';
    
    const statusBadge = getStatusBadge(request.status);
    const priorityBadge = getPriorityBadge(request.priority);
    const formattedDate = formatDate(request.created_at);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${formattedDate}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
            <div class="font-medium">${request.title}</div>
            <div class="text-xs text-gray-500 mt-1">${request.description.substring(0, 100)}${request.description.length > 100 ? '...' : ''}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${getCategoryDisplayName(request.category)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            ${priorityBadge}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            ${statusBadge}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${request.requester_name}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
                <button onclick="viewRequest(${request.id})" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-eye"></i>
                </button>
                ${request.status === 'pending' ? `
                    <button onclick="approveRequest(${request.id})" class="text-green-600 hover:text-green-900">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="rejectRequest(${request.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                ${request.status === 'approved' ? `
                    <button onclick="completeRequest(${request.id})" class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-check-double"></i>
                    </button>
                ` : ''}
            </div>
        </td>
    `;
    
    return row;
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="status-badge status-pending"><i class="fas fa-clock mr-1"></i>Pending</span>',
        'approved': '<span class="status-badge status-approved"><i class="fas fa-check mr-1"></i>Approved</span>',
        'completed': '<span class="status-badge status-completed"><i class="fas fa-check-double mr-1"></i>Completed</span>',
        'rejected': '<span class="status-badge status-rejected"><i class="fas fa-times mr-1"></i>Rejected</span>'
    };
    
    return badges[status] || `<span class="status-badge">${status}</span>`;
}

function getPriorityBadge(priority) {
    const badges = {
        'high': '<span class="status-badge priority-high"><i class="fas fa-exclamation mr-1"></i>Tinggi</span>',
        'medium': '<span class="status-badge priority-medium"><i class="fas fa-minus mr-1"></i>Sedang</span>',
        'low': '<span class="status-badge priority-low"><i class="fas fa-arrow-down mr-1"></i>Rendah</span>'
    };
    
    return badges[priority] || `<span class="status-badge">${priority}</span>`;
}

function getCategoryDisplayName(category) {
    const categories = {
        'tangkap': 'Perikanan Tangkap',
        'budidaya': 'Perikanan Budidaya',
        'kpp': 'KPP',
        'pengolahan': 'Pengolahan & Pemasaran',
        'ekspor': 'Ekspor Perikanan'
    };
    
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function submitRequest() {
    const formData = new FormData(document.getElementById('request-form'));
    
    fetch(`${API_BASE_URL}/files.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Permintaan berhasil dibuat', 'success');
            hideModal();
            loadStatistics();
            loadRequests();
        } else {
            showNotification('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error submitting request:', error);
        showNotification('Terjadi kesalahan saat mengirim permintaan', 'error');
    });
}

function viewRequest(requestId) {
    // Implement view request details
    showNotification('Fitur detail permintaan akan segera tersedia', 'info');
}

function approveRequest(requestId) {
    if (confirm('Apakah Anda yakin ingin menyetujui permintaan ini?')) {
        updateRequestStatus(requestId, 'approved');
    }
}

function rejectRequest(requestId) {
    if (confirm('Apakah Anda yakin ingin menolak permintaan ini?')) {
        updateRequestStatus(requestId, 'rejected');
    }
}

function completeRequest(requestId) {
    if (confirm('Apakah Anda yakin permintaan ini sudah selesai?')) {
        updateRequestStatus(requestId, 'completed');
    }
}

function updateRequestStatus(requestId, status) {
    const formData = new FormData();
    formData.append('action', 'update_request_status');
    formData.append('request_id', requestId);
    formData.append('status', status);
    
    fetch(`${API_BASE_URL}/files.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Status permintaan berhasil diperbarui', 'success');
            loadStatistics();
            loadRequests();
        } else {
            showNotification('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error updating request status:', error);
        showNotification('Terjadi kesalahan saat memperbarui status', 'error');
    });
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

