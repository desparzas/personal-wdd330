const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNmYxZDZlN2JlMDM1MGU2Y2MyZDcxZDQzZTdlZDg5YiIsIm5iZiI6MTc0NDQzOTQ3MC4xMjIsInN1YiI6IjY3ZmEwOGFlZDRjNDQ0YTFjYzk5ZmZmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.na1xDSbkLJFpFhgNfj_Kgfe5KghZPTxJbHrWSEm4d_8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

class TMDbAPI {
    static get headers() {
        return {
            'accept': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        };
    }

    static async fetchTrending(mediaType = 'all', timeWindow = 'week') {
        const response = await fetch(
            `${BASE_URL}/trending/${mediaType}/${timeWindow}`,
            { headers: this.headers }
        );
        return await response.json();
    }

    static async searchMedia(query, type = 'all', page = 1) {
        let endpoint = '';
        
        if (type === 'all') {
            endpoint = `/search/multi?query=${encodeURIComponent(query)}&page=${page}`;
        } else if (type === 'movie') {
            endpoint = `/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
        } else if (type === 'tv') {
            endpoint = `/search/tv?query=${encodeURIComponent(query)}&page=${page}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: this.headers
        });

        return response.json();
    }

    static async getMediaDetails(mediaType, id) {
        const response = await fetch(
            `${BASE_URL}/${mediaType}/${id}?append_to_response=credits,similar,videos`,
            { headers: this.headers }
        );
        return await response.json();
    }

    static async getRecommendations(mediaType, id) {
        const response = await fetch(
            `${BASE_URL}/${mediaType}/${id}/recommendations`,
            { headers: this.headers }
        );
        return await response.json();
    }

    static getImageUrl(path, size = 'w500') {
        return path ? `${IMAGE_BASE_URL}${size}${path}` : 'img/no-poster.jpg';
    }

    static async getPopularMedia(mediaType = 'movie', page = 1) {
        const response = await fetch(
            `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&page=${page}`,
            { headers: this.headers }
        );
        return await response.json();
    }

    static async getGenres() {
        const [movieGenres, tvGenres] = await Promise.all([
            fetch(`${BASE_URL}/genre/movie/list`, { headers: this.headers }),
            fetch(`${BASE_URL}/genre/tv/list`, { headers: this.headers })
        ]);

        const movieData = await movieGenres.json();
        const tvData = await tvGenres.json();

        // Combine and deduplicate genres
        const uniqueGenres = [...new Map([
            ...movieData.genres,
            ...tvData.genres
        ].map(genre => [genre.id, genre])).values()];

        return uniqueGenres;
    }

    static async getGenres2(type) {
        const url = `${BASE_URL}/genre/${type}/list`;
        console.log("url", url);
        const response = await fetch(url, {
            headers: this.headers
        });
        const data = await response.json();
        console.log("miau", data);
        return data.genres;
    }

    static async searchMedia(query = '', type = 'all', page = 1, genre = '') {
        let endpoint = '';
        let params = `page=${page}`;
        
        if (query) {
            params += `&query=${encodeURIComponent(query)}`;
        }
        
        if (genre) {
            params += `&with_genres=${genre}`;
            if (!query) {
                if (type === 'movie' || type === 'all') {
                    endpoint = `/discover/movie?${params}`;
                    return this.fetchFromEndpoint(endpoint).then(data => ({
                        ...data,
                        results: data.results.map(item => ({
                            ...item,
                            media_type: 'movie'
                        }))
                    }));
                } else if (type === 'tv') {
                    endpoint = `/discover/tv?${params}`;
                    return this.fetchFromEndpoint(endpoint).then(data => ({
                        ...data,
                        results: data.results.map(item => ({
                            ...item,
                            media_type: 'tv'
                        }))
                    }));
                }
            }
        }
        
        if (query) {
            if (type === 'all') {
                endpoint = `/search/multi?${params}`;
            } else if (type === 'movie') {
                endpoint = `/search/movie?${params}`;
            } else if (type === 'tv') {
                endpoint = `/search/tv?${params}`;
            }
        }
    
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: this.headers
        });
    
        const data = await response.json();
        
        // Add media_type to results if not present
        if (type !== 'all') {
            data.results = data.results.map(item => ({
                ...item,
                media_type: type
            }));
        }
    
        return data;
    }

    // Helper method for fetching from endpoint
    static async fetchFromEndpoint(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: this.headers
        });
        return response.json();
    }
}