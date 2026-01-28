/**
 * TONI 2.0 - Database Modul
 * Nutzt IndexedDB für die dauerhafte Speicherung von Kader und Taktik
 */

const ToniDB = {
    dbName: "ToniGingaDB",
    version: 1,
    db: null,

    /**
     * Initialisiert die Datenbank
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Schublade für Spieler (Kader)
                if (!db.objectStoreNames.contains('roster')) {
                    db.createObjectStore('roster', { keyPath: 'id' });
                }
                // Schublade für Taktik-Settings
                if (!db.objectStoreNames.contains('tactics')) {
                    db.createObjectStore('tactics', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("[Database] Verbindung zum Ginga-Tresor hergestellt.");
                resolve();
            };

            request.onerror = () => reject("Datenbank-Fehler");
        });
    },

    /**
     * Speichert oder aktualisiert einen Spieler
     */
    async savePlayer(player) {
        const tx = this.db.transaction('roster', 'readwrite');
        const store = tx.objectStore('roster');
        return store.put(player);
    },

    /**
     * Lädt den gesamten Kader
     */
    async getRoster() {
        return new Promise((resolve) => {
            const tx = this.db.transaction('roster', 'readonly');
            const store = tx.objectStore('roster');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Löscht einen Spieler
     */
    async deletePlayer(id) {
        const tx = this.db.transaction('roster', 'readwrite');
        const store = tx.objectStore('roster');
        store.delete(id);
    }
};

// Initialisierung und Event-Anbindung
ToniDB.init().then(() => {
    // Wenn die Engine einen Spieler synchronisiert, speichern wir ihn
    window.ToniEvents.on('PLAYER:SYNC', (data) => {
        ToniDB.savePlayer(data);
    });
});
