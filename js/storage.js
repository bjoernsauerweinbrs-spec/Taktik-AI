/**
 * Toni 2.0 - Storage & Export Engine
 * Verwaltet das Speichern in der Aktentasche und den Klemmbrett-Druck.
 */

// 1. Automatische Speicherung des Kaders
function saveSquadData() {
    localStorage.setItem('toni_squad_data', JSON.stringify(squad));
    console.log("Kader in Aktentasche gespeichert.");
}

// 2. Laden beim Start
function loadSquadData() {
    const saved = localStorage.getItem('toni_squad_data');
    if (saved) {
        squad = JSON.parse(saved);
        renderSquad();
        drawBoard();
    }
}

/**
 * Die Klemmbrett-Funktion: Erzeugt ein sauberes Druck-Layout
 */
function exportToKlemmbrett() {
    toniSpeak("Ich bereite das Klemmbrett für den Platz vor. Einen Moment...");

    // Wir erstellen ein neues Fenster für den Druck, um Sidebars auszublenden
    const printWindow = window.open('', '_blank');
    const pitchSvg = document.getElementById('pitch').innerHTML;
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Trainingsbeleg - Björn</title>
            <style>
                body { font-family: sans-serif; padding: 40px; }
                .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
                .pitch-preview { 
                    width: 100%; height: 400px; border: 2px solid #000; 
                    position: relative; background: #fff; margin: 20px 0;
                }
                .notes { margin-top: 30px; border: 1px solid #ccc; padding: 15px; }
                .footer { margin-top: 50px; font-size: 0.8em; color: #666; text-align: center; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>⚽ Trainingsbeleg: ${currentMode.toUpperCase()}</h1>
                <p>Trainer: Björn | Datum: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="pitch-preview">
                ${pitchSvg}
            </div>

            <div class="notes">
                <h3>Tonis Experten-Analyse:</h3>
                <p>${document.getElementById('toni-output').innerText}</p>
            </div>

            <div class="notes">
                <h3>Material & Notizen:</h3>
                <p>Anwesende Spieler: ${activeTrainingCount}</p>
                <p>__________________________________________________________________________</p>
                <p>__________________________________________________________________________</p>
            </div>

            <div class="footer">Generiert von Toni - Dein Globaler Taktik-Experte</div>
            
            <script>
                setTimeout(() => { window.print(); }, 500);
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    loadSquadData();
});
