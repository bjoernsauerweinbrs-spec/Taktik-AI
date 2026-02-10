/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Fokus: Kader-Isolierung, Biometrie, Rückennummern & FIFA-Cards Fix
 * Status: MASTER-SYNC 2026 - FULL SQUAD CONTROL
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
        
        // --- FIX: STRENGE KADER-ISOLIERUNG ---
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
                        <p style="color:#666; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Squad Assignment & Biometrie-Check</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.7rem; padding:8px 15px;" onclick="window.SektorSporttasche.openAddModal('${team}')">
                            <i class="fas fa-user-plus"></i> SPIELER HINZUFÜGEN
                        </button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div class="fifa-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 30px; padding: 10px;">
                    ${players.length > 0 ? players.map(p => this.createCardHTML(p)).join('') : 
                    '<p style="color:#444; text-align:center; grid-column: 1/-1; padding: 40px; font-family:\'Orbitron\';">KEINE SPIELER IM KADER GEFUNDEN.</p>'}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--panel-dark); border:2px solid var(--neon-green); padding:30px; border-radius:15px; z-index:1000001; width:450px; box-shadow:0 0 100px #000;">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    createCardHTML(p) {
        const sideColor = p.assignment === 'Toni' ? 'var(--neon-green)' : (p.assignment === 'Trainer' ? 'var(--accent-orange)' : 'var(--accent-gold)');
        
        return `
            <div class="fifa-card fadeIn" style="position:relative; cursor:pointer;" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                <div onclick="event.stopPropagation(); window.SektorSporttasche.removePlayer('${p.id}')" 
                     style="position:absolute; top:20px; right:15px; z-index:10; color:rgba(255,255,255,0.2); transition:0.3s;" 
                     onmouseover="this.style.color='var(--status-error)'" onmouseout="this.style.color='rgba(255,255,255,0.2)'">
                    <i class="fas fa-user-minus"></i>
                </div>

                <div class="card-inner" style="height:100%; width:100%; padding: 20px;">
                    <div style="position:absolute; top:35px; left:25px; text-align:center;">
                        <div style="font-size:2.2rem; font-weight:900; font-family:'Orbitron'; color:#fff; line-height:0.9;">${p.rat}</div>
                        <div style="font-size:0.8rem; font-weight:bold; color:var(--accent-gold); margin-top:5px;">${p.pos}</div>
                        <div style="font-size:0.9rem; color:var(--neon-green); font-family:'Orbitron'; margin-top:5px;">#${p.number || '0'}</div>
                    </div>

                    <div style="margin-top:125px; text-align:center; width:100%;">
                        <div style="font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:5px; color:#fff; text-shadow: 1px 1px 2px #000;">
                            ${p.name.toUpperCase()}
                        </div>
                        <div style="font-size:0.55rem; color:#666; margin-top:5px; font-family:'Orbitron';">
                            * ${p.dob ? p.dob.split('-').reverse().join('.') : '---'}
                        </div>
                    </div>

                    <div style="margin-top:12px; padding:0 10px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px 15px; font-size:0.6rem; font-family:'Orbitron'; color: var(--text-dim);">
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #222;"><span>HGT</span> <b style="color:#fff;">${p.height || '--'}</b></div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #222;"><span>WGT</span> <b style="color:#fff;">${p.weight || '--'}</b></div>
                        </div>
                    </div>
                    
                    <div style="position:absolute; bottom:30px; left:0; width:100%; text-align:center; font-size:0.5rem; letter-spacing:2px; color:${sideColor}; opacity:0.8;">
                        ${p.assignment ? p.assignment.toUpperCase() : 'UNASSIGNED'}
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
            <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:20px;">REKRUTIERUNG: ${team.toUpperCase()}</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; color:#fff;">
                <div style="grid-column: 1 / -1;">
                    <label style="font-size:0.6rem; color:#666;">NAME DES SPIELERS</label>
                    <input type="text" id="add-name" class="pro-textarea" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                </div>
                <div>
                    <label style="font-size:0.6rem; color:#666;">RÜCKENNUMMER</label>
                    <input type="number" id="add-number" placeholder="10" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                </div>
                <div>
                    <label style="font-size:0.6rem; color:#666;">POSITION (z.B. ST)</label>
                    <input type="text" id="add-pos" value="ST" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                </div>
                <div><label style="font-size:0.6rem; color:#666;">GEB. DATUM</label><input type="date" id="add-dob" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GRÖSSE (cm)</label><input type="number" id="add-height" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GEWICHT (kg)</label><input type="number" id="add-weight" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
            </div>
            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSporttasche.saveNewPlayer('${team}')">SPIELER SPEICHERN</button>
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
            number: document.getElementById('add-number').value || "0",
            dob: document.getElementById('add-dob').value,
            height: document.getElementById('add-height').value,
            weight: document.getElementById('add-weight').value,
            pos: document.getElementById('add-pos').value.toUpperCase(),
            team: (teamContext === "Senioren") ? "Senioren" : "Jugend",
            jugend: (teamContext !== "Senioren") ? teamContext : null,
            rat: 75, pac: 70, sho: 70, pas: 70, dri: 70, def: 50, phy: 60,
            assignment: "Trainer"
        };

        if(!window.Database.players) window.Database.players = [];
        window.Database.players.push(newPlayer);
        if(window.Database.save) window.Database.save();
        document.getElementById('player-edit-modal').classList.add('hidden');
        this.render();
        if(window.ToniVoice) window.ToniVoice.speak(`${name} mit Nummer ${newPlayer.number} rekrutiert.`);
    },

    openEdit(playerId) {
        const player = window.Database.players.find(p => p.id == playerId);
        if (!player) return;

        const modal = document.getElementById('player-edit-modal');
        const form = document.getElementById('modal-form-content');
        modal.classList.remove('hidden');

        form.innerHTML = `
            <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:20px;">PROFIL: ${player.name.toUpperCase()}</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; color:#fff;">
                <div style="grid-column: 1 / -1;">
                    <label style="font-size:0.6rem; color:#666;">NAME</label>
                    <input type="text" id="edit-name" value="${player.name}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                </div>
                <div><label style="font-size:0.6rem; color:#666;">NUMMER</label><input type="number" id="edit-number" value="${player.number || 0}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">POS</label><input type="text" id="edit-pos" value="${player.pos}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GRÖSSE</label><input type="number" id="edit-height" value="${player.height || ''}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                <div><label style="font-size:0.6rem; color:#666;">GEWICHT</label><input type="number" id="edit-weight" value="${player.weight || ''}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                
                ${['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(stat => `
                    <div><label style="font-size:0.6rem; color:#666;">${stat.toUpperCase()}</label><input type="number" id="edit-${stat}" value="${player[stat] || 50}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                `).join('')}
            </div>
            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSporttasche.savePlayer(${player.id})">SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">ZURÜCK</button>
            </div>
        `;
    },

    savePlayer(id) {
        const player = window.Database.players.find(p => p.id == id);
        if (player) {
            player.name = document.getElementById('edit-name').value;
            player.number = document.getElementById('edit-number').value;
            player.pos = document.getElementById('edit-pos').value.toUpperCase();
            player.height = document.getElementById('edit-height').value;
            player.weight = document.getElementById('edit-weight').value;
            
            player.rat = parseInt(document.getElementById('edit-rat').value);
            player.pac = parseInt(document.getElementById('edit-pac').value);
            player.sho = parseInt(document.getElementById('edit-sho').value);
            player.pas = parseInt(document.getElementById('edit-pas').value);
            player.dri = parseInt(document.getElementById('edit-dri').value);
            player.def = parseInt(document.getElementById('edit-def').value);
            player.phy = parseInt(document.getElementById('edit-phy').value);

            if(window.Database.save) window.Database.save();
            document.getElementById('player-edit-modal').classList.add('hidden');
            this.render();
            if(window.Arena && window.Arena.renderBench) window.Arena.renderBench(); // Update der Arena-Bank
        }
    },

    removePlayer(id) {
        if (confirm("EINHEIT WIRKLICH ELIMINIEREN?")) {
            window.Database.players = window.Database.players.filter(p => p.id != id);
            if(window.Database.save) window.Database.save();
            this.render();
            if(window.Arena && window.Arena.renderBench) window.Arena.renderBench();
        }
    }
};
