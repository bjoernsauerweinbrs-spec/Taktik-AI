/**
 * SEKTOR: KABINE (SPORTTASCHE)
 * FIFA-Karten System
 */
window.SektorSporttasche = {
    players: [
        { name: "Spieler 1", rat: 85, pos: "ST", pac: 90, sho: 88, pas: 78, dri: 84, def: 30, phy: 75, status: "Top-Form" },
        // Hier können per DB-Anbindung 50+ Spieler geladen werden
    ],

    open() {
        const content = document.getElementById('active-content');
        let html = `
            <div class="kabine-header">
                <h2>KABINE: TEAM-MANAGEMENT</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">Zurück</button>
                <button class="pro-btn" style="width: auto; margin-left:10px;">+ NEUER SPIELER</button>
            </div>
            <div class="fifa-cards-grid">
        `;

        this.players.forEach(p => {
            html += `
                <div class="fifa-card active">
                    <div class="presence-toggle on"></div>
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="rating">${p.rat}</span>
                            <span class="position">${p.pos}</span>
                        </div>
                        <div class="player-img"><i class="fas fa-user-circle"></i></div>
                        <div class="player-name">${p.name}</div>
                        <div class="player-stats">
                            <span>PAC ${p.pac}</span><span>SHO ${p.sho}</span><span>PAS ${p.pas}</span>
                        </div>
                        <div class="status-ribbon">${p.status}</div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        content.innerHTML = html;
    }
};
