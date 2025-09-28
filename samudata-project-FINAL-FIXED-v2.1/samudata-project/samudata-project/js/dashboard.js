// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupSidebar();
    initializeChart();
});

function initializeDashboard() {
    // Load dashboard statistics
    loadDashboardStats();
    
    // Setup event listeners
    setupEventListeners();
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

function loadDashboardStats() {
    // In a real application, this would fetch from API
    // For now, showing 0 as per requirements (no dummy data)
    
    const stats = {
        tangkap: 0,
        budidaya: 0,
        kpp: 0,
        pengolahan: 0,
        ekspor: 0
    };
    
    // Update statistics display
    updateStatsDisplay(stats);
}

function updateStatsDisplay(stats) {
    // This would update the dashboard cards with real data
    console.log('Dashboard stats updated:', stats);
}

function initializeChart() {
    const ctx = document.getElementById('uploadChart');
    if (!ctx) return;
    
    // Create upload trend chart with proper empty state
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [{
                label: 'Upload File',
                data: [0, 0, 0, 0, 0, 0], // Real data - currently empty
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10, // Set a reasonable max to prevent long empty lines
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        stepSize: 2
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 4
                }
            }
        }
    });
}

function setupEventListeners() {
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-3 button');
    quickActionButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            switch(index) {
                case 0:
                    // Upload file
                    window.location.href = 'upload.html';
                    break;
                case 1:
                    // Create upload task - redirect to permintaan file
                    window.location.href = 'permintaan-file.html';
                    break;
                case 2:
                    // Upload template - redirect to upload with template mode
                    window.location.href = 'upload.html?mode=template';
                    break;
            }
        });
    });
}

function showCreateTaskModal() {
    // Placeholder for create task modal
    alert('Fitur Buat Tugas Upload akan segera tersedia');
}

function showUploadTemplateModal() {
    // Placeholder for upload template modal
    alert('Fitur Upload Template akan segera tersedia');
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Real-time updates (placeholder)
function startRealTimeUpdates() {
    // In a real application, this would setup WebSocket or polling
    setInterval(() => {
        loadDashboardStats();
    }, 30000); // Update every 30 seconds
}

