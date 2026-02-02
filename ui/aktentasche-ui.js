/**
 * TONI 2.0 – AKTENTASCHE CORE
 * Verwaltung von Sporttasche, Analyse & Geschäftszimmer
 */
(function() {
    window.Aktentasche = {
        kader: [
            { id: 1, name: "David Luiz", number: 4, rating: 8, status: "Fit", pos: "IV", x: 200, y: 300, team: 'home' },
            { id: 2, name: "Max Miller", number: 10, rating: 6, status: "Topform", pos: "OM", x: 400, y: 350, team: 'home' }
        ],

        showSporttasche() {
            const target = document.getElementById('subfolder-content');
            target.innerHTML = `
                <h3 style="color:#FF6A00; margin-bottom:15px;">👟 SPORTTASCHE: Kader</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    ${this.kader.map(p => `
                        <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px; display:flex; justify-content:space-between;">
                            <span>#${p.number} ${p.name}</span>
                            <button onclick="window.Aktentasche.toBoard(${p.id})" style="background:#28C76F; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">AUFS FELD</button>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        showGeschäftszimmer() {
            const target = document.getElementById('subfolder-content');
            target.innerHTML = `
                <h3 style="color:#00D1FF; margin-bottom:15px;">🏢 GESCHÄFTSZIMMER: Management</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div class="folder-card-small" onclick="alert('Sponsoring lädt...')">💰 Sponsoring-Assets</div>
                    <div class="folder-card-small" onclick="alert('Stadionzeitung generiert...')">📰 Stadionzeitung</div>
                </div>
            `;
        },

        toBoard(id) {
            const p = this.kader.find(item => item.id === id);
            if (!arena.players.find(ap => ap.id === id)) {
                arena.players.push({ ...p });
                window.toggleBriefcase();
            }
        }
    };

    window.showSetcard = function(player) {
        const side = document.getElementById('setcard-content');
        side.innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid rgba(0,209,255,0.3);">
                <h3 style="color:#FF6A00;">${player.name}</h3>
                <div style="font-size:32px; font-weight:bold; margin:10px 0;">#${player.number}</div>
                <hr style="opacity:0.1; margin:15px 0;">
                <label style="font-size:11px; text-transform:uppercase; letter-spacing:1px;">Formbewertung: <b>${player.rating}/10</b></label>
                <input type="range" min="1" max="10" value="${player.rating}" oninput="updatePlayerForm(${player.id}, this.value)" style="width:100%; margin:15px 0; accent-color:#00D1FF;">
                <div style="font-size:12px; line-height:1.8;">
                    <div>STATUS: <span style="color:#28C76F;">${player.status}</span></div>
                    <div>POSITION: ${player.pos}</div>
                </div>
            </div>
        `;
    };

    window.updatePlayerForm = function(id, val) {
        const p = arena.players.find(ap => ap.id === id);
        if (p) p.rating = val;
    };
})();
