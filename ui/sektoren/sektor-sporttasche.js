/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (PRO KABINE)
 * Status: VOLLSTÄNDIG - Edit-Modus & Biometrie integriert
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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid #333; padding-bottom:15px;">
                    <div>
                        <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin:0; letter-spacing:2px;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.7rem; text-transform:uppercase;">Unit Control & Biometrie</p>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div class="fifa-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px;">
                    ${players.length > 0 ? players.map(p => this.createCardHTML(p)).join('') : '<p>Keine Spieler geladen.</p>'}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--panel-dark); border:2px solid var(--neon-green); padding:30px; border-radius:15px; z-index:1000001; width:400px; box-shadow:0 0 50px #000;">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    createCardHTML(p) {
        return `
            <div class="fifa-card" style="position:relative; cursor:pointer;" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                <div class="card-inner">
                    <div style="position:absolute; top:35px; left:22px; text-align:center;">
                        <div style="font-size:1.8rem; font-weight:900; font-family:'Orbitron'; color:#fff;">${p.rat}</div>
                        <div style="font-size:0.7rem; font-weight:bold; color:var(--accent-gold);">${p.pos}</div>
                    </div>

                    <div style="margin-top:105px; text-align:center; width:100%;">
                        <div style="font-weight:900; font-size:0.85rem; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px; display:inline-block; width:85%;">
                            ${p.name.toUpperCase()}
                        </div>
                    </div>

                    <div class="card-stats-grid" style="margin-top:10px; padding:0 15px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2px 10px; font-size:0.65rem;">
                            <div style="display:flex; justify-content:space-between;"><span>PAC</span> <b style="color:var(--neon-green);">${p.pac || 50}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>DRI</span> <b style="color:var(--neon-green);">${p.dri || 50}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>SHO</span> <b style="color:var(--neon-green);">${p.sho || 50}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>DEF</span> <b style="color:var(--neon-green);">${p.def || 50}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>PAS</span> <b style="color:var(--neon-green);">${p.pas || 50}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>PHY</span> <b style="color:var(--neon-green);">${p.phy || 50}</b></div>
                        </div>
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
            <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:20px;">STATS ANPASSEN</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; color:#fff;">
                <div>
                    <label style="font-size:0.6rem; color:#666;">NAME</label>
                    <input type="text" id="edit-name" value="${player.name}" class="pro-textarea" style="margin-top:5px;">
                </div>
                <div>
                    <label style="font-size:0.6rem; color:#666;">POSITION</label>
                    <input type="text" id="edit-pos" value="${player.pos}" class="pro-textarea" style="margin-top:5px;">
                </div>
                ${['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(stat => `
                    <div>
                        <label style="font-size:0.6rem; color:#666;">${stat.toUpperCase()}</label>
                        <input type="number" id="edit-${stat}" value="${player[stat] || 50}" class="pro-textarea" style="margin-top:5px;">
                    </div>
                `).join('')}
            </div>
            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:1;" onclick="window.SektorSporttasche.savePlayer(${player.id})">SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('player-edit-modal').classList.add('hidden')">ABBRECHEN</button>
            </div>
        `;
    },

    savePlayer(id) {
        const player = window.Database.players.find(p => p.id == id);
        if (player) {
            player.name = document.getElementById('edit-name').value;
            player.pos = document.getElementById('edit-pos').value;
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
            
            if(window.ToniVoice) window.ToniVoice.speak("Werte für " + player.name + " wurden im System aktualisiert.");
        }
    }
};
