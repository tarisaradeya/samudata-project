// Main Application JavaScript
const API_BASE_URL = './api';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeMap();
    loadStatistics();
    setupEventListeners();
});

// Load statistics from API
function loadStatistics() {
    fetch(`${API_BASE_URL}/files.php?action=stats`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateStatisticsDisplay(data.data);
            } else {
                console.error('Error loading statistics:', data.message);
                // Show default empty statistics
                updateStatisticsDisplay({
                    categories: [
                        { name: 'tangkap', display_name: 'Perikanan Tangkap', count: 0 },
                        { name: 'budidaya', display_name: 'Perikanan Budidaya', count: 0 },
                        { name: 'kpp', display_name: 'KPP', count: 0 },
                        { name: 'pengolahan', display_name: 'Pengolahan & Pemasaran', count: 0 },
                        { name: 'ekspor', display_name: 'Ekspor Perikanan', count: 0 }
                    ],
                    total_files: 0,
                    total_size: 0
                });
            }
        })
        .catch(error => {
            console.error('Error loading statistics:', error);
        });
}

// Update statistics display
function updateStatisticsDisplay(stats) {
    // Update category counts
    stats.categories.forEach(category => {
        const countElement = document.getElementById(`${category.name}-count`);
        if (countElement) {
            countElement.textContent = category.count;
        }
    });
}

