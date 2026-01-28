/**
 * TONI 2.0 - Kader Modul
 * Verwaltung der Spielerprofile und Ginga-Scores
 */

const ToniRoster = {
    init() {
        // Höre auf Tab-Wechsel, um den Kader anzuzeigen
        window.ToniEvents.on('UI:TAB_CHANGED', (data) => {
            if (data.tab === 'kader') this.renderRosterPanel();
        });
    },

    /**
     * Erzeugt das Interface in der Sidebar
     */
    async renderRosterPanel() {
        const container = document.getElementById('tab-content');
        const players = await window.ToniDB.getRoster();

        container.innerHTML = `
            <div class="roster-header">
                <h3>Kader-Management</h3>
                <button class="add-btn" onclick="ToniRoster.showAddForm()"><i class="fas fa-plus"></i> Spieler hinzufügen</button>
            </div>
            <div id="roster-list" class="roster-list">
                ${players.map(p => this.createPlayerCard(p)).join('')}
            </div>
        `;
    },

    /**
     * Erzeugt eine visuelle Karte für jeden Spieler
     */
    createPlayerCard(p) {
        return `
            <div class="player-card">
                <div class="card-info">
                    <span class="card-nr">${p.nr}</span>
                    <div class="card-name-pos">
                        <strong>${p.name}</strong>
                        <span>${p.pos || 'Position offen'}</span>
                    </div>
                </div>
                <div class="card-stats">
                    <span>${p.height || '--'} cm</span>
                    <span>Score: <strong>${p.gingaScore || '0'}</strong></span>
                </div>
                <button class="spawn-btn" onclick="ToniEvents.emit('PLAYER:SPAWN', ${JSON.stringify(p)})">
                    Auf den Platz
                </button>
            </div>
        `;
    },

    showAddForm() {
        // Hier könnte Groq später ein elegantes Modal oder Overlay bauen
        const name = prompt("Name des Spielers:");
        const nr = prompt("Trikotnummer:");
        if (name && nr) {
            const newPlayer = {
                id: Date.now().toString(),
                name: name,
                nr: nr,
                pos: 'Wandspieler', // Standard-Preset
                x: 50, y: 50,
                team: 'red',
                gingaScore: 7.5
            };
            window.ToniDB.savePlayer(newPlayer).then(() => this.renderRosterPanel());
        }
    }
};

ToniRoster.init();
