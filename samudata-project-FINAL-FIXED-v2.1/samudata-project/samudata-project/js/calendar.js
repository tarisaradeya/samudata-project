// Calendar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupSidebar();
    setupModals();
});

let calendar;

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'id',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hari Ini',
            month: 'Bulan',
            week: 'Minggu',
            day: 'Hari'
        },
        events: getCalendarEvents(),
        eventClick: function(info) {
            showEventDetails(info.event);
        },
        dateClick: function(info) {
            showAddEventModal(info.date);
        },
        eventClassNames: function(arg) {
            return ['fc-event-' + arg.event.extendedProps.bidang];
        },
        height: 'auto',
        dayMaxEvents: 3,
        moreLinkClick: 'popover'
    });
    
    calendar.render();
}

function getCalendarEvents() {
    // Sample events for demonstration - will be replaced with real API data
    return [
        {
            id: '1',
            title: 'Upload Laporan Perikanan Tangkap',
            start: '2024-03-15',
            extendedProps: {
                bidang: 'tangkap',
                description: 'Laporan triwulan pertama perikanan tangkap'
            },
            className: 'fc-event-tangkap'
        },
        {
            id: '2',
            title: 'Upload Data Budidaya Udang',
            start: '2024-03-10',
            extendedProps: {
                bidang: 'budidaya',
                description: 'Data produksi budidaya udang Sidoarjo'
            },
            className: 'fc-event-budidaya'
        },
        {
            id: '3',
            title: 'Upload Sertifikat KPP',
            start: '2024-02-28',
            extendedProps: {
                bidang: 'kpp',
                description: 'Sertifikat KPP Gresik 2024'
            },
            className: 'fc-event-kpp'
        },
        {
            id: '4',
            title: 'Jadwal Inspeksi Pengolahan',
            start: '2024-04-05',
            extendedProps: {
                bidang: 'pengolahan',
                description: 'Inspeksi fasilitas pengolahan ikan di Malang'
            },
            className: 'fc-event-pengolahan'
        },
        {
            id: '5',
            title: 'Rapat Koordinasi Ekspor',
            start: '2024-04-10',
            extendedProps: {
                bidang: 'ekspor',
                description: 'Koordinasi ekspor perikanan dengan stakeholder'
            },
            className: 'fc-event-ekspor'
        }
    ];
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

function setupModals() {
    // Add Event Modal
    const addEventModal = document.getElementById('add-event-modal');
    const closeAddModal = document.getElementById('close-add-modal');
    const cancelAddEvent = document.getElementById('cancel-add-event');
    const addEventForm = document.getElementById('add-event-form');
    
    // Event Detail Modal
    const eventModal = document.getElementById('event-modal');
    const closeEventModal = document.getElementById('close-event-modal');
    
    // Add event button
    const addEventBtn = document.querySelector('button:contains("Jadwal Baru")');
    document.addEventListener('click', function(e) {
        if (e.target.closest('button') && e.target.closest('button').textContent.includes('Jadwal Baru')) {
            showAddEventModal();
        }
    });
    
    // Close modal events
    [closeAddModal, cancelAddEvent].forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                hideAddEventModal();
            });
        }
    });
    
    if (closeEventModal) {
        closeEventModal.addEventListener('click', function() {
            hideEventModal();
        });
    }
    
    // Close modals when clicking outside
    [addEventModal, eventModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    if (modal === addEventModal) {
                        hideAddEventModal();
                    } else {
                        hideEventModal();
                    }
                }
            });
        }
    });
    
    // Handle form submission
    if (addEventForm) {
        addEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddEvent();
        });
    }
}

function showAddEventModal(date = null) {
    const modal = document.getElementById('add-event-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Set date if provided
        if (date) {
            const dateInput = document.getElementById('event-date');
            if (dateInput) {
                dateInput.value = date.toISOString().split('T')[0];
            }
        }
    }
}

function hideAddEventModal() {
    const modal = document.getElementById('add-event-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('add-event-form');
        if (form) {
            form.reset();
        }
    }
}

function showEventDetails(event) {
    const modal = document.getElementById('event-modal');
    const detailsContainer = document.getElementById('event-details');
    
    if (modal && detailsContainer) {
        // Populate event details
        detailsContainer.innerHTML = `
            <div class="space-y-4">
                <div>
                    <h4 class="font-semibold text-gray-900">${event.title}</h4>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Bidang</label>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getBidangColor(event.extendedProps.bidang)}-100 text-${getBidangColor(event.extendedProps.bidang)}-800">
                        ${getBidangName(event.extendedProps.bidang)}
                    </span>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Tanggal</label>
                    <p class="text-sm text-gray-900">${formatDate(event.start)}</p>
                </div>
                ${event.extendedProps.description ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <p class="text-sm text-gray-900">${event.extendedProps.description}</p>
                </div>
                ` : ''}
                <div class="flex justify-end space-x-2 pt-4">
                    <button onclick="editEvent('${event.id}')" class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="deleteEvent('${event.id}')" class="px-3 py-1 text-sm text-red-600 hover:text-red-800">
                        <i class="fas fa-trash mr-1"></i>Hapus
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function handleAddEvent() {
    // Get form data
    const title = document.getElementById('event-title').value;
    const bidang = document.getElementById('event-bidang').value;
    const date = document.getElementById('event-date').value;
    const description = document.getElementById('event-description').value;
    
    // Validate required fields
    if (!title || !bidang || !date) {
        alert('Mohon lengkapi semua field yang wajib diisi');
        return;
    }
    
    // Create new event
    const newEvent = {
        id: Date.now().toString(),
        title: title,
        start: date,
        extendedProps: {
            bidang: bidang,
            description: description
        },
        className: 'fc-event-' + bidang
    };
    
    // Add event to calendar
    calendar.addEvent(newEvent);
    
    // In a real application, this would save to server
    console.log('Adding event:', newEvent);
    
    // Show success message
    alert('Jadwal berhasil ditambahkan!');
    hideAddEventModal();
}

function editEvent(eventId) {
    console.log('Editing event:', eventId);
    // In a real application, this would open edit modal
    alert('Fitur edit jadwal akan segera tersedia');
}

function deleteEvent(eventId) {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
        const event = calendar.getEventById(eventId);
        if (event) {
            event.remove();
        }
        
        console.log('Deleting event:', eventId);
        // In a real application, this would delete from server
        
        hideEventModal();
        alert('Jadwal berhasil dihapus!');
    }
}

// Utility functions
function getBidangColor(bidang) {
    const colors = {
        'tangkap': 'blue',
        'budidaya': 'green',
        'kpp': 'cyan',
        'pengolahan': 'yellow',
        'ekspor': 'purple'
    };
    return colors[bidang] || 'gray';
}

function getBidangName(bidang) {
    const names = {
        'tangkap': 'Perikanan Tangkap',
        'budidaya': 'Perikanan Budidaya',
        'kpp': 'KPP',
        'pengolahan': 'Pengolahan & Pemasaran',
        'ekspor': 'Ekspor Perikanan'
    };
    return names[bidang] || bidang;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Load events from server (placeholder)
function loadEvents() {
    // In a real application, this would fetch events from API
    return [];
}

// Save event to server (placeholder)
function saveEvent(event) {
    // In a real application, this would save event to server
    console.log('Saving event:', event);
}

