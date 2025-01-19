// Member Registration System

document.addEventListener('DOMContentLoaded', function() {
    initializeMemberSystem();
});

function initializeMemberSystem() {
    setupRegistrationForm();
    setupLoginForm();
    setupProfileForm();
    setupMemberDashboard();
}

/**
 * Registration Form
 */
function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', handleRegistration);
}

async function handleRegistration(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateRegistrationForm(data)) return;

    try {
        // This will be replaced with actual API call
        console.log('Member registration:', data);
        showNotification('Registration successful! Please check your email to verify your account.', 'success');
        form.reset();
        
        // Save member data
        saveMemberData(data);
        
        // Show welcome modal
        showWelcomeModal();
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Error during registration. Please try again.', 'error');
    }
}

function validateRegistrationForm(data) {
    const errors = [];
    
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!isValidEmail(data.email)) errors.push('Valid email is required');
    if (!isValidPhone(data.phone)) errors.push('Valid phone number is required');
    if (!isStrongPassword(data.password)) errors.push('Password must be at least 8 characters with numbers and special characters');
    if (data.password !== data.confirmPassword) errors.push('Passwords do not match');

    if (errors.length > 0) {
        showNotification(errors.join('\\n'), 'error');
        return false;
    }
    return true;
}

/**
 * Login Form
 */
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateLoginForm(data)) return;

    try {
        // This will be replaced with actual API call
        console.log('Member login:', data);
        const memberData = getMemberData(data.email);
        if (memberData) {
            showNotification('Login successful!', 'success');
            form.reset();
            
            // Update session
            updateSession(memberData);
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            showNotification('Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Error during login. Please try again.', 'error');
    }
}

function validateLoginForm(data) {
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email', 'error');
        return false;
    }
    if (!data.password?.trim()) {
        showNotification('Please enter your password', 'error');
        return false;
    }
    return true;
}

/**
 * Profile Management
 */
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    // Load profile data
    loadProfileData();

    form.addEventListener('submit', handleProfileUpdate);
}

function loadProfileData() {
    const memberData = getCurrentMember();
    if (!memberData) return;

    const form = document.getElementById('profileForm');
    if (!form) return;

    // Populate form fields
    Object.entries(memberData).forEach(([key, value]) => {
        const input = form.elements[key];
        if (input) input.value = value;
    });
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateProfileForm(data)) return;

    try {
        // This will be replaced with actual API call
        console.log('Profile update:', data);
        showNotification('Profile updated successfully!', 'success');
        
        // Update stored data
        updateMemberData(data);
    } catch (error) {
        console.error('Profile update error:', error);
        showNotification('Error updating profile. Please try again.', 'error');
    }
}

function validateProfileForm(data) {
    const errors = [];
    
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!isValidPhone(data.phone)) errors.push('Valid phone number is required');
    if (data.currentPassword && !isStrongPassword(data.newPassword)) {
        errors.push('New password must be at least 8 characters with numbers and special characters');
    }

    if (errors.length > 0) {
        showNotification(errors.join('\\n'), 'error');
        return false;
    }
    return true;
}

/**
 * Member Dashboard
 */
function setupMemberDashboard() {
    if (!document.getElementById('memberDashboard')) return;

    loadDashboardData();
    setupEventRegistration();
    setupResourceDownloads();
}

function loadDashboardData() {
    const memberData = getCurrentMember();
    if (!memberData) {
        window.location.href = '/login';
        return;
    }

    // Update dashboard elements
    updateWelcomeMessage(memberData);
    loadMemberEvents();
    loadMemberResources();
    loadMemberContributions();
}

function updateWelcomeMessage(memberData) {
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${memberData.firstName}!`;
    }
}

/**
 * Data Management
 */
function saveMemberData(data) {
    const members = getStoredMembers();
    members[data.email] = {
        ...data,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    localStorage.setItem('members', JSON.stringify(members));
}

function updateMemberData(data) {
    const members = getStoredMembers();
    const currentMember = getCurrentMember();
    if (!currentMember) return;

    members[currentMember.email] = {
        ...members[currentMember.email],
        ...data,
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem('members', JSON.stringify(members));
}

function getMemberData(email) {
    const members = getStoredMembers();
    return members[email];
}

function getCurrentMember() {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    return session.member;
}

function getStoredMembers() {
    return JSON.parse(localStorage.getItem('members') || '{}');
}

function updateSession(memberData) {
    const session = {
        member: memberData,
        token: generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem('session', JSON.stringify(session));
}

/**
 * Utility Functions
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

function generateToken() {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showWelcomeModal() {
    const modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    modal.show();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateRegistrationForm,
        validateLoginForm,
        validateProfileForm,
        isValidEmail,
        isValidPhone,
        isStrongPassword
    };
}
