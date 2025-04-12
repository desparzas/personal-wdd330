class MovieMateDB {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        this.userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    }

    addToFavorites(mediaId) {
        if (!this.favorites.includes(mediaId)) {
            this.favorites.push(mediaId);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        }
    }

    addRecentSearch(query) {
        this.recentSearches.unshift(query);
        this.recentSearches = this.recentSearches.slice(0, 5); // Keep last 5 searches
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }

    saveUserPreferences(preferences) {
        this.userPreferences = {...this.userPreferences, ...preferences};
        localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    }
}