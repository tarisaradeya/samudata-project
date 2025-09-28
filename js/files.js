// File Manager JavaScript
const API_BASE_URL = './api';

document.addEventListener('DOMContentLoaded', function() {
    initializeFileManager();
    setupSidebar();
    setupUploadModal();
    loadCategories();
    loadRegions();
});

function initializeFileManager() {
    // Load files from API
    loadFiles();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize DataTable (if files exist)
    initializeDataTable();
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

function loadFiles() {
    fetch(`${API_BASE_URL}/files.php?action=list`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.data.length === 0) {
                    showEmptyState();
                } else {
                    showFileTable(data.data);
                }
            } else {
                console.error('Error loading files:', data.message);
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading files:', error);
            showEmptyState();
        });
}

function showEmptyState() {
    document.getElementById('empty-state').classList.remove('hidden');
    document.getElementById('file-table-container').classList.add('hidden');
}

function showFileTable(files) {
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('file-table-container').classList.remove('hidden');
    
    // Populate table with files
    populateFileTable(files);
}

function populateFileTable(files) {
    const tbody = document.querySelector('#files-table tbody');
    tbody.innerHTML = '';
    
    files.forEach(file => {
        const row = createFileRow(file);
        tbody.appendChild(row);
    });
    
    // Initialize or reinitialize DataTable
    if ($.fn.DataTable.isDataTable('#files-table')) {
        $('#files-table').DataTable().destroy();
    }
    
    $('#files-table').DataTable({
        responsive: true,
        pageLength: 25,
        order: [[5, 'desc']], // Sort by upload date descending
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
        }
    });
}

function createFileRow(file) {
    const row = document.createElement('tr');
    row.className = 'file-item';
    
    const favoriteIcon = file.is_favorite ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400';
    const formattedSize = formatFileSize(file.size);
    const formattedDate = formatDate(file.upload_date);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-file text-blue-600"></i>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">${file.title}</div>
                    <div class="text-sm text-gray-500">${file.filename}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
            ${file.description.substring(0, 100)}${file.description.length > 100 ? '...' : ''}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formattedSize}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${file.category}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${file.uploader}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
                <button onclick="downloadFile(${file.id})" class="text-blue-600 hover:text-blue-900" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="toggleFavorite(${file.id})" class="hover:text-red-600" title="Favorit">
                    <i class="${favoriteIcon}"></i>
                </button>
                <button onclick="archiveFile(${file.id})" class="text-yellow-600 hover:text-yellow-900" title="Arsip">
                    <i class="fas fa-archive"></i>
                </button>
                <button onclick="editFile(${file.id})" class="text-green-600 hover:text-green-900" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteFile(${file.id})" class="text-red-600 hover:text-red-900" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}
    });
}

function createFileRow(file) {
    const row = document.createElement('tr');
    row.className = 'file-item hover:bg-gray-50';
    
    const fileExtension = file.filename.split('.').pop().toLowerCase();
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i class="fas fa-file-${getFileIcon(fileExtension)} text-blue-600"></i>
                </div>
                <div>
                    <div class="text-sm font-medium text-gray-900">${file.title}</div>
                    <div class="text-sm text-gray-500">${file.description || 'Tidak ada deskripsi'}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getBidangColor(file.category.toLowerCase())}-100 text-${getBidangColor(file.category.toLowerCase())}-800">
                ${file.category}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${file.region}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatFileSize(file.size)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(file.created_at)}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Aktif
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center space-x-2">
                <button class="text-blue-600 hover:text-blue-900" onclick="downloadFile('${file.id}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="text-yellow-600 hover:text-yellow-900" onclick="toggleFavorite('${file.id}')">
                    <i class="fas fa-star${file.is_favorite ? '' : '-o'}"></i>
                </button>
                <button class="text-gray-600 hover:text-gray-900" onclick="viewFileDetails('${file.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="text-red-600 hover:text-red-900" onclick="archiveFile('${file.id}')">
                    <i class="fas fa-archive"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function initializeDataTable() {
    // Initialize DataTables if table exists and has data
    const table = document.getElementById('files-table');
    if (table && !document.getElementById('empty-state').classList.contains('hidden')) {
        return;
    }
    
    // DataTables configuration would go here
    // Currently not initialized since no data exists
}

