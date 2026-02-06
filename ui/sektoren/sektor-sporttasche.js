window.SektorSporttasche = {
    players: [], // Hier landen die 50+ Profile

    render: function() {
        const container = document.getElementById('active-content');
        container.innerHTML = `
            <div class="kabine-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="color:var(--neon-green)">SPIELERKABINE (PRO-MODUS)</h2>
                <button class="tactic-btn" onclick="window.SektorSporttasche.addPlayer()">+ NEUER SPIELER</button>
            </div>
            <div id="fifa-cards-grid" class="fifa-cards-grid">
                </div>
        `;
        this.updateGrid();
    },

    addPlayer: function() {
        const name = prompt("Name des Spielers:");
        if (!name) return;
        const newPlayer = {
            id: Date.now(),
            name: name,
            img: null,
            status: 'inactive', // 'training' oder 'match'
            rating: 85,
            stats: { pac: 80, sho: 75, pas: 78, dri: 82, def: 50, phy: 70 }
        };
        this.players.push(newPlayer);
        this.updateGrid();
    },

    uploadImage: function(playerId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                const player = this.players.find(p => p.id === playerId);
                if (player) {
                    player.img = event.target.result;
                    this.updateGrid();
                }
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    toggleStatus: function(playerId, type) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.status = (player.status === type) ? 'inactive' : type;
            this.updateGrid();
            // Signal an Toni und das Spielfeld senden
            window.ToniEvents.emit('playerStatusChanged', player);
        }
    },

    updateGrid: function() {
        const grid = document.getElementById('fifa-cards-grid');
        grid.innerHTML = this.players.map(p => `
            <div class="fifa-card ${p.status}">
                <div class="presence-toggle ${p.status !== 'inactive' ? 'on' : ''}" onclick="window.SektorSporttasche.toggleStatus(${p.id}, 'match')"></div>
                <div class="card-inner" onclick="window.SektorSporttasche.uploadImage(${p.id})">
                    <div class="rating">${p.rating}</div>
                    <div class="player-photo">
                        ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja"></i>`}
                    </div>
                    <div class="player-name">${p.name.toUpperCase()}</div>
                    <div class="player-stats">
                        <span>PAC ${p.stats.pac}</span> <span>SHO ${p.stats.sho}</span> <span>PAS ${p.stats.pas}</span>
                    </div>
                </div>
                <div style="padding:5px; display:flex; gap:5px;">
                    <button class="tactic-btn" style="font-size:8px" onclick="window.SektorSporttasche.toggleStatus(${p.id}, 'training')">TRAINING</button>
                    <button class="tactic-btn" style="font-size:8px" onclick="window.SektorSporttasche.toggleStatus(${p.id}, 'match')">SPIEL</button>
                </div>
            </div>
        `).join('');
    }
};
