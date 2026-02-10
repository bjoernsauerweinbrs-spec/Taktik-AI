/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Fokus: FIFA-Cards Recognition Fix & Squad Assignment
 * Status: 2026 HD OPTIMIERST
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
            ? window.Database.players.filter(p => p.team === team) 
            : [];

        activeContent.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(57, 255, 20, 0.3); padding-bottom:15px;">
                    <div>
                        <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin:0; letter-spacing:2px;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">Formation-Sync & Player Stats</p>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div class="fifa-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 30px; padding: 10px;">
                    ${players.length > 0 ? players.map(p => this.createCardHTML(p)).join('') : 
                    '<p style="color:#444; text-align:center; grid-column: 1/-1; padding: 40px;">Keine Spieler für dieses Team im System hinterlegt.</p>'}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--panel-dark); border:2px solid var(--neon-green); padding:30px; border-radius:15px; z-index:1000001; width:450px; box-shadow:0 0 100px #000;">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    createCardHTML(p) {
        // Zuweisung Farbe (Toni vs Trainer)
        const sideColor = p.assignment === 'Toni' ? 'var(--neon-green)' : (p.assignment === 'Trainer' ? 'var(--accent-orange)' : 'var(--accent-gold)');
        
        return `
            <div class="fifa-card fadeIn" style="position:relative; cursor:pointer;" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                <div class="card-inner" style="height:100%; width:100%; padding: 20px;">
                    <div style="position:absolute; top:35px; left:25px; text-align:center; filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));">
                        <div style="font-size:2.2rem; font-weight:900; font-family:'Orbitron'; color:#fff; line-height:0.9;">${p.rat}</div>
                        <div style="font-size:0.8rem; font-weight:bold; color:var(--accent-gold); margin-top:5px; letter-spacing:1px;">${p.pos}</div>
                        <div style="width:20px; height:2px; background:${sideColor}; margin: 8px auto 0;"></div>
                    </div>

                    <div style="margin-top:125px; text-align:center; width:100%;">
                        <div style="font-weight:900; font-size:1rem; letter-spacing:1.5px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:5px; display:inline-block; width:90%; color:#fff; text-shadow: 1px 1px 2px #000;">
                            ${p.name.toUpperCase()}
                        </div>
                    </div>

                    <div style="margin-top:15px; padding:0 10px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px 15px; font-size:0.7rem; font-family:'Orbitron'; color: var(--text-dim);">
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);"><span>PAC</span> <b style="color:#fff;">${p.pac || 50}</b></div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);"><span>DRI</span> <b style="color:#fff;">${p.dri || 50}</b></div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);"><span>SHO</span> <b style="color:#fff;">${p.sho || 50}</b></div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);"><span>DEF</span> <b style="color:#fff;">${p.def || 50}</b></div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);"><span>PAS</span> <b style="color:#fff;">${p.pas || 50}</b></div>
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);"><span>PHY</span> <b style="color:#fff;">${p.phy || 50}</b></div>
                        </div>
                    </div>
                    
                    <div style="position:absolute; bottom:35px; left:0; width:100%; text-align:center; font-size:0.5rem; letter-spacing:2px; color:${sideColor}; opacity:0.8;">
                        ${p.assignment ? p.assignment.toUpperCase() : 'UNASSIGNED'}
                    </div>
                </div>
            </div>
        `;
    },

    openEdit(playerId) {
        const player = window.Database.players.find(p => p.id == playerId);
        if (!player) return;

        const modal = document.getElementById('player-edit-modal');
        const form = document.getElementById('modal-form-content');
        modal.classList.remove('hidden');

        form.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:20px;">
                <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin:0;">UNIT MODIFICATION</h3>
                <i class="fas fa-fingerprint" style="color:var(--neon-green); font-size:1.5rem; opacity:0.5;"></i>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; color:#fff;">
                <div style="grid-column: 1 / -1;">
                    <label style="font-size:0.6rem; color:#666; text-transform:uppercase;">Name</label>
                    <input type="text" id="edit-name" value="${player.name}" class="pro-textarea" style="margin-top:5px; width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                </div>
                
                <div>
                    <label style="font-size:0.6rem; color:#666; text-transform:uppercase;">Position</label>
                    <input type="text" id="edit-pos" value="${player.pos}" class="pro-textarea" style="margin-top:5px; width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                </div>

                <div>
                    <label style="font-size:0.6rem; color:#666; text-transform:uppercase;">Squad Assignment</label>
                    <select id="edit-assignment" style="margin-top:5px; width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px; font-size:0.8rem;">
                        <option value="Toni" ${player.assignment === 'Toni' ? 'selected' : ''}>Toni (4-4-2)</option>
                        <option value="Trainer" ${player.assignment === 'Trainer' ? 'selected' : ''}>Trainer (3-4-3)</option>
                        <option value="both" ${player.assignment === 'both' ? 'selected' : ''}>Beide Teams</option>
                    </select>
                </div>

                ${['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(stat => `
                    <div>
                        <label style="font-size:0.6rem; color:#666; text-transform:uppercase;">${stat}</label>
                        <input type="number" id="edit-${stat}" value="${player[stat] || 50}" class="pro-textarea" style="margin-top:5px; width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;">
                    </div>
                `).join('')}
            </div>

            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSporttasche.savePlayer(${player.id})">BIOMETRIE SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">ABBRECHEN</button>
            </div>
        `;
    },

    savePlayer(id) {
        const player = window.Database.players.find(p => p.id == id);
        if (player) {
            player.name = document.getElementById('edit-name').value;
            player.pos = document.getElementById('edit-pos').value;
            player.assignment = document.getElementById('edit-assignment').value;
            
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
            
            if(window.ToniVoice) window.ToniVoice.speak("Biometrische Daten für " + player.name + " wurden im " + player.assignment + " Kader aktualisiert.");
        }
    }
};
