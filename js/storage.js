/**
 * Toni 2.0 - Storage & Export Engine
 * Verwaltet das dauerhafte Speichern des Kaders und den Klemmbrett-Druck.
 */

// --- 1. SPEICHER-LOGIK (LocalStorage) ---

/**
 * Speichert den aktuellen Kader und die Punkte in den Browser-Speicher
 */
function saveSquadData() {
    try {
        localStorage.setItem('toni_squad_data', JSON.stringify(squad));
        console.log("Aktentasche aktualisiert: Kader gesichert.");
    } catch (e) {
        console.error("Fehler beim Speichern in die Aktentasche:", e);
    }
}

/**
 * Lädt die gespeicherten Daten beim Starten der App
 */
function loadSquadData() {
    const savedData = localStorage.getItem('toni_squad_data');
    if (savedData) {
        try {
            squad = JSON.parse(savedData);
            console.log("Daten erfolgreich aus der Aktentasche geladen.");
            
            // UI aktualisieren, nachdem Daten geladen wurden
            if (typeof renderSquad === "function") renderSquad();
            if (typeof drawBoard === "function") drawBoard();
        } catch (e) {
            console.error("Fehler beim Parsen der Speicherdaten:", e);
        }
    }
}

// --- 2. EXPORT-LOGIK (Das Klemmbrett) ---

/**
 * Erzeugt eine druckoptimierte Version des aktuellen Boards und der Analyse
 */
function exportToKlemmbrett() {
    toniSpeak("Ich bereite dein Klemmbrett vor, Björn. Ein sauberer Plan ist die halbe Miete!");

    // Screenshot-ähnliches Fenster für den Druck öffnen
    const printWindow = window.open('', '_blank');
    const pitchHtml = document.getElementById('pitch').innerHTML;
    const notes = document.getElementById('toni-output').innerText;
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Toni 2.0 - Trainingsplan Björn</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 30px; color: #333; }
                .header { border-bottom: 3px solid #2e7d32; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
                .pitch-box { 
                    width: 100%; height: 500px; border: 2px solid #000; 
                    position: relative; background: #fff; overflow: hidden;
                    transform: scale(0.9); transform-origin: top left;
                }
                /* CSS für die gedruckten Punkte übernehmen */
                .player-dot { position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #d32f2f; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; transform: translate(-50%, -50%); border: 1px solid #000; }
                .player-label { position: absolute; top: 32px; font-size: 10px; color: #000; font-weight: bold; white-space: nowrap; }
                .goal { position: absolute; background: #000; border: 1px solid #000; }
                .standard-goal { width: 10px; height: 80px; }
                .funino-goal { width: 6px; height: 40px; }
                .center-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: #333; }
                .center-circle { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; border: 1px solid #333; border-radius: 50%; }
                .notes-section { margin-top: 40px; background: #f9f9f9; padding: 15px; border-left: 5px solid #2e7d32; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1 style="margin:0;">⚽ Trainings-Beleg</h1>
                    <p style="margin:5px 0;">Trainer: Björn | Modus: ${currentMode} | Datum: ${new Date().toLocaleDateString()}</p>
                </div>
                <div style="font-size: 40px;">🇧🇷</div>
            </div>
            
            <div class="pitch-box">
                ${pitchHtml}
            </div>

            <div class="notes-section">
                <h3>Tonis Analyse & Notizen:</h3>
                <p>${notes ? notes : "Keine speziellen Notizen für diese Einheit."}</p>
            </div>

            <div style="margin-top: 30px;">
                <h4>Anwesenheits-Check / Material:</h4>
                <p>Spieler im Training: ____________________ | Bälle: [ ] | Hütchen: [ ]</p>
            </div>

            <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #2e7d32; color: #fff; border: none; cursor: pointer; border-radius: 5px;">Jetzt Drucken / Als PDF speichern</button>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// --- 3. INITIALISIERUNG ---

document.addEventListener('DOMContentLoaded', () => {
    // Wenn wir in der app.html sind, laden wir die Daten
    if (document.getElementById('player-list')) {
        loadSquadData();
    }
});
