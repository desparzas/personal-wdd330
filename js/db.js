class MovieMateDB {
    constructor() {
        this.dbName = 'MovieMateDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create stores
                if (!db.objectStoreNames.contains('favorites')) {
                    db.createObjectStore('favorites', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('ratings')) {
                    db.createObjectStore('ratings', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('watchHistory')) {
                    db.createObjectStore('watchHistory', { keyPath: 'id' });
                }
            };
        });
    }

    async addToFavorites(media) {
        return this._performTransaction('favorites', 'readwrite', store => {
            store.add(media);
        });
    }

    async removeFromFavorites(id) {
        return this._performTransaction('favorites', 'readwrite', store => {
            store.delete(id);
        });
    }

    async getFavorites() {
        return this._performTransaction('favorites', 'readonly', store => {
            return store.getAll();
        });
    }

    async addRating(mediaId, rating, review) {
        return this._performTransaction('ratings', 'readwrite', store => {
            store.put({ id: mediaId, rating, review, date: new Date() });
        });
    }

    async _performTransaction(storeName, mode, callback) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, mode);
            const store = transaction.objectStore(storeName);

            try {
                const result = callback(store);
                transaction.oncomplete = () => resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
}