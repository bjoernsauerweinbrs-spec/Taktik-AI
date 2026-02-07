/**
 * TONI 2.0 - SEKTOR ANALYSE
 * Verwalte Vitaldaten wie Puls und Kilometer für alle Spieler.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Grundlayout mit Spielerliste links und Details rechts
        content.innerHTML = `
            <div class="kabine-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h2 style="color: var(--neon-green); letter-spacing: 3px;">VITAL-ANALYSE</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="analyse-layout" style="display:grid; grid-template-columns: 280px 1fr; gap:20px; height: 70vh;">
                <div class="player-selection-list" style="background: rgba(0,0,0,0.4); border: 1px solid #222; border-radius:10px; overflow-y:auto; padding: 10px;">
                    <h4 style="color: #888; font-size: 0.7rem; margin-bottom: 15px; padding-left: 10px;">SPIELER-AUSWAHL</h4>
                    ${window.Database.players.map(p => `
                        <div class="analyse-player-item" 
                             onclick="window.SektorAnalyse.showDetail(${p.id})" 
                             style="display:flex; align-items:center; gap:10px; padding: 12px; border-bottom: 1px solid #111; cursor:pointer; transition: 0.2s;">
                            <span class="vitals-indicator ${p.present ? 'online' : 'offline'}" style="width:10px; height:10px; border-radius:50%; background: ${p.present ? 'var(--neon-green)' : '#444'}"></span>
                            <span style="font-size: 0.9rem;">${p.name.toUpperCase()}</span>
                        </div>
                    `).join('')}
                </div>

                <div id="analyse-detail" class="analyse-detail-view" style="background: rgba(255,255,255,0.02); border-radius:10px; padding: 30px; border: 1px solid rgba(57, 255, 20, 0.1);">
                    <div style="text-align:center; margin-top:100px; color: #555;">
                        <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <p>Wähle einen Spieler links aus, um Vitalwerte zu bearbeiten.</p>
                    </div>
                </div>
            </div>
        `;
    },

    showDetail(id) {
        this.selectedPlayerId = id;
        const p = window.Database.players.find(x => x.id === id);
        const detailZone = document.getElementById('analyse-detail');
        
        if (!p) return;

        detailZone.innerHTML = `
            <div style="animation: fadeIn 0.4s ease;">
                <h3 style="color: var(--neon-green); margin-bottom: 5px;">${p.name}</h3>
                <p style="color: #666; font-size: 0.8rem; margin-bottom: 30px;">Position: ${p.pos} | Status: ${p.status}</p>

                <div class="vitals-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div class="vital-box" onclick="window.SektorAnalyse.updateValue(${p.id}, 'heart', 'PULS (BPM)')" 
                         style="background:#000; border: 1px solid #333; padding: 25px; border-radius: 12px; text-align:center; cursor:pointer;">
                        <span style="display:block; font-size: 2.5rem; font-weight:bold; color: #ff3b30;" class="pulse-anim">
                            <i class="fas fa-heartbeat"></i> ${p.heart || 0}
                        </span>
                        <label style="font-size: 0.7rem; color: #555; letter-spacing: 2px;">HERZFREQUENZ (BPM)</label>
                    </div>

                    <div class="vital-box" onclick="window.SektorAnalyse.updateValue(${p.id}, 'km', 'DISTANZ (KM)')"
                         style="background:#000; border: 1px solid #333; padding: 25px; border-radius: 12px; text-align:center; cursor:pointer;">
                        <span style="display:block; font-size: 2.5rem; font-weight:bold; color: var(--data-cyan);">
                            ${p.km || '0.0'}
                        </span>
                        <label style="font-size: 0.7rem; color: #555; letter-spacing: 2px;">DISTANZ (KM)</label>
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <label style="color: #444; font-size: 0.7rem;">TONI ANALYSE-PROTOKOLL</label>
                    <textarea class="pro-textarea" style="margin-top:10px; height: 100px;" placeholder="Bemerkungen zum Spieler..."></textarea>
                </div>
            </div>
        `;
    },

    updateValue(id, key, label) {
        const p = window.Database.players.find(x => x.id === id);
        const val = prompt(`Neuer Wert für ${label}:`, p[key]);
        if (val !== null) {
            window.Database.updatePlayer(id, key, parseFloat(val));
            this.showDetail(id); // Ansicht aktualisieren
        }
    }
};
