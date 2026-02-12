/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Fokus: Kader-Management, FIFA-TOTY Stat-Editor & Bildhebung
 * Status: ETAPPE 3.1 - KABINE VERSIEGELT
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
                const isCorrectTeam = (team === "Senioren") ? p.team === "Senioren" : p.jugend === team;
                return isCorrectTeam && p.assignment === "Trainer";
            }) 
            : [];

        activeContent.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid #39FF14; padding-bottom:15px;">
                    <div>
                        <h3 style="color:#39FF14; font-family:'Orbitron'; margin:0; letter-spacing:2px; font-size:1.1rem;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.6rem; text-transform:uppercase; letter-spacing:1px;">SYNC STATUS: ${players.length} AKTIVE EINHEITEN</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.65rem;" onclick="window.SektorSporttasche.openAddModal('${team}')">
                            <i class="fas fa-user-plus"></i> NEUZUGANG
                        </button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 25px; justify-items: center;">
                    ${players.map(p => this.createCardHTML(p)).join('')}
                    ${players.length === 0 ? '<div style="color:#444; grid-column:1/-1; text-align:center; padding:50px; font-family:\'Orbitron\'">KADER-DATENBANK LEER</div>' : ''}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#0a0a0a; border:2px solid #39FF14; padding:30px; border-radius:20px; z-index:1000005; width:480px; box-shadow:0 0 150px #000; color:#fff; font-family:'Orbitron';">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    /**
     * Erzeugt die Karte im TOTY-Design mit Bildhebung
     */
    createCardHTML(p) {
        // Rang-Bestimmung für CSS
        const rank = p.rat >= 90 ? "elite" : p.rat >= 80 ? "gold" : p.rat >= 70 ? "silver" : "bronze";
        const statusIcon = p.onField ? '<i class="fas fa-running" style="color:#39FF14;"></i>' : '<i class="fas fa-couch"></i>';

        return `
            <div class="fifa-card" data-rank="${rank}" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                <div style="position:absolute; top:35px; left:20px; text-align:center; z-index:10;">
                    <div style="font-size:1.8rem; font-weight:900; line-height:1;">${p.rat}</div>
                    <div style="font-size:0.7rem; font-weight:bold; opacity:0.8;">${p.pos}</div>
                </div>
                
                <div style="position:absolute; top:15px; right:15px; z-index:10; font-size:0.7rem; opacity:0.5;">${statusIcon}</div>

                <div class="player-img" style="background-image: url('${p.img || 'https://cdn-icons-png.flaticon.com/512/805/805404.png'}');"></div>

                <div style="position:absolute; bottom:25%; width:100%; text-align:center; font-weight:900; font-size:0.85rem; letter-spacing:1px; z-index:10;">
                    ${p.name.split(' ').pop().toUpperCase()}
                </div>

                <div class="card-stats-grid">
                    <div>PAC <span>${p.pac || 50}</span></div> <div>DRI <span>${p.dri || 50}</span></div>
                    <div>SHO <span>${p.sho || 50}</span></div> <div>DEF <span>${p.def || 50}</span></div>
                    <div>PAS <span>${p.pas || 50}</span></div> <div>PHY <span>${p.phy || 50}</span></div>
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
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                <h3 style="color:#39FF14; font-size:0.9rem; margin:0; letter-spacing:1px;">EINHEIT KONFIGURIEREN</h3>
                <span style="font-size:0.6rem; color:#444;">ID: ${p.id}</span>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div style="grid-column:1/-1;">
                    <label style="font-size:0.5rem; color:#666;">VOLLSTÄNDIGER NAME</label>
                    <input type="text" id="edit-name" value="${p.name}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:5px;">
                </div>
                <div><label style="font-size:0.5rem; color:#666;">NUMMER</label><input type="number" id="edit-number" value="${p.number || 0}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:5px;"></div>
                <div><label style="font-size:0.5rem; color:#666;">POSITION</label><input type="text" id="edit-pos" value="${p.pos}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:5px;"></div>
                
                <div style="grid-column:1/-1; border-top:1px solid #222; margin-top:10px; padding-top:10px; color:#39FF14; font-size:0.6rem; letter-spacing:1px;">BIOMETRISCHE LEISTUNGSWERTE</div>
                ${['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(s => `
                    <div>
                        <label style="font-size:0.5rem; color:#666;">${s.toUpperCase()}</label>
                        <input type="number" id="edit-${s}" value="${p[s] || 50}" min="1" max="99" style="width:100%; background:#000; border:1px solid #333; color:#39FF14; padding:10px; border-radius:5px; font-weight:bold;">
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top:30px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSporttasche.saveData('${p.id}')">ÄNDERUNGEN VERSIEGELN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">STOP</button>
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
            if(window.Arena) {
                window.Arena.draw(); 
                window.Arena.renderBench(); // Wichtig für den Sync der Ersatzbank
            }
            if(window.ToniVoice) window.ToniVoice.speak("Daten für " + p.name.split(' ').pop() + " synchronisiert.");
        }
    },

    deletePlayer(id) {
        if(confirm("EINHEIT WIRKLICH AUS DEM SYSTEM LÖSCHEN?")) {
            window.Database.players = window.Database.players.filter(p => p.id != id);
            window.Database.save();
            document.getElementById('player-edit-modal').classList.add('hidden');
            this.render();
            if(window.Arena) {
                window.Arena.draw();
                window.Arena.renderBench();
            }
        }
    }
};
