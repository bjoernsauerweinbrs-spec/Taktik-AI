/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Fokus: Kader-Management, FIFA-Stat-Editor & Ersatzbank-Sync
 * Status: ETAPPE 3 - KABINE VERSIEGELT
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
        
        // Filtert alle Spieler des aktuellen Teams (Stamm + Bank)
        const players = (window.Database && window.Database.players) 
            ? window.Database.players.filter(p => {
                const isCorrectTeam = (team === "Senioren") ? p.team === "Senioren" : p.jugend === team;
                return isCorrectTeam && p.assignment === "Trainer";
            }) 
            : [];

        activeContent.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid #39FF14; padding-bottom:15px;">
                    <div>
                        <h3 style="color:#39FF14; font-family:'Orbitron'; margin:0; letter-spacing:2px;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.7rem; text-transform:uppercase;">Status: ${players.length} Einheiten im Kader</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.7rem;" onclick="window.SektorSporttasche.openAddModal('${team}')">
                            <i class="fas fa-plus"></i> NEUER SPIELER
                        </button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${players.map(p => this.createCardHTML(p)).join('')}
                    ${players.length === 0 ? '<p style="color:#444; grid-column:1/-1; text-align:center;">KEIN KADER GELADEN.</p>' : ''}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#0a0a0a; border:2px solid #39FF14; padding:30px; border-radius:15px; z-index:1000002; width:450px; box-shadow:0 0 100px #000; color:#fff; font-family:'Orbitron';">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    createCardHTML(p) {
        let cardColor = p.rat >= 80 ? "#FFD700" : (p.rat >= 70 ? "#C0C0C0" : "#CD7F32");
        const statusIcon = p.onField ? '<i class="fas fa-thumbtack" title="Auf dem Feld"></i>' : '<i class="fas fa-couch" title="Ersatzbank"></i>';

        return `
            <div class="fifa-card" onclick="window.SektorSporttasche.openEdit('${p.id}')" style="border: 2px solid ${cardColor}; position:relative; cursor:pointer; background:rgba(255,255,255,0.02); padding:15px; border-radius:10px; transition:0.3s;">
                <div style="position:absolute; top:10px; right:10px; color:${p.onField ? '#39FF14' : '#666'}; font-size:0.8rem;">${statusIcon}</div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <div style="font-size:1.8rem; font-weight:900; line-height:1;">${p.rat}</div>
                    <div style="font-size:0.6rem; color:${cardColor}; font-weight:bold; margin-bottom:10px;">${p.pos}</div>
                    <div style="font-weight:bold; border-bottom:1px solid #333; width:100%; text-align:center; padding-bottom:5px; margin-bottom:10px;">${p.name.toUpperCase()}</div>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; font-size:0.6rem; color:#888;">
                        <div>PAC <span style="color:#fff;">${p.pac || 50}</span></div>
                        <div>DRI <span style="color:#fff;">${p.dri || 50}</span></div>
                        <div>SHO <span style="color:#fff;">${p.sho || 50}</span></div>
                        <div>DEF <span style="color:#fff;">${p.def || 50}</span></div>
                        <div>PAS <span style="color:#fff;">${p.pas || 50}</span></div>
                        <div>PHY <span style="color:#fff;">${p.phy || 50}</span></div>
                    </div>
                </div>
            </div>`;
    },

    openEdit(playerId) {
        const p = window.Database.players.find(x => x.id == playerId);
        if (!p) return;
        const modal = document.getElementById('player-edit-modal');
        const form = document.getElementById('modal-form-content');
        modal.classList.remove('hidden');

        form.innerHTML = `
            <h3 style="color:#39FF14; font-size:1rem; margin-bottom:20px; border-bottom:1px solid #222; padding-bottom:10px;">EDIT: ${p.name.toUpperCase()}</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div style="grid-column:1/-1;">
                    <label style="font-size:0.5rem; color:#666;">NAME</label>
                    <input type="text" id="edit-name" value="${p.name}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;">
                </div>
                <div><label style="font-size:0.5rem; color:#666;">NUMMER</label><input type="number" id="edit-number" value="${p.number}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;"></div>
                <div><label style="font-size:0.5rem; color:#666;">POSITION</label><input type="text" id="edit-pos" value="${p.pos}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;"></div>
                
                <div style="grid-column:1/-1; border-top:1px solid #222; margin-top:10px; padding-top:10px; color:#39FF14; font-size:0.6rem;">FIFA STATS & RATING</div>
                ${['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(s => `
                    <div><label style="font-size:0.5rem; color:#666;">${s.toUpperCase()}</label><input type="number" id="edit-${s}" value="${p[s] || 50}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;"></div>
                `).join('')}
            </div>
            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:1;" onclick="window.SektorSporttasche.saveData('${p.id}')">SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">ABBRECHEN</button>
                <button class="tactic-btn" style="color:#ff3b30; border-color:#ff3b30;" onclick="window.SektorSporttasche.deletePlayer('${p.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
    },

    saveData(id) {
        const p = window.Database.players.find(x => x.id == id);
        if (p) {
            p.name = document.getElementById('edit-name').value;
            p.number = document.getElementById('edit-number').value;
            p.pos = document.getElementById('edit-pos').value.toUpperCase();
            ['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(s => {
                p[s] = parseInt(document.getElementById('edit-' + s).value);
            });
            window.Database.save();
            document.getElementById('player-edit-modal').classList.add('hidden');
            this.render();
            if(window.Arena) window.Arena.draw(); // Update Board
        }
    },

    deletePlayer(id) {
        if(confirm("EINHEIT WIRKLICH ELIMINIEREN?")) {
            window.Database.players = window.Database.players.filter(p => p.id != id);
            window.Database.save();
            document.getElementById('player-edit-modal').classList.add('hidden');
            this.render();
            if(window.Arena) window.Arena.draw();
        }
    }
};
