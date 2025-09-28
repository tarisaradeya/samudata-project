// Pengaturan Akun JavaScript
const API_BASE_URL = './api';

document.addEventListener('DOMContentLoaded', function() {
    initializePengaturanAkun();
    setupSidebar();
    setupEventListeners();
    loadUserData();
});

function initializePengaturanAkun() {
    // Initialize any required components
    console.log('Pengaturan Akun initialized');
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
    // Profile form submission
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });
    
    // Security form submission
    document.getElementById('security-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updatePassword();
    });
    
    // Preferences form submission
    document.getElementById('preferences-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updatePreferences();
    });
    
    // Delete account button
    document.getElementById('delete-account-btn').addEventListener('click', function() {
        confirmDeleteAccount();
    });
    
    // Password validation
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    
    confirmPassword.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    newPassword.addEventListener('input', function() {
        validatePasswordStrength();
        validatePasswordMatch();
    });
}

function loadUserData() {
    // In a real application, this would fetch user data from API
    // For now, we'll use placeholder data
    const userData = {
        full_name: 'Admin User',
        email: 'admin@samudata.com',
        phone: '+62 812-3456-7890',
        department: 'admin',
        bio: 'Administrator sistem Samudata untuk DKP Jawa Timur',
        preferences: {
            email_notifications: true,
            auto_refresh: true,
            items_per_page: 25,
            default_view: 'list'
        }
    };
    
    populateUserData(userData);
}

function populateUserData(userData) {
    // Populate profile form
    document.getElementById('full-name').value = userData.full_name || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('department').value = userData.department || '';
    document.getElementById('bio').value = userData.bio || '';
    
    // Populate preferences
    if (userData.preferences) {
        document.getElementById('email-notifications').checked = userData.preferences.email_notifications;
        document.getElementById('auto-refresh').checked = userData.preferences.auto_refresh;
        document.getElementById('items-per-page').value = userData.preferences.items_per_page;
        document.getElementById('default-view').value = userData.preferences.default_view;
    }
}

function updateProfile() {
    const formData = new FormData(document.getElementById('profile-form'));
    formData.append('action', 'update_profile');
    
    // Show loading state
    const submitBtn = document.querySelector('#profile-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Profil berhasil diperbarui', 'success');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
    
    // In a real application, you would make an API call here:
    /*
    fetch(`${API_BASE_URL}/user.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Profil berhasil diperbarui', 'success');
        } else {
            showNotification('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showNotification('Terjadi kesalahan saat memperbarui profil', 'error');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
    */
}

function updatePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    if (!currentPassword) {
        showNotification('Password saat ini harus diisi', 'error');
        return;
    }
    
    if (!newPassword) {
        showNotification('Password baru harus diisi', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Konfirmasi password tidak cocok', 'error');
        return;
    }
    
    if (!isPasswordStrong(newPassword)) {
        showNotification('Password baru tidak memenuhi kriteria keamanan', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'update_password');
    formData.append('current_password', currentPassword);
    formData.append('new_password', newPassword);
    
    // Show loading state
    const submitBtn = document.querySelector('#security-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengubah...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Password berhasil diubah', 'success');
        document.getElementById('security-form').reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
    
    // In a real application, you would make an API call here
}

function updatePreferences() {
    const formData = new FormData();
    formData.append('action', 'update_preferences');
    formData.append('email_notifications', document.getElementById('email-notifications').checked);
    formData.append('auto_refresh', document.getElementById('auto-refresh').checked);
    formData.append('items_per_page', document.getElementById('items-per-page').value);
    formData.append('default_view', document.getElementById('default-view').value);
    
    // Show loading state
    const submitBtn = document.querySelector('#preferences-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Preferensi berhasil disimpan', 'success');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Apply preferences immediately
        applyPreferences();
    }, 1000);
}

function applyPreferences() {
    // Apply auto-refresh setting
    const autoRefresh = document.getElementById('auto-refresh').checked;
    if (autoRefresh) {
        // Enable auto-refresh for other pages
        localStorage.setItem('auto_refresh', 'true');
    } else {
        localStorage.setItem('auto_refresh', 'false');
    }
    
    // Apply other preferences
    localStorage.setItem('items_per_page', document.getElementById('items-per-page').value);
    localStorage.setItem('default_view', document.getElementById('default-view').value);
}

function validatePasswordStrength() {
    const password = document.getElementById('new-password').value;
    const isStrong = isPasswordStrong(password);
    
    // You could add visual feedback here
    if (password && !isStrong) {
        document.getElementById('new-password').classList.add('border-red-500');
    } else {
        document.getElementById('new-password').classList.remove('border-red-500');
    }
}

function validatePasswordMatch() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (confirmPassword && newPassword !== confirmPassword) {
        document.getElementById('confirm-password').classList.add('border-red-500');
    } else {
        document.getElementById('confirm-password').classList.remove('border-red-500');
    }
}

function isPasswordStrong(password) {
    // Check if password meets security criteria
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

function confirmDeleteAccount() {
    const confirmation = confirm(
        'PERINGATAN: Tindakan ini akan menghapus akun Anda secara permanen beserta semua data yang terkait. ' +
        'Tindakan ini tidak dapat dibatalkan.\n\n' +
        'Apakah Anda yakin ingin melanjutkan?'
    );
    
    if (confirmation) {
        const secondConfirmation = prompt(
            'Untuk mengkonfirmasi penghapusan akun, ketik "HAPUS AKUN" (tanpa tanda kutip):'
        );
        
        if (secondConfirmation === 'HAPUS AKUN') {
            deleteAccount();
        } else {
            showNotification('Konfirmasi tidak sesuai. Penghapusan akun dibatalkan.', 'info');
        }
    }
}

function deleteAccount() {
    // Show loading state
    const deleteBtn = document.getElementById('delete-account-btn');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menghapus...';
    deleteBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Akun berhasil dihapus. Anda akan dialihkan ke halaman login.', 'success');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
    
    // In a real application, you would make an API call here
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
    }, 5000);
}

// Auto-save preferences on change
document.addEventListener('change', function(e) {
    if (e.target.closest('#preferences-form')) {
        // Auto-save preferences when changed
        setTimeout(updatePreferences, 500);
    }
});

