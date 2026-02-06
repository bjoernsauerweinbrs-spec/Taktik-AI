/**
 * TONI 2.0 - SEKTOR: KABINE / SPORTTASCHE
 * Verwaltet die 50+ Spieler, FIFA-Karten und Anwesenheit.
 */
window.SektorSporttasche = {
    
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;

        // Header-Bereich mit Navigation
        let html = `
            <div class="kabine-header">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--neon-green); letter-spacing: 3px;">TEAM-KABINE</h2>
                    <div>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">< i class="fas fa-th"></i> ZENTRALE</button>
                        <button class="pro-btn" style="width: auto; margin-left: 10px;" onclick="alert('Spieler-Editor wird geladen...')">+ SPIELER HINZUFÜGEN</button>
                    </div>
                </div>
                <p style="color: var(--text-dim); font-size: 0.8rem; margin-bottom: 20px;">
                    Klicke auf den Status-Punkt, um Spieler für das Training/Spiel zu aktivieren.
                </p>
            </div>
            <div class="fifa-cards-grid">
        `;

        // Wir holen die Spieler-Daten direkt aus der Database.js
        window.Database.players.forEach(p => {
            const statusClass = p.present ? "active" : "inactive";
            const toggleClass = p.present ? "on" : "off";
            const ribbonText = p.present ? "IM TRAINING" : "ABWESEND";
            
            html += `
                <div class="fifa-card ${statusClass}">
                    <div class="presence-toggle ${toggleClass}" 
                         onclick="window.Database.togglePresence(${p.id}); window.SektorSporttasche.open();" 
                         title="Anwesenheit umschalten">
                    </div>
                    
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="rating">${p.rat}</span>
                            <span class="position">${p.pos}</span>
                        </div>
                        
                        <div class="player-img">
                            <i class="fas fa-user-shield" style="font-size: 3.5rem; color: rgba(255,255,255,0.1);"></i>
                        </div>
                        
                        <div class="player-name">${p.name.toUpperCase()}</div>
                        
                        <div class="player-stats">
                            <div><span>PAC</span><br>${p.pac || 80}</div>
                            <div><span>SHO</span><br>${p.sho || 75}</div>
                            <div><span>PAS</span><br>${p.pas || 82}</div>
                        </div>
                        
                        <div class="status-ribbon">${ribbonText}</div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        content.innerHTML = html;
    }
};