function setupEventListeners() {
    // Upload buttons
    const uploadBtn = document.getElementById('upload-file-btn');
    const uploadEmptyBtn = document.getElementById('upload-file-empty-btn');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            showUploadModal();
        });
    }
    
    if (uploadEmptyBtn) {
        uploadEmptyBtn.addEventListener('click', function() {
            showUploadModal();
        });
    }
    
    // View toggle buttons
    const gridView = document.getElementById('grid-view');
    const listView = document.getElementById('list-view');
    
    if (gridView) {
        gridView.addEventListener('click', function() {
            // Switch to grid view
            gridView.classList.add('text-blue-600');
            gridView.classList.remove('text-gray-400');
            listView.classList.add('text-gray-400');
            listView.classList.remove('text-blue-600');
        });
    }
    
    if (listView) {
        listView.addEventListener('click', function() {
            // Switch to list view
            listView.classList.add('text-blue-600');
            listView.classList.remove('text-gray-400');
            gridView.classList.add('text-gray-400');
            gridView.classList.remove('text-blue-600');
        });
    }
    
    // Search and filter inputs
    const searchInput = document.getElementById('search-input');
    const bidangFilter = document.getElementById('bidang-filter');
    const kabupatenFilter = document.getElementById('kabupaten-filter');
    const statusFilter = document.getElementById('status-filter');
    
    [searchInput, bidangFilter, kabupatenFilter, statusFilter].forEach(element => {
        if (element) {
            element.addEventListener('change', function() {
                filterFiles();
            });
            element.addEventListener('keyup', function() {
                if (element === searchInput) {
                    filterFiles();
                }
            });
        }
    });
}

function setupUploadModal() {
    const modal = document.getElementById('upload-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelUpload = document.getElementById('cancel-upload');
    const uploadForm = document.getElementById('upload-form');
    
    // Close modal events
    [closeModal, cancelUpload].forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                hideUploadModal();
            });
        }
    });
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideUploadModal();
            }
        });
    }
    
    // Handle form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFileUpload();
        });
    }
}

function showUploadModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideUploadModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('upload-form');
        if (form) {
            form.reset();
        }
    }
}

function handleFileUpload() {
    // Get form data
    const fileInput = document.getElementById('file-input');
    const title = document.getElementById('file-title').value;
    const description = document.getElementById('file-description').value;
    const bidang = document.getElementById('file-bidang').value;
    const kabupaten = document.getElementById('file-kabupaten').value;
    const year = document.getElementById('file-year').value;
    const month = document.getElementById('file-month').value;
    const uploaderName = document.getElementById('uploader-name').value || 'Anonymous';
    const uploaderEmail = document.getElementById('uploader-email').value || '';
    
    // Validate required fields
    if (!fileInput.files[0] || !title || !bidang || !kabupaten) {
        alert('Mohon lengkapi semua field yang wajib diisi');
        return;
    }
    
    // Validate file type
    const file = fileInput.files[0];
    const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        alert('Format file tidak didukung. Gunakan: PDF, DOC, DOCX, XLS, XLSX, ZIP, JPG, JPEG, PNG');
        return;
    }
    
    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
        alert('Ukuran file maksimal 50MB');
        return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', bidang);
    formData.append('region_id', kabupaten);
    formData.append('uploader_name', uploaderName);
    formData.append('uploader_email', uploaderEmail);
    formData.append('upload_date', `${year}-${month.padStart(2, '0')}-01`);
    formData.append('tags', '');
    
    // Show loading state
    const submitButton = document.querySelector('#upload-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Mengunggah...';
    submitButton.disabled = true;
    
    // Upload file via API
    fetch(`${API_BASE_URL}/upload.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('File berhasil diunggah!');
            hideUploadModal();
            loadFiles(); // Reload file list
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        alert('Terjadi kesalahan saat mengunggah file');
    })
    .finally(() => {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

function loadCategories() {
    fetch(`${API_BASE_URL}/files.php?action=categories`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const categorySelect = document.getElementById('file-bidang');
                const filterSelect = document.getElementById('bidang-filter');
                
                if (categorySelect) {
                    categorySelect.innerHTML = '<option value="">Pilih Bidang</option>';
                    data.data.forEach(category => {
                        categorySelect.innerHTML += `<option value="${category.id}">${category.display_name}</option>`;
                    });
                }
                
                if (filterSelect) {
                    filterSelect.innerHTML = '<option value="">Semua Bidang</option>';
                    data.data.forEach(category => {
                        filterSelect.innerHTML += `<option value="${category.name}">${category.display_name}</option>`;
                    });
                }
            }
        })
        .catch(error => console.error('Error loading categories:', error));
}

function loadRegions() {
    fetch(`${API_BASE_URL}/files.php?action=regions`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const regionSelect = document.getElementById('file-kabupaten');
                const filterSelect = document.getElementById('kabupaten-filter');
                
                if (regionSelect) {
                    regionSelect.innerHTML = '<option value="">Pilih Kabupaten/Kota</option>';
                    data.data.forEach(region => {
                        regionSelect.innerHTML += `<option value="${region.id}">${region.name}</option>`;
                    });
                }
                
                if (filterSelect) {
                    filterSelect.innerHTML = '<option value="">Semua Wilayah</option>';
                    data.data.forEach(region => {
                        filterSelect.innerHTML += `<option value="${region.id}">${region.name}</option>`;
                    });
                }
            }
        })
        .catch(error => console.error('Error loading regions:', error));
}

function filterFiles() {
    // Get filter values
    const search = document.getElementById('search-input').value;
    const bidang = document.getElementById('bidang-filter').value;
    const kabupaten = document.getElementById('kabupaten-filter').value;
    const status = document.getElementById('status-filter').value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (bidang) params.append('category', bidang);
    if (kabupaten) params.append('region', kabupaten);
    
    // Fetch filtered files
    fetch(`${API_BASE_URL}/files.php?action=list&${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.data.length === 0) {
                    showEmptyState();
                } else {
                    showFileTable(data.data);
                }
            }
        })
        .catch(error => console.error('Error filtering files:', error));
}

