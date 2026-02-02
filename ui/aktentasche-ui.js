/**
 * TONI 2.0 – AKTENTASCHE CONTENT
 * Kader-Management & Setcard-Trigger
 */
(function() {
    window.Aktentasche = {
        kader: [
            { id: 1, name: "David Luiz", number: 4, rating: 8, status: "Fit", pos: "IV", x: 200, y: 300, team: 'home' },
            { id: 2, name: "Max Miller", number: 10, rating: 6, status: "Angeschlagen", pos: "OM", x: 400, y: 350, team: 'home' }
        ],

        showSporttasche() {
            const target = document.getElementById('subfolder-content');
            target.innerHTML = `
                <div class="player-grid-selection" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    ${this.kader.map(p => `
                        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                            <span>#${p.number} ${p.name}</span>
                            <button onclick="window.Aktentasche.toBoard(${p.id})" style="background:#28C76F; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-weight:bold;">AUFS FELD</button>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        toBoard(id) {
            const p = this.kader.find(item => item.id === id);
            if (!arena.players.find(ap => ap.id === id)) {
                arena.players.push(p);
                window.toggleBriefcase();
            }
        }
    };

    // SETCARD FUNKTION (Wird vom Arena-Click getriggert)
    window.showSetcard = function(player) {
        const side = document.getElementById('setcard-content');
        side.innerHTML = `
            <div class="setcard-ui">
                <h3 style="color:#FF6A00;">${player.name}</h3>
                <div style="font-size:30px; margin:10px 0;">#${player.number}</div>
                <div style="font-size:12px; color:#667085; margin-bottom:20px;">Position: ${player.pos}</div>
                
                <label style="font-size:11px; text-transform:uppercase;">Aktuelle Form: <b>${player.rating}/10</b></label>
                <input type="range" min="1" max="10" value="${player.rating}" oninput="updatePlayerForm(${player.id}, this.value)">
                
                <div style="margin-top:20px; font-size:12px;">Status: <span style="color:#28C76F;">${player.status}</span></div>
            </div>
        `;
    };

    window.updatePlayerForm = function(id, val) {
        const p = arena.players.find(ap => ap.id === id);
        if (p) p.rating = val;
    };
})();
