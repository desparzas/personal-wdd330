const api = TMDbAPI;
const db = new MovieMateDB();

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

// Setup UI handlers (search, user menu, etc.)
function setupUIHandlers() {
    // Search functionality
    const searchForm = document.querySelector('.search-bar');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = searchForm.querySelector('input').value.trim();
        if (searchQuery) {
            window.location.href = `search.html?query=${encodeURIComponent(searchQuery)}`;
        }
    });

    // User menu toggle
    const userIcon = document.querySelector('.user-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userIcon && dropdownMenu) {
        userIcon.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userIcon.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }
}

async function loadMediaDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('id');
    const mediaType = urlParams.get('type');

    if (!mediaId || !mediaType) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const details = await api.getMediaDetails(mediaType, mediaId);
        updateDetailsUI(details, mediaType);
    } catch (error) {
        console.error('Error loading media details:', error);
    }
}

function updateDetailsUI(media, mediaType) {
    // Update backdrop
    const backdropPath = media.backdrop_path;
    const backdrop = document.querySelector('.details-backdrop');
    backdrop.style.backgroundImage = `url(${api.getImageUrl(backdropPath, 'original')})`;
    backdrop.style.backgroundSize = 'cover';
    backdrop.style.backgroundPosition = 'center';

    // Update poster
    const posterImg = document.querySelector('.details-poster img');
    posterImg.src = api.getImageUrl(media.poster_path);
    posterImg.alt = media.title || media.name;

    // Update title and meta information
    document.querySelector('.details-title').textContent = media.title || media.name;
    document.querySelector('.release-date').textContent = 
        new Date(media.release_date || media.first_air_date).getFullYear();
    document.querySelector('.runtime').textContent = 
        media.runtime ? `${media.runtime} min` : `${media.episode_run_time[0]} min`;
    document.querySelector('.rating span').textContent = 
        media.vote_average.toFixed(1);

    // Update genres
    const genresContainer = document.querySelector('.genres');
    genresContainer.innerHTML = media.genres
        .map(genre => `<span class="genre-tag">${genre.name}</span>`)
        .join('');

    // Update overview
    document.querySelector('.details-overview p').textContent = media.overview;

    // Update cast
    if (media.credits && media.credits.cast) {
        const castGrid = document.querySelector('.cast-grid');
        castGrid.innerHTML = media.credits.cast
            .slice(0, 6)
            .map(person => `
                <div class="cast-card">
                    <div class="cast-photo">
                        <img src="${api.getImageUrl(person.profile_path)}" 
                             alt="${person.name}">
                    </div>
                    <div class="cast-info">
                        <div class="cast-name">${person.name}</div>
                        <div class="cast-character">${person.character}</div>
                    </div>
                </div>
            `).join('');
    }

    // Update similar content
    if (media.similar && media.similar.results) {
        const similarSlider = document.querySelector('.media-slider');
        similarSlider.innerHTML = media.similar.results
            .slice(0, 10)
            .map(item => {
                const title = item.title || item.name;
                const year = (item.release_date || item.first_air_date || '').split('-')[0];
                return `
                    <div class="media-card" onclick="window.location.href='details.html?id=${item.id}&type=${mediaType}'">
                        <div class="media-poster">
                            <img src="${api.getImageUrl(item.poster_path)}" alt="${title}">
                        </div>
                        <div class="media-info">
                            <h3 class="media-title">${title}</h3>
                            <p class="media-date">${year}</p>
                        </div>
                    </div>
                `;
            }).join('');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await db.init();
    loadMediaDetails();
    setupThemeToggle();
    setupUIHandlers();
});