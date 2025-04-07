// UI Module
// Handles UI interactions and DOM manipulations

class UI {
    constructor() {
        // Initialize theme
        this.theme = localStorage.getItem('theme') || 'light';
        document.body.className = `${this.theme}-mode`;
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    // Initialize event listeners
    initEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        
        if (themeToggle && themeIcon) {
            // Set initial icon
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // User dropdown
        const userIcon = document.getElementById('user-icon');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userIcon && userDropdown) {
            userIcon.addEventListener('click', () => {
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
        }
        
        // Mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
                }
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
        
        // Modal functionality
        this.initModals();
        
        // Tab functionality
        this.initTabs();
    }
    
    // Toggle theme between light and dark
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.className = `${this.theme}-mode`;
        localStorage.setItem('theme', this.theme);
        
        // Update icon
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Initialize modals
    initModals() {
        // Get all modals
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            // Get close button
            const closeBtn = modal.querySelector('.close-modal');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
            
            // Close when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Edit profile modal
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        const editProfileModal = document.getElementById('edit-profile-modal');
        
        if (editProfileBtn && editProfileModal) {
            editProfileBtn.addEventListener('click', () => {
                editProfileModal.style.display = 'flex';
            });
        }
        
        // Review modal
        const writeReviewBtn = document.getElementById('write-review-btn');
        const reviewModal = document.getElementById('review-modal');
        
        if (writeReviewBtn && reviewModal) {
            writeReviewBtn.addEventListener('click', () => {
                if (!window.auth.isLoggedIn()) {
                    alert('You must be logged in to write a review');
                    return;
                }
                reviewModal.style.display = 'flex';
            });
        }
        
        // Star rating in review modal
        const stars = document.querySelectorAll('.star-rating i');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                
                // Update stars
                stars.forEach(s => {
                    const sRating = parseInt(s.getAttribute('data-rating'));
                    s.className = sRating <= rating ? 'fas fa-star' : 'far fa-star';
                });
                
                // Store rating
                star.closest('form').setAttribute('data-rating', rating);
            });
        });
    }
    
    // Initialize tabs
    initTabs() {
        // Section tabs (e.g., All, Movies, TV Shows)
        const sectionTabs = document.querySelectorAll('.section-tabs .tab');
        
        sectionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                const tabs = tab.parentElement.querySelectorAll('.tab');
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Filter content based on tab
                const type = tab.getAttribute('data-type');
                this.filterContent(type);
            });
        });
        
        // Profile tabs
        const profileTabs = document.querySelectorAll('.profile-tab');
        
        profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                const tabs = tab.parentElement.querySelectorAll('.profile-tab');
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const tabName = tab.getAttribute('data-tab');
                const contents = document.querySelectorAll('.profile-tab-content');
                
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // Media tabs (e.g., Videos, Images)
        const mediaTabs = document.querySelectorAll('.media-tab');
        
        mediaTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                const tabs = tab.parentElement.querySelectorAll('.media-tab');
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const tabName = tab.getAttribute('data-tab');
                const contents = document.querySelectorAll('.media-tab-content');
                
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Filter content based on type (all, movies, tv)
    filterContent(type) {
        // This will be implemented in specific page scripts
        // as it depends on the content being displayed
        if (window.filterMediaByType && typeof window.filterMediaByType === 'function') {
            window.filterMediaByType(type);
        }
    }
    
    // Create media card element
    createMediaCard(media) {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        // Determine media type and title
        const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
        const title = media.title || media.name || 'Unknown Title';
        const year = media.release_date || media.first_air_date || '';
        const yearText = year ? new Date(year).getFullYear() : 'Unknown Year';
        
        // Create poster element
        const posterPath = media.poster_path ? 
            window.api.getImageUrl(media.poster_path) : 
            '/placeholder.svg?height=300&width=200';
        
        card.innerHTML = `
            <div class="media-poster">
                <img src="${posterPath}" alt="${title}">
                <div class="media-rating">
                    <i class="fas fa-star"></i>
                    <span>${media.vote_average ? media.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <div class="media-favorite" data-id="${media.id}" data-type="${mediaType}">
                    <i class="far fa-heart"></i>
                </div>
            </div>
            <div class="media-info">
                <h3 class="media-title">${title}</h3>
                <div class="media-year">${yearText}</div>
            </div>
        `;
        
        // Add click event to card
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on favorite button
            if (e.target.closest('.media-favorite')) {
                return;
            }
            
            window.location.href = `details.html?id=${media.id}&type=${mediaType}`;
        });
        
        // Add favorite functionality
        const favoriteBtn = card.querySelector('.media-favorite');
        
        if (favoriteBtn) {
            // Check if already in favorites
            if (window.auth.isLoggedIn() && window.auth.isInFavorites(media.id, mediaType)) {
                favoriteBtn.classList.add('active');
                favoriteBtn.querySelector('i').className = 'fas fa-heart';
            }
            
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (!window.auth.isLoggedIn()) {
                    alert('You must be logged in to add favorites');
                    return;
                }
                
                const isActive = favoriteBtn.classList.contains('active');
                
                if (isActive) {
                    // Remove from favorites
                    window.auth.removeFromFavorites(media.id, mediaType);
                    favoriteBtn