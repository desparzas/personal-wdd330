const api = TMDbAPI;
const db = new MovieMateDB();

let currentPage = 1;
let currentQuery = '';
let currentType = 'all';
let isLoading = false;

async function performSearch(query, type, page = 1) {
    try {
        const results = await api.searchMedia(query, type, page);
        return results;
    } catch (error) {
        console.error('Search error:', error);
        return { results: [], total_pages: 0 };
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
    
    if (currentQuery) {
        document.querySelector('.search-title').textContent = `Results for "${currentQuery}"`;
        const results = await performSearch(currentQuery, currentType);
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
        displayResults(results.results);
        
        isLoading = false;
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await db.init();
    initializeSearch();
    setupUIHandlers();
    setupThemeToggle();
});