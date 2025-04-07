// Auth Module
// Since we're only using frontend, we'll simulate authentication with localStorage

// User class
class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // In a real app, this would be hashed
        this.favorites = [];
        this.watchlist = [];
        this.history = [];
        this.reviews = [];
    }
}

// Auth class to handle authentication
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    // Initialize event listeners for auth-related elements
    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const remember = document.getElementById('remember')?.checked || false;
                
                this.login(email, password, remember);
            });
        }
        
        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                this.register(name, email, password);
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Edit profile form
        const editProfileForm = document.getElementById('edit-profile-form');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('edit-name').value;
                const email = document.getElementById('edit-email').value;
                const password = document.getElementById('edit-password').value;
                const confirmPassword = document.getElementById('edit-confirm-password').value;
                
                if (password && password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                this.updateProfile(name, email, password);
            });
        }
        
        // Update UI based on auth state
        this.updateUI();
    }
    
    // Register a new user
    register(name, email, password) {
        // Check if email already exists
        if (this.users.some(user => user.email === email)) {
            alert('Email already registered');
            return false;
        }
        
        // Create new user
        const id = Date.now().toString();
        const newUser = new User(id, name, email, password);
        
        // Add to users array
        this.users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        
        // Log in the new user
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Redirect to home page
        alert('Registration successful!');
        window.location.href = 'index.html';
        
        return true;
    }
    
    // Login user
    login(email, password, remember = false) {
        // Find user by email
        const user = this.users.find(user => user.email === email);
        
        // Check if user exists and password matches
        if (!user || user.password !== password) {
            alert('Invalid email or password');
            return false;
        }
        
        // Set current user
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Redirect to home page
        alert('Login successful!');
        window.location.href = 'index.html';
        
        return true;
    }
    
    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Redirect to home page
        alert('Logged out successfully');
        window.location.href = 'index.html';
        
        return true;
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return !!this.currentUser;
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Update user profile
    updateProfile(name, email, password = '') {
        if (!this.isLoggedIn()) {
            alert('You must be logged in to update your profile');
            return false;
        }
        
        // Find user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        
        if (userIndex === -1) {
            alert('User not found');
            return false;
        }
        
        // Update user data
        this.users[userIndex].name = name;
        this.users[userIndex].email = email;
        
        if (password) {
            this.users[userIndex].password = password;
        }
        
        // Update current user
        this.currentUser = this.users[userIndex];
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        alert('Profile updated successfully');
        
        // Refresh page
        window.location.reload();
        
        return true;
    }
    
    // Add media to favorites
    addToFavorites(media) {
        if (!this.isLoggedIn()) {
            alert('You must be logged in to add favorites');
            return false;
        }
        
        // Check if already in favorites
        const exists = this.currentUser.favorites.some(item => 
            item.id === media.id && item.media_type === media.media_type
        );
        
        if (exists) {
            return false;
        }
        
        // Add to favorites
        this.currentUser.favorites.push(media);
        
        // Update user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }
    
    // Remove media from favorites
    removeFromFavorites(mediaId, mediaType) {
        if (!this.isLoggedIn()) {
            return false;
        }
        
        // Filter out the media
        this.currentUser.favorites = this.currentUser.favorites.filter(
            item => !(item.id === mediaId && item.media_type === mediaType)
        );
        
        // Update user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }
    
    // Check if media is in favorites
    isInFavorites(mediaId, mediaType) {
        if (!this.isLoggedIn()) {
            return false;
        }
        
        return this.currentUser.favorites.some(
            item => item.id === mediaId && item.media_type === mediaType
        );
    }
    
    // Add media to watchlist
    addToWatchlist(media) {
        if (!this.isLoggedIn()) {
            alert('You must be logged in to add to watchlist');
            return false;
        }
        
        // Check if already in watchlist
        const exists = this.currentUser.watchlist.some(item => 
            item.id === media.id && item.media_type === media.media_type
        );
        
        if (exists) {
            return false;
        }
        
        // Add to watchlist
        this.currentUser.watchlist.push(media);
        
        // Update user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }
    
    // Remove media from watchlist
    removeFromWatchlist(mediaId, mediaType) {
        if (!this.isLoggedIn()) {
            return false;
        }
        
        // Filter out the media
        this.currentUser.watchlist = this.currentUser.watchlist.filter(
            item => !(item.id === mediaId && item.media_type === mediaType)
        );
        
        // Update user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }
    
    // Add media to watch history
    addToHistory(media) {
        if (!this.isLoggedIn()) {
            return false;
        }
        
        // Add timestamp
        media.watched_at = new Date().toISOString();
        
        // Remove if already in history
        this.currentUser.history = this.currentUser.history.filter(
            item => !(item.id === media.id && item.media_type === media.media_type)
        );
        
        // Add to beginning of history
        this.currentUser.history.unshift(media);
        
        // Update user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }
    
    // Add review
    addReview(mediaId, mediaType, mediaTitle, rating, title, content) {
        if (!this.isLoggedIn()) {
            alert('You must be logged in to add a review');
            return false;
        }
        
        // Create review object
        const review = {
            id: Date.now().toString(),
            media_id: mediaId,
            media_type: mediaType,
            media_title: mediaTitle,
            rating,
            title,
            content,
            created_at: new Date().toISOString()
        };
        
        // Add to reviews
        this.currentUser.reviews.unshift(review);
        
        // Update user in users array
        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }
    
    // Update UI based on auth state
    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userIcon = document.getElementById('user-icon');
        
        if (this.isLoggedIn()) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            // Update profile page if on profile page
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            const favoritesCount = document.getElementById('favorites-count');
            const reviewsCount = document.getElementById('reviews-count');
            
            if (profileName && profileEmail) {
                profileName.textContent = this.currentUser.name;
                profileEmail.textContent = this.currentUser.email;
                favoritesCount.textContent = this.currentUser.favorites.length;
                reviewsCount.textContent = this.currentUser.reviews.length;
            }
            
            // Update edit profile form if it exists
            const editName = document.getElementById('edit-name');
            const editEmail = document.getElementById('edit-email');
            
            if (editName && editEmail) {
                editName.value = this.currentUser.name;
                editEmail.value = this.currentUser.email;
            }
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            
            // Redirect if on profile page
            if (window.location.pathname.includes('profile.html')) {
                window.location.href = 'login.html';
            }
        }
    }
}

// Initialize auth
const auth = new Auth();

// Export auth
window.auth = auth;