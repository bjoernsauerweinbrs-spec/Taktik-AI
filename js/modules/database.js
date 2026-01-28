/**
 * Toni 2.0 - Database Engine (IndexedDB)
 * Sicherung von Kader, Snapshots und Analysen.
 */

const dbName = "ToniTacticsDB";
const dbVersion = 1;

window.initToniDB = function() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Der Spielerschrank
            if (!db.objectStoreNames.contains("squad")) {
                db.createObjectStore("squad", { keyPath: "id" });
            }
            // Der Taktik-Schrank (Snapshots)
            if (!db.objectStoreNames.contains("snapshots")) {
                db.createObjectStore("snapshots", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject("DB Error: " + event.target.errorCode);
    });
};
