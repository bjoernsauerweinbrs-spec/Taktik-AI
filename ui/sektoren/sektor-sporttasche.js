/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Fokus: Kader-Isolierung, Pro-Add-Modal & FIFA-Stat-Sync
 * Status: MASTER-SYNC 2026 - COMPLETED
 */
window.SektorSporttasche = {
    
    open() {
        const activeContent = document.getElementById('active-content');
        if (!activeContent) return;
        this.render();
    },

    render() {
        const activeContent = document.getElementById('active-content');
        const team = window.currentTeamContext || "Senioren";
        
        const players = (window.Database && window.Database.players) 
            ? window.Database.players.filter(p => {
                if (team === "Senioren") return p.team === "Senioren";
                return p.jugend === team;
            }) 
            : [];

        activeContent.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(57, 255, 20, 0.3); padding-bottom:15px;">
                    <div>
                        <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin:0; letter-spacing:2px;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Kader-Management & Biometrie-Check</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.7rem; padding:8px 15px;" onclick="window.SektorSporttasche.openAddModal('${team}')">
                            <i class="fas fa-user-plus"></i> NEUER SPIELER
                        </button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div class="fifa-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; padding: 10px;">
                    ${players.length > 0 ? players.map(p => this.createCardHTML(p)).join('') : 
                    '<p style="color:#444; text-align:center; grid-column: 1/-1; padding: 40px; font-family:\'Orbitron\';">KEINE SPIELER IM KADER GEFUNDEN.</p>'}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#0a0a0a; border:2px solid var(--neon-green); padding:30px; border-radius:15px; z-index:1000001; width:480px; box-shadow:0 0 100px #000; max-height:90vh; overflow-y:auto;">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    createCardHTML(p) {
        let cardColor = "var(--accent-gold)"; 
        if (p.rat < 80) cardColor = "#C0C0C0"; 
        if (p.rat < 70) cardColor = "#CD7F32"; 
        
        return `
            <div class="fifa-card fadeIn" style="position:relative; cursor:pointer; border:1px solid ${cardColor};" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                <div onclick="event.stopPropagation(); window.SektorSporttasche.removePlayer('${p.id}')" 
                     style="position:absolute; top:15px; right:15px; z-index:10; color:rgba(255,255,255,0.3);">
                    <i class="fas fa-trash"></i>
                </div>
                <div class="card-inner" style="padding: 20px;">
                    <div style="position:absolute; top:30px; left:20px; text-align:center;">
                        <div style="font-size:2rem; font-weight:900; font-family:'Orbitron'; color:#fff;">${p.rat}</div>
                        <div style="font-size:0.7rem; font-weight:bold; color:${cardColor};">${p.pos}</div>
                        <div style="font-size:0.8rem; color:var(--neon-green); font-family:'Orbitron';">#${p.number || '0'}</div>
                    </div>
                    <div style="margin-top:110px; text-align:center;">
                        <div style="font-weight:900; font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px; color:#fff; font-family:'Orbitron';">
                            ${p.name.toUpperCase()}
                        </div>
                    </div>
                    <div style="margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:0.55rem; color:#888; font-family:'Orbitron';">
                        <div>PAC <b style="color:#fff;">${p.pac || 50}</b></div>
                        <div>DRI <b style="color:#fff;">${p.dri || 50}</b></div>
                        <div>SHO <b style="color:#fff;">${p.sho || 50}</b></div>
                        <div>DEF <b style="color:#fff;">${p.def || 50}</b></div>
                        <div>PAS <b style="color:#fff;">${p.pas || 50}</b></div>
                        <div>PHY <b style="color:#fff;">${p.phy || 50}</b></div>
                    </div>
                </div>
            </div>
        `;
    },

    openAddModal(team) {
        const modal = document.getElementById('player-edit-modal');
        const form = document.getElementById('modal-form-content');
        modal.classList.remove('hidden');

        form.innerHTML = `
            <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:10px;">NEUREKRUTIERUNG: ${team.toUpperCase()}</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; color:#fff;">
                <div style="grid-column: 1 / -1;">
                    <label style="font-size:0.6rem; color:#666;">VOLLSTÄNDIGER NAME</label>
                    <input type="text" id="add-name" placeholder="z.B. Max Mustermann" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px; border-radius:5px;">
                </div>
                <div><label style="font-size:0.6rem; color:#666;">NUMMER</label><input type="number" id="add-number" value="10" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">POSITION</label><input type="text" id="add-pos" value="ST" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GRÖSSE (cm)</label><input type="number" id="add-height" value="180" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GEWICHT (kg)</label><input type="number" id="add-weight" value="75" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GEB. DATUM</label><input type="date" id="add-dob" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">STÄRKE (RAT)</label><input type="number" id="add-rat" value="75" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                
                <div style="grid-column: 1 / -1; margin: 10px 0; border-top: 1px solid #222; padding-top: 10px; color:var(--accent-gold); font-size:0.6rem; font-family:'Orbitron';">INITIALE FIFA STATS</div>
                ${['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(stat => `
                    <div><label style="font-size:0.6rem; color:#666;">${stat.toUpperCase()}</label><input type="number" id="add-${stat}" value="60" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                `).join('')}
            </div>
            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSporttasche.saveNewPlayer('${team}')">SPIELER ANLEGEN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">ABBRECHEN</button>
            </div>
        `;
    },

    saveNewPlayer(teamContext) {
        const name = document.getElementById('add-name').value;
        if (!name) return;

        const newPlayer = {
            id: Date.now(),
            name: name,
            number: document.getElementById('add-number').value,
            pos: document.getElementById('add-pos').value.toUpperCase(),
            height: parseInt(document.getElementById('add-height').value),
            weight: parseInt(document.getElementById('add-weight').value),
            dob: document.getElementById('add-dob').value,
            rat: parseInt(document.getElementById('add-rat').value),
            pac: parseInt(document.getElementById('add-pac').value),
            sho: parseInt(document.getElementById('add-sho').value),
            pas: parseInt(document.getElementById('add-pas').value),
            dri: parseInt(document.getElementById('add-dri').value),
            def: parseInt(document.getElementById('add-def').value),
            phy: parseInt(document.getElementById('add-phy').value),
            team: (teamContext === "Senioren") ? "Senioren" : "Junioren",
            jugend: (teamContext !== "Senioren") ? teamContext : "",
            assignment: "Trainer",
            onField: false
        };

        window.Database.players.push(newPlayer);
        window.Database.save();
        document.getElementById('player-edit-modal').classList.add('hidden');
        this.render();
        if(window.ToniVoice) window.ToniVoice.speak("Willkommen im Kader, " + name);
    },

    openEdit(playerId) {
        const player = window.Database.players.find(p => p.id == playerId);
        if (!player) return;
        const modal = document.getElementById('player-edit-modal');
        const form = document.getElementById('modal-form-content');
        modal.classList.remove('hidden');

        form.innerHTML = `
            <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:10px;">PROFIL-UPDATE: ${player.name}</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; color:#fff;">
                <div style="grid-column: 1 / -1;">
                    <label style="font-size:0.6rem; color:#666;">NAME</label>
                    <input type="text" id="edit-name" value="${player.name}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;">
                </div>
                <div><label style="font-size:0.6rem; color:#666;">NUMMER</label><input type="number" id="edit-number" value="${player.number || 0}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">POSITION</label><input type="text" id="edit-pos" value="${player.pos}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                ${['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(stat => `
                    <div><label style="font-size:0.6rem; color:#666;">${stat.toUpperCase()}</label><input type="number" id="edit-${stat}" value="${player[stat] || 50}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px;"></div>
                `).join('')}
            </div>
            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSporttasche.savePlayer(${player.id})">DATEN SICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">ABBRECHEN</button>
            </div>
        `;
    },

    savePlayer(id) {
        const p = window.Database.players.find(x => x.id == id);
        if (p) {
            p.name = document.getElementById('edit-name').value;
            p.number = document.getElementById('edit-number').value;
            p.pos = document.getElementById('edit-pos').value.toUpperCase();
            ['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(stat => {
                p[stat] = parseInt(document.getElementById('edit-' + stat).value);
            });
            window.Database.save();
            document.getElementById('player-edit-modal').classList.add('hidden');
            this.render();
        }
    },

    removePlayer(id) {
        if (confirm("DIESEN SPIELER KOMPLETT LÖSCHEN?")) {
            window.Database.players = window.Database.players.filter(p => p.id != id);
            window.Database.save();
            this.render();
        }
    }
};
