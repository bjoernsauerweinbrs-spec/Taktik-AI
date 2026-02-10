/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (KABINE / FIFA-CARDS)
 * Status: REPARIERT & KONTROLLIERT
 */
window.SektorSporttasche = {
    
    open() {
        const activeContent = document.getElementById('active-content');
        if (!activeContent) return;

        // Sicherstellen, dass der Bereich für die Karten bereit ist
        this.render();
    },

    render() {
        const activeContent = document.getElementById('active-content');
        const team = window.currentTeamContext || "Senioren";
        
        // Spieler aus der Datenbank filtern
        const players = (window.Database && window.Database.players) 
            ? window.Database.players.filter(p => p.team === team) 
            : [];

        activeContent.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <div>
                        <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin:0;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.7rem; margin-top:5px;">KADER-STÄRKE: ${players.length} SPIELER</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="tactic-btn" style="font-size:0.6rem;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div class="fifa-cards-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: flex-start;">
                    ${players.length > 0 ? players.map(p => this.createCardHTML(p)).join('') : this.renderEmptyState()}
                </div>
            </div>
        `;
    },

    createCardHTML(p) {
        // Optimierte Karte für bessere Lesbarkeit der Werte
        return `
            <div class="fifa-card" style="cursor:pointer;" onclick="console.log('Analyse für ${p.name}')">
                <div class="card-inner">
                    <div style="position:absolute; top:35px; left:22px; text-align:center; line-height:1;">
                        <div style="font-size:1.8rem; font-weight:900; font-family:'Orbitron'; color:#fff;">${p.rat || 50}</div>
                        <div style="font-size:0.7rem; font-weight:bold; color:var(--accent-gold); margin-top:2px;">${p.pos || 'ST'}</div>
                    </div>

                    <div style="margin-top:105px; width:100%; text-align:center;">
                        <div style="font-weight:900; font-size:0.85rem; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px; display:inline-block; width:80%;">
                            ${p.name.toUpperCase()}
                        </div>
                    </div>

                    <div class="card-stats-grid" style="margin-top:10px; font-size:0.65rem;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2px 10px; width:100%; padding:0 15px;">
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

    renderEmptyState() {
        return `
            <div style="width:100%; padding:50px; text-align:center; background:rgba(255,255,255,0.02); border-radius:15px; border:1px dashed #333;">
                <p style="color:#555; font-size:0.8rem;">KEINE SPIELER IM KADER GEFUNDEN.<br>NUTZE DAS TRANSFER-ZENTRUM.</p>
            </div>
        `;
    }
};
