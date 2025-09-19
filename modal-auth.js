/**
 * Modal Authentication System for Comiflix
 * 
 * This script enhances your existing login modal with full authentication functionality
 * including registration and forgot password features.
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeModalAuth();
});

function initializeModalAuth() {
    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeLogin = document.getElementById('closeLogin');
    
    if (!loginModal) return;
    
    // Enhance the existing modal with additional forms
    enhanceLoginModal();
    
    // Bind event listeners
    bindModalEvents();
}

function enhanceLoginModal() {
    const modalContent = document.querySelector('#loginModal .modal-content');
    if (!modalContent) return;
    
    // Replace the existing modal content with enhanced version
    modalContent.innerHTML = `
        <span class="close" id="closeLogin">&times;</span>
        
        <!-- Modal Navigation Tabs -->
        <div class="modal-tabs">
            <button class="modal-tab active" data-tab="login">Login</button>
            <button class="modal-tab" data-tab="register">Register</button>
            <button class="modal-tab" data-tab="forgot">Forgot Password</button>
        </div>
        
        <!-- Login Form -->
        <div id="loginFormModal" class="modal-form active">
            <h3>Login to Comiflix</h3>
            <div id="loginMessage" class="message-container"></div>
            <form id="modalLoginForm" class="auth-form">
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email" required>
                </div>
                <div class="form-group password-field">
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="button" class="password-toggle" onclick="toggleModalPassword(this)">👁️</button>
                </div>
                <button type="submit" class="modal-btn">Login</button>
            </form>
            <div class="modal-links">
                <a href="#" onclick="switchModalTab('forgot')">Forgot Password?</a>
            </div>
        </div>
        
        <!-- Registration Form -->
        <div id="registerFormModal" class="modal-form">
            <h3>Join Comiflix</h3>
            <div id="registerMessage" class="message-container"></div>
            <form id="modalRegisterForm" class="auth-form">
                <div class="form-group">
                    <input type="text" name="username" placeholder="Username" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email" required>
                </div>
                <div class="form-group password-field">
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="button" class="password-toggle" onclick="toggleModalPassword(this)">👁️</button>
                </div>
                <div class="password-strength">
                    <div class="strength-bar"></div>
                </div>
                <div class="form-group password-field">
                    <input type="password" name="confirm_password" placeholder="Confirm Password" required>
                    <button type="button" class="password-toggle" onclick="toggleModalPassword(this)">👁️</button>
                </div>
                <button type="submit" class="modal-btn">Register</button>
            </form>
        </div>
        
        <!-- Forgot Password Form -->
        <div id="forgotFormModal" class="modal-form">
            <h3>Reset Password</h3>
            <div id="forgotMessage" class="message-container"></div>
            <form id="modalForgotForm" class="auth-form">
                <div class="form-group">
                    <input type="email" name="email" placeholder="Enter your email" required>
                </div>
                <button type="submit" class="modal-btn">Send Reset Link</button>
            </form>
        </div>
    `;
}

function bindModalEvents() {
    // Close modal events
    document.getElementById('closeLogin')?.addEventListener('click', closeModal);
    document.getElementById('loginModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Tab switching
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchModalTab(this.dataset.tab);
        });
    });
    
    // Form submissions
    document.getElementById('modalLoginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('modalRegisterForm')?.addEventListener('submit', handleRegister);
    document.getElementById('modalForgotForm')?.addEventListener('submit', handleForgotPassword);
    
    // Password strength checker
    const registerPassword = document.querySelector('#registerFormModal input[name="password"]');
    if (registerPassword) {
        registerPassword.addEventListener('input', checkPasswordStrength);
    }
    
    // Real-time email validation
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
}

function switchModalTab(tabName) {
    // Remove active classes
    document.querySelectorAll('.modal-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.modal-form').forEach(form => form.classList.remove('active'));
    
    // Add active classes
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}FormModal`)?.classList.add('active');
    
    // Clear messages
    clearModalMessages();
}

function toggleModalPassword(button) {
    const input = button.previousElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

function checkPasswordStrength() {
    const password = this.value;
    const strengthBar = document.querySelector('.strength-bar');
    if (!strengthBar) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-zA-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    strengthBar.className = 'strength-bar';
    if (strength === 1 || strength === 2) {
        strengthBar.classList.add('strength-weak');
    } else if (strength === 3) {
        strengthBar.classList.add('strength-medium');
    } else if (strength === 4) {
        strengthBar.classList.add('strength-strong');
    }
}

function validateEmail() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showModalMessage('loginMessage', result.message, 'success');
            setTimeout(() => {
                window.location.reload(); // Reload to update UI with logged-in state
            }, 1500);
        } else {
            showModalMessage('loginMessage', result.message, 'error');
        }
    } catch (error) {
        showModalMessage('loginMessage', 'An error occurred. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Client-side validation
    if (password !== confirmPassword) {
        showModalMessage('registerMessage', 'Passwords do not match.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showModalMessage('registerMessage', 'Password must be at least 8 characters long.', 'error');
        return;
    }
    
    if (!password.match(/[a-zA-Z]/) || !password.match(/[0-9]/)) {
        showModalMessage('registerMessage', 'Password must contain both letters and numbers.', 'error');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    try {
        const response = await fetch('register.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showModalMessage('registerMessage', result.message, 'success');
            setTimeout(() => {
                switchModalTab('login');
            }, 2000);
        } else {
            showModalMessage('registerMessage', result.message, 'error');
        }
    } catch (error) {
        showModalMessage('registerMessage', 'An error occurred. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        const response = await fetch('forgot_password.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showModalMessage('forgotMessage', result.message, 'success');
            this.reset();
        } else {
            showModalMessage('forgotMessage', result.message, 'error');
        }
    } catch (error) {
        showModalMessage('forgotMessage', 'An error occurred. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
}

function showModalMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

function clearModalMessages() {
    document.querySelectorAll('.message-container').forEach(container => {
        container.innerHTML = '';
    });
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        clearModalMessages();
        // Reset to login tab
        switchModalTab('login');
    }
}

// Function to check if user is logged in and update UI
async function checkAuthStatus() {
    try {
        const response = await fetch('check_auth.php');
        const result = await response.json();
        
        if (result.loggedIn) {
            updateUIForLoggedInUser(result.user);
        }
    } catch (error) {
        console.log('Auth check failed:', error);
    }
}

function updateUIForLoggedInUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && user) {
        loginBtn.textContent = `Hi, ${user.username}`;
        loginBtn.onclick = function() {
            // Show user menu instead of login modal
            showUserMenu(user);
        };
    }
}

function showUserMenu(user) {
    // Create and show user dropdown menu
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="username">${user.username}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
            <div class="menu-divider"></div>
            <a href="dashboard.php" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="#" class="menu-item" onclick="showProfileSettings()">
                <i class="fas fa-user-cog"></i> Profile Settings
            </a>
            <div class="menu-divider"></div>
            <a href="logout.php" class="menu-item logout">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeUserMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeUserMenu);
            }
        });
    }, 100);
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkAuthStatus, 500); // Small delay to ensure DOM is ready
});

// Make functions globally available
window.switchModalTab = switchModalTab;
window.toggleModalPassword = toggleModalPassword;