// File action functions
function downloadFile(fileId) {
    // Open download URL in new window/tab
    window.open(`${API_BASE_URL}/download.php?id=${fileId}`, '_blank');
}

function toggleFavorite(fileId) {
    console.log('Toggling favorite for file:', fileId);
    // In a real application, this would toggle favorite status
}

function viewFileDetails(fileId) {
    console.log('Viewing file details:', fileId);
    // In a real application, this would show file details modal
}

function archiveFile(fileId) {
    if (confirm('Apakah Anda yakin ingin mengarsipkan file ini?')) {
        console.log('Archiving file:', fileId);
        // In a real application, this would archive the file
    }
}

// Utility functions
function getFileIcon(type) {
    const icons = {
        'pdf': 'pdf',
        'doc': 'word',
        'docx': 'word',
        'xls': 'excel',
        'xlsx': 'excel',
        'zip': 'archive',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image'
    };
    return icons[type] || 'file';
}

function getBidangColor(bidang) {
    const colors = {
        'tangkap': 'blue',
        'budidaya': 'green',
        'kpp': 'cyan',
        'pengolahan': 'orange',
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
}



// File action functions
function downloadFile(fileId) {
    fetch(`${API_BASE_URL}/files.php?action=download&id=${fileId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Create download link
                const link = document.createElement('a');
                link.href = data.file_path;
                link.download = data.original_filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('File berhasil didownload', 'success');
                loadFiles(); // Refresh to update download count
            } else {
                showNotification('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            showNotification('Terjadi kesalahan saat mendownload file', 'error');
        });
}

function toggleFavorite(fileId) {
    const formData = new FormData();
    formData.append('action', 'favorite');
    formData.append('file_id', fileId);
    
    fetch(`${API_BASE_URL}/files.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Status favorit berhasil diperbarui', 'success');
            loadFiles(); // Refresh to update favorite status
        } else {
            showNotification('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error toggling favorite:', error);
        showNotification('Terjadi kesalahan saat memperbarui favorit', 'error');
    });
}

function archiveFile(fileId) {
    if (confirm('Apakah Anda yakin ingin mengarsipkan file ini?')) {
        const formData = new FormData();
        formData.append('action', 'archive');
        formData.append('file_id', fileId);
        
        fetch(`${API_BASE_URL}/files.php`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('File berhasil diarsipkan', 'success');
                loadFiles(); // Refresh file list
            } else {
                showNotification('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error archiving file:', error);
            showNotification('Terjadi kesalahan saat mengarsipkan file', 'error');
        });
    }
}

function editFile(fileId) {
    // Get current file data first
    fetch(`${API_BASE_URL}/files.php?action=list`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const file = data.data.find(f => f.id == fileId);
                if (file) {
                    showEditModal(file);
                }
            }
        })
        .catch(error => {
            console.error('Error getting file data:', error);
        });
}

function deleteFile(fileId) {
    if (confirm('Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan.')) {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('file_id', fileId);
        
        fetch(`${API_BASE_URL}/files.php`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('File berhasil dihapus', 'success');
                loadFiles(); // Refresh file list
            } else {
                showNotification('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting file:', error);
            showNotification('Terjadi kesalahan saat menghapus file', 'error');
        });
    }
}

function showEditModal(file) {
    // Create edit modal HTML
    const modalHTML = `
        <div id="edit-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">Edit File</h3>
                            <button onclick="closeEditModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <form id="edit-form" class="p-6">
                        <div class="mb-4">
                            <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                            <input type="text" id="edit-title" name="title" value="${file.title}" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div class="mb-4">
                            <label for="edit-description" class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                            <textarea id="edit-description" name="description" rows="3" 
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${file.description}</textarea>
                        </div>
                        
                        <div class="mb-6">
                            <label for="edit-tags" class="block text-sm font-medium text-gray-700 mb-2">Tags (pisahkan dengan koma)</label>
                            <input type="text" id="edit-tags" name="tags" value="${file.tags ? file.tags.join(', ') : ''}" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div class="flex justify-end space-x-4">
                            <button type="button" onclick="closeEditModal()" class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">
                                Batal
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup form submission
    document.getElementById('edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitEditForm(file.id);
    });
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.remove();
    }
}

function submitEditForm(fileId) {
    const formData = new FormData();
    formData.append('action', 'edit');
    formData.append('file_id', fileId);
    formData.append('title', document.getElementById('edit-title').value);
    formData.append('description', document.getElementById('edit-description').value);
    formData.append('tags', document.getElementById('edit-tags').value);
    
    fetch(`${API_BASE_URL}/files.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('File berhasil diperbarui', 'success');
            closeEditModal();
            loadFiles(); // Refresh file list
        } else {
            showNotification('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error updating file:', error);
        showNotification('Terjadi kesalahan saat memperbarui file', 'error');
    });
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

