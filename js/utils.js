class UIManager {
    static setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.className = `${currentTheme}-mode`;
        themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';

        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            
            document.body.className = `${newTheme}-mode`;
            themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            localStorage.setItem('theme', newTheme);
        });
    }

    static setupUIHandlers() {
        this.setupSearch();
        this.setupUserMenu();
    }

    static setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        searchButton.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });
    }

    static performSearch(query) {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            window.location.href = `search.html?query=${encodeURIComponent(trimmedQuery)}`;
        }
    }

    static setupUserMenu() {
        const userIcon = document.querySelector('.user-icon');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (userIcon && dropdownMenu) {
            userIcon.addEventListener('click', () => {
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            });

            document.addEventListener('click', (e) => {
                if (!userIcon.contains(e.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }
    }

    static init() {
        this.setupThemeToggle();
        this.setupUIHandlers();
    }
}