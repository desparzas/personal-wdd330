// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    loadTrendingMedia();
    loadPopularMedia();
});

function setupGenreLinks() {
    document.querySelectorAll('.genre-card').forEach(card => {
        card.addEventListener('click', () => {
            const genreId = card.dataset.genreId;
            const type = card.dataset.type || 'movie'; // default to movie if not specified
            window.location.href = `search.html?genre=${genreId}&type=${type}`;
        });
    });
}