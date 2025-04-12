const db = new MovieMateDB();
let api = TMDbAPI;
let currentMediaType = 'all';

function setupTrendingTabs() {
    const tabsContainer = document.querySelector('.section-tabs');
    tabsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('tab')) {
            // Update active tab
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');

            // Get selected media type
            currentMediaType = e.target.dataset.type;

            // Show loading state
            const slider = document.getElementById('trending-slider');
            slider.innerHTML = '<div class="loading-spinner"></div>';

            // Fetch and update content
            try {
                const trending = await api.fetchTrending(currentMediaType);
                updateTrendingSection(trending.results);
            } catch (error) {
                console.error('Error fetching trending content:', error);
                slider.innerHTML = '<p>Error loading content. Please try again later.</p>';
            }
        }
    });
}

function updateTrendingSection(mediaItems) {
    const slider = document.getElementById('trending-slider');
    slider.innerHTML = '';

    mediaItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        const posterPath = item.poster_path;
        const title = item.title || item.name;
        const rating = item.vote_average.toFixed(1);
        const mediaType = item.media_type;

        card.innerHTML = `
            <div class="media-poster">
                <img src="${TMDbAPI.getImageUrl(posterPath)}" alt="${title}">
                <div class="media-overlay">
                    <span class="media-type ${mediaType}">${mediaType.toUpperCase()}</span>
                    <div class="media-rating">
                        <i class="fas fa-star"></i>
                        <span>${rating}</span>
                    </div>
                </div>
            </div>
            <div class="media-info">
                <h3 class="media-title">${title}</h3>
                <p class="media-date">${item.release_date || item.first_air_date || 'No date'}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `details.html?id=${item.id}&type=${mediaType}`;
        });

        slider.appendChild(card);
    });
}

async function updateRecommendationsSection() {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        // Get a mix of popular movies and TV shows
        const [movieData, tvData] = await Promise.all([
            api.getPopularMedia('movie'),
            api.getPopularMedia('tv')
        ]);

        // Combine and shuffle the results
        const combined = [...movieData.results, ...tvData.results]
            .sort(() => Math.random() - 0.5)
            .slice(0, 12); // Limit to 12 items

        grid.innerHTML = '';
        combined.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            
            const posterPath = item.poster_path;
            const title = item.title || item.name;
            const rating = item.vote_average.toFixed(1);
            const mediaType = item.hasOwnProperty('title') ? 'movie' : 'tv';
            const year = (item.release_date || item.first_air_date || '').split('-')[0];

            card.innerHTML = `
                <div class="media-poster">
                    <img src="${TMDbAPI.getImageUrl(posterPath)}" alt="${title}">
                    <div class="media-overlay">
                        <span class="media-type ${mediaType}">${mediaType.toUpperCase()}</span>
                        <div class="media-rating">
                            <i class="fas fa-star"></i>
                            <span>${rating}</span>
                        </div>
                    </div>
                </div>
                <div class="media-info">
                    <h3 class="media-title">${title}</h3>
                    <p class="media-date">${year || 'No date'}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${item.id}&type=${mediaType}`;
            });

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading recommendations:', error);
        grid.innerHTML = '<p>Error loading recommendations. Please try again later.</p>';
    }
}

async function updateCategoriesSection() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const genres = await api.getGenres();
        grid.innerHTML = '';

        // Genre background images (you'll need to add these images to your project)
        const genreImages = {
            Action: 'action.jpg',
            Adventure: 'adventure.jpeg',
            Animation: 'animation.jpeg',
            Comedy: 'comedy.jpeg',
            Crime: 'crime.jpeg',
            Documentary: 'documentary.jpeg',
            Drama: 'drama.jpg',
            Family: 'family.jpg',
            Fantasy: 'fantasy.jpeg',
            History: 'history.jpg',
            Horror: 'horror.jpeg',
            Music: 'music.webp',
            Mystery: 'mystery.jpeg',
            Romance: 'romance.jpg',
            Thriller: 'thriller.jpg',
            War: 'war.webp',
            Kids: 'kids.jpeg',
            News: 'crime.jpeg',
            Reality: 'reality.jpeg',
            Western: 'western.webp',
            "Action & Adventure":'action.jpg',
            "Science Fiction": 'sci fi.jpg',
            "Sci-Fi & Fantasy":'sci fi.jpg',
            "Soap":'music.webp',
            "Talk":'music.webp',
            "War & Politics":'war.webp',
            "TV Movie":'tv-movie.jpg',
        };

        genres.forEach(genre => {
            const card = document.createElement('div');
            card.className = 'category-card';
            
            const imagePath = genreImages[genre.name] || 'default-genre.jpg';

            card.innerHTML = `
                <img src="img/genres/${imagePath}" alt="${genre.name}">
                <div class="category-overlay">
                    <span>${genre.name}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = `search.html?genre=${genre.id}`;
            });

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        grid.innerHTML = '<p>Error loading categories. Please try again later.</p>';
    }
}

// Add this function to handle theme switching
function setupThemeToggle() {
    console.log('Setting up theme toggle...');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${currentTheme}-mode`;
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';

    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        
        // Update body class
        document.body.className = `${newTheme}-mode`;
        
        // Update icon
        themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save preference
        localStorage.setItem('theme', newTheme);
    });
}

async function initializeApp() {
    try {
        await db.init();
        
        // Load all sections
        const [trending] = await Promise.all([
            api.fetchTrending(currentMediaType),
            updateRecommendationsSection(),
            updateCategoriesSection()
        ]);
        
        // Update UI
        updateTrendingSection(trending.results);
        
        // Initialize features
        setupTrendingTabs();
        setupThemeToggle();
        setupUIHandlers();
        setupSearchHandler();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);