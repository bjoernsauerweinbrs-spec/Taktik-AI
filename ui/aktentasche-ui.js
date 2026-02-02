/**
 * =========================================
 * TONI 2.0 – SPORTTASCHE & KADER
 * Kader-Management innerhalb der Aktentasche
 * =========================================
 */
(function() {
    window.Aktentasche = {
        // Beispiel-Kader [cite: 2026-01-24]
        kader: [
            { id: 1, name: "David Luiz", number: 4, rating: 8, status: "Fit", x: 200, y: 300, team: 'home' },
            { id: 2, name: "Max Miller", number: 10, rating: 6, status: "Angeschlagen", x: 400, y: 250, team: 'home' }
        ],

        renderSporttasche() {
            const target = document.getElementById('subfolder-inner');
            target.innerHTML = `
                <h3 style="color: #FF6A00; margin-bottom: 20px;">SPORTTASCHE: Kader & Spiel</h3>
                <div class="kader-list">
                    ${this.kader.map(p => `
                        <div class="kader-item" style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:5px; border-radius:5px;">
                            <span>#${p.number} ${p.name} (Form: ${p.rating}/10)</span>
                            <button onclick="Aktentasche.sendToBoard(${p.id})" style="background:#00D1FF; border:none; color:black; padding:2px 10px; border-radius:3px; cursor:pointer;">AUFS FELD</button>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        sendToBoard(playerId) {
            const player = this.kader.find(p => p.id === playerId);
            // Verhindere Dopplungen
            if (!window.arena.players.find(p => p.id === playerId)) {
                window.arena.players.push({ ...player });
                if (window.toggleBriefcase) window.toggleBriefcase(); // Schließe Koffer
                if (window.toniSpeak) toniSpeak(player.name + " ist bereit für den Einsatz.");
            }
        }
    };
})();