// Initialize Leaflet Map
function initializeMap() {
    // Initialize map centered on East Java
    const map = L.map('map').setView([-7.5, 112.5], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add DKP office markers
    addDKPOfficeMarkers(map);

    // Load East Java GeoJSON data
    loadJatimGeoJSON(map);
}

// Add DKP office markers to the map
function addDKPOfficeMarkers(map) {
    // DKP office locations
    const dkpOffices = [
        {
            name: "DKP Provinsi Jawa Timur (Kantor Pusat)",
            lat: -7.2575,
            lng: 112.7521,
            address: "Jl. Ahmad Yani No. 152-B, Surabaya",
            type: "main",
            phone: "(031) 8292326"
        },
        {
            name: "Cabang Dinas DKP Kab. Malang",
            lat: -8.1335,
            lng: 112.6304,
            address: "Jl. Trunojoyo 12, Kepanjen, Malang",
            type: "branch",
            phone: "-"
        },
        {
            name: "UPT PPP Muncar",
            lat: -8.4320,
            lng: 114.3370,
            address: "Muncar, Banyuwangi",
            type: "upt",
            phone: "-"
        },
        {
            name: "UPT PPP Mayangan",
            lat: -7.9797,
            lng: 112.6304,
            address: "Mayangan, Probolinggo",
            type: "upt",
            phone: "-"
        },
        {
            name: "UPT PPP Tamperan",
            lat: -7.7956,
            lng: 113.2317,
            address: "Tamperan, Pacitan",
            type: "upt",
            phone: "-"
        },
        {
            name: "UPT PPP Bulu",
            lat: -6.8957,
            lng: 112.4304,
            address: "Bulu, Tuban",
            type: "upt",
            phone: "-"
        },
        {
            name: "UPT PMP2KP Surabaya",
            lat: -7.2575,
            lng: 112.7521,
            address: "Surabaya",
            type: "upt",
            phone: "-"
        },
        {
            name: "UPT PM2KP Banyuwangi",
            lat: -8.2192,
            lng: 114.3691,
            address: "Banyuwangi",
            type: "upt",
            phone: "-"
        }
    ];

    // Create custom icons for different office types
    const mainOfficeIcon = L.divIcon({
        html: '<i class="fas fa-building text-blue-600 text-xl"></i>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });

    const branchOfficeIcon = L.divIcon({
        html: '<i class="fas fa-home text-green-600 text-lg"></i>',
        iconSize: [25, 25],
        className: 'custom-div-icon'
    });

    const uptOfficeIcon = L.divIcon({
        html: '<i class="fas fa-anchor text-orange-600 text-lg"></i>',
        iconSize: [25, 25],
        className: 'custom-div-icon'
    });

    // Add markers for each office
    dkpOffices.forEach(office => {
        let icon;
        let markerColor;
        
        switch(office.type) {
            case 'main':
                icon = mainOfficeIcon;
                markerColor = 'blue';
                break;
            case 'branch':
                icon = branchOfficeIcon;
                markerColor = 'green';
                break;
            case 'upt':
                icon = uptOfficeIcon;
                markerColor = 'orange';
                break;
        }

        const marker = L.marker([office.lat, office.lng], { icon: icon }).addTo(map);
        
        const popupContent = `
            <div class="p-3 min-w-64">
                <h4 class="font-bold text-${markerColor}-600 mb-2">${office.name}</h4>
                <div class="space-y-1 text-sm">
                    <div class="flex items-start">
                        <i class="fas fa-map-marker-alt text-gray-500 mr-2 mt-1"></i>
                        <span>${office.address}</span>
                    </div>
                    ${office.phone !== '-' ? `
                    <div class="flex items-center">
                        <i class="fas fa-phone text-gray-500 mr-2"></i>
                        <span>${office.phone}</span>
                    </div>
                    ` : ''}
                    <div class="mt-2 text-xs text-gray-600">
                        ${office.type === 'main' ? 'Kantor Pusat DKP Jawa Timur' : 
                          office.type === 'branch' ? 'Cabang Dinas' : 
                          'Unit Pelaksana Teknis'}
                    </div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });

    // Add custom CSS for markers
    const style = document.createElement('style');
    style.textContent = `
        .custom-div-icon {
            background: white;
            border: 2px solid #ddd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
}

// Load East Java GeoJSON data
function loadJatimGeoJSON(map) {
    fetch("data/jawa-timur-simplified-topo.json")
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function(feature) {
                    return {
                        fillColor: getColor(getTotalFiles(feature.properties.files)),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function(feature, layer) {
                    const files = feature.properties.files || { tangkap: 0, budidaya: 0, kpp: 0, pengolahan: 0, ekspor: 0 };
                    const total = getTotalFiles(files);
                    
                    let popupContent = `
                        <div class="p-4">
                            <h3 class="font-bold text-lg mb-2">${feature.properties.name}</h3>
                            <div class="space-y-1">
                                <div class="flex justify-between">
                                    <span>Perikanan Tangkap:</span>
                                    <span class="font-semibold">${files.tangkap}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Perikanan Budidaya:</span>
                                    <span class="font-semibold">${files.budidaya}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>KPP:</span>
                                    <span class="font-semibold">${files.kpp}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Pengolahan & Pemasaran:</span>
                                    <span class="font-semibold">${files.pengolahan}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Ekspor Perikanan:</span>
                                    <span class="font-semibold">${files.ekspor}</span>
                                </div>
                                <hr class="my-2">
                                <div class="flex justify-between font-bold">
                                    <span>Total File:</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                            ${total === 0 ? '<p class="text-sm text-gray-500 mt-2">Belum ada data untuk kabupaten ini.</p>' : ''}
                        </div>
                    `;
                    
                    layer.bindPopup(popupContent);
                    
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight
                    });
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error loading the GeoJSON data:', error);
        });
}

// Get color based on file count
function getColor(count) {
    return count > 50 ? '#800026' :
           count > 20 ? '#BD0026' :
           count > 10 ? '#E31A1C' :
           count > 5  ? '#FC4E2A' :
           count > 2  ? '#FD8D3C' :
           count > 0  ? '#FEB24C' :
                        '#FFEDA0';
}

// Get total files count
function getTotalFiles(files) {
    return files.tangkap + files.budidaya + files.kpp + files.pengolahan + files.ekspor;
}

// Highlight feature on hover
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
    });
    layer.bringToFront();
}

// Reset highlight
function resetHighlight(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    });
}

// Load statistics for dashboard cards
function loadStatistics() {
    // In a real application, this would fetch from API
    // For now, showing 0 with motivational text as per requirements
    
    const stats = {
        tangkap: 0,
        budidaya: 0,
        kpp: 0,
        pengolahan: 0,
        ekspor: 0
    };
    
    // Update card counts
    document.getElementById('tangkap-count').textContent = stats.tangkap;
    document.getElementById('budidaya-count').textContent = stats.budidaya;
    document.getElementById('kpp-count').textContent = stats.kpp;
    document.getElementById('pengolahan-count').textContent = stats.pengolahan;
    document.getElementById('ekspor-count').textContent = stats.ekspor;
}

// Setup event listeners
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Search functionality (placeholder)
function searchFiles(query) {
    console.log('Searching for:', query);
    // Implementation would go here
}

// File upload functionality (placeholder)
function uploadFile(file, metadata) {
    console.log('Uploading file:', file.name, 'with metadata:', metadata);
    // Implementation would go here
}

// Animation classes (to be added via CSS)
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
    }
`;
document.head.appendChild(style);

