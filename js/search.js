const api = TMDbAPI;
const db = new MovieMateDB();

let currentPage = 1;
let currentQuery = '';
let currentType = 'all';
let currentGenre = '';
let isLoading = false;

async function performSearch(query, type, page = 1, genre = '') {
    try {
        console.log('Performing search:', query, type, page, genre);
        const results = await api.searchMedia(query, type, page, genre);
        return results;
    } catch (error) {
        console.error('Search error:', error);
        return { results: [], total_pages: 0 };
    }
}

async function loadGenres() {
    try {
        const movieGenres = await api.getGenres2('movie');
        console.log(movieGenres);
        const tvGenres = await api.getGenres2('tv');
        const genres = [...new Set([...movieGenres, ...tvGenres])];
        
        const genreSelect = document.createElement('select');
        genreSelect.className = 'genre-select';
        genreSelect.innerHTML = `
            <option value="">All Genres</option>
            ${genres.map(genre => `
                <option value="${genre.id}">${genre.name}</option>
            `).join('')}
        `;
        
        const filtersContainer = document.querySelector('.search-filters');
        filtersContainer.appendChild(genreSelect);

        genreSelect.addEventListener('change', async () => {
            currentGenre = genreSelect.value;
            currentPage = 1;
            const grid = document.querySelector('.search-grid');
            grid.innerHTML = '';
            const results = await performSearch(currentQuery, currentType, currentPage, currentGenre);
            console.log('Load More Results:', results);

            displayResults(results.results);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

function displayResults(results) {
    const grid = document.querySelector('.search-grid');
    
    results.forEach(item => {
        const mediaType = item.media_type || currentType;
        const card = document.createElement('div');
        card.className = 'media-card';
        
        const title = item.title || item.name;
        const year = (item.release_date || item.first_air_date || '').split('-')[0];
        const posterPath = item.poster_path 
            ? api.getImageUrl(item.poster_path)
            : 'img/no-poster.jpg';

        card.innerHTML = `
            <div class="media-poster">
                <img src="${posterPath}" alt="${title}">
            </div>
            <div class="media-info">
                <h3 class="media-title">${title}</h3>
                <p class="media-date">${year}</p>
                <span class="media-type">${mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `details.html?id=${item.id}&type=${mediaType}`;
        });

        grid.appendChild(card);
    });
}

async function initializeSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    currentQuery = urlParams.get('query') || '';
    currentGenre = urlParams.get('genre') || '';
    currentType = urlParams.get('type') || 'all';
    
    // Update UI based on parameters
    if (currentGenre) {
        document.querySelector('.search-title').textContent = 'Genre Results';
        const genres = await api.getGenres();
        const genreName = genres.find(g => g.id.toString() === currentGenre)?.name;
        if (genreName) {
            document.querySelector('.search-title').textContent = `${genreName} ${currentType === 'tv' ? 'TV Shows' : 'Movies'}`;
        }
    } else if (currentQuery) {
        document.querySelector('.search-title').textContent = `Results for "${currentQuery}"`;
    }

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.type === currentType) {
            btn.classList.add('active');
        }
    });

    // Perform initial search
    const results = await performSearch(currentQuery, currentType, currentPage, currentGenre);
    console.log('Load More Results:', results);
    displayResults(results.results);
}

// Setup filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        if (isLoading) return;
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentType = btn.dataset.type;
        currentPage = 1;
        
        const grid = document.querySelector('.search-grid');
        grid.innerHTML = '';
        
        const results = await performSearch(currentQuery, currentType);
        console.log('Load More Results:', results);
        displayResults(results.results);
    });
});

// Setup load more button
const loadMoreBtn = document.querySelector('.load-more-btn');
loadMoreBtn.addEventListener('click', async () => {
    if (isLoading) return;
    
    isLoading = true;
    currentPage++;
    
    const results = await performSearch(currentQuery, currentType, currentPage);
    console.log('Load More Results:', results);
    displayResults(results.results);
    
    isLoading = false;
});

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check saved theme preference
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

function setupSearchHandler() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await db.init();
    initializeSearch();
    setupThemeToggle();
    setupSearchHandler();
});