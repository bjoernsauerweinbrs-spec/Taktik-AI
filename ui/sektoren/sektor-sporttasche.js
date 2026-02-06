window.SektorSporttasche = {
    render: function() {
        const container = document.getElementById('active-content');
        const players = window.ToniDB.getPlayers().filter(p => p.team === 'home');

        container.innerHTML = `
            <div class="kabine-header">
                <h2><i class="fas fa-tshirt"></i> MANNSCHAFTSKABINE</h2>
                <p>Klicke auf eine Karte, um den Spieler für das Feld zu aktivieren oder zu deaktivieren.</p>
            </div>
            <div class="fifa-cards-grid">
                ${players.map(p => this.createCard(p)).join('')}
            </div>
        `;
    },

    createCard: function(p) {
        return `
            <div class="fifa-card ${p.isPresent ? 'active' : 'inactive'}" onclick="window.SektorSporttasche.togglePresence('${p.id}', ${p.isPresent})">
                <div class="card-inner">
                    <div class="card-top">
                        <div class="rating">${p.rat || 85}</div>
                        <div class="position">${p.pos || 'ST'}</div>
                    </div>
                    <div class="player-img">
                        <i class="fas fa-user-ninja"></i>
                    </div>
                    <div class="card-bottom">
                        <div class="player-name">${p.name.toUpperCase()}</div>
                        <div class="player-stats">
                            <span>NR: ${p.nr}</span>
                            <span>PRO</span>
                        </div>
                    </div>
                </div>
                <div class="status-ribbon">${p.isPresent ? 'AUF DEM FELD' : 'IN KABINE'}</div>
            </div>
        `;
    },

    togglePresence: function(id, currentStatus) {
        window.ToniDB.updatePlayer(id, { isPresent: !currentStatus });
        this.render(); // UI in der Aktentasche sofort aktualisieren
    }
};
