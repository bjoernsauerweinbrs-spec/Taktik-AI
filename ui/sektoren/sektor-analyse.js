/**
 * TONI 2.0 - SEKTOR ANALYSE (PRO VITAL MONITOR)
 * Konsolidierte Version: Verwalte Puls und Laufleistung der Spieler.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        content.innerHTML = `
            <div class="kabine-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
                <h2 style="color: var(--neon-green); letter-spacing: 3px;">VITAL-MONITOR</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="analyse-layout" style="display:grid; grid-template-columns: 280px 1fr; gap:25px; height: 70vh;">
                <div class="player-selection-list" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(57,255,20,0.1); border-radius:15px; overflow-y:auto; padding: 15px;">
                    <h4 style="color: #555; font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 20px; padding-left: 10px;">SPIELER-AUSWAHL</h4>
                    ${window.Database.players.map(p => `
                        <div class="analyse-player-item fadeIn" 
                             onclick="window.SektorAnalyse.showDetail(${p.id})" 
                             style="display:flex; align-items:center; gap:12px; padding: 12px; border-bottom: 1px solid #111; cursor:pointer; transition: 0.2s;">
                            <span style="color: ${p.present ? 'var(--neon-green)' : '#444'}; font-size: 0.8rem; text-shadow: ${p.present ? '0 0 10px var(--neon-green)' : 'none'};">●</span> 
                            <span style="font-size: 0.9rem; color: ${p.present ? '#fff' : '#666'}">${p.name.toUpperCase()}</span>
                        </div>
                    `).join('')}
                </div>

                <div id="analyse-detail" style="background: rgba(255,255,255,0.01); border-radius:15px; padding: 40px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
                    <div style="text-align:center; opacity: 0.3;">
                        <i class="fas fa-heartbeat" style="font-size: 4rem; margin-bottom: 20px;"></i>
                        <p>WÄHLE EINEN SPIELER AUS DER LISTE,<br>UM DIE DATEN ZU BEARBEITEN.</p>
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

        detailZone.style.display = "block";
        detailZone.innerHTML = `
            <div style="animation: fadeIn 0.4s ease;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px;">
                    <div>
                        <h3 style="color: var(--neon-green); font-size: 1.8rem; margin-bottom: 5px;">${p.name}</h3>
                        <p style="color: var(--accent-gold); font-size: 0.8rem; font-weight: bold; letter-spacing: 2px;">
                            POSITION: ${p.pos} | STATUS: ${p.present ? 'AKTIV IM TRAINING' : 'IN DER KABINE'}
                        </p>
                    </div>
                    <div style="text-align: right; color: #444; font-family: monospace; font-size: 0.75rem;">
                        ID: TRNR-00${p.id}<br>SCAN-TIME: ${new Date().toLocaleTimeString()}
                    </div>
                </div>

                <div class="vitals-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                    <div class="vital-box" onclick="window.SektorAnalyse.updateValue(${p.id}, 'heart', 'PULS (BPM)')" 
                         style="background:#000; border: 1px solid #222; padding: 35px; border-radius: 20px; text-align:center; cursor:pointer; transition: 0.3s;">
                        <span style="display:block; font-size: 3.5rem; font-weight:900; color: #ff3b30;" class="pulse-anim">
                            <i class="fas fa-heartbeat"></i> ${p.heart || 0}
                        </span>
                        <label style="font-size: 0.7rem; color: #555; letter-spacing: 3px; margin-top: 15px; display: block;">HERZFREQUENZ (BPM)</label>
                    </div>

                    <div class="vital-box" onclick="window.SektorAnalyse.updateValue(${p.id}, 'km', 'DISTANZ (KM)')" 
                         style="background:#000; border: 1px solid #222; padding: 35px; border-radius: 20px; text-align:center; cursor:pointer; transition: 0.3s;">
                        <span style="display:block; font-size: 3.5rem; font-weight:900; color: var(--data-cyan);">
                            ${p.km || '0.0'}
                        </span>
                        <label style="font-size: 0.7rem; color: #555; letter-spacing: 3px; margin-top: 15px; display: block;">DISTANZ (KM)</label>
                    </div>
                </div>

                <div style="margin-top: 40px; padding: 25px; background: rgba(57, 255, 20, 0.02); border-radius: 15px; border: 1px solid rgba(57, 255, 20, 0.1);">
                    <label style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 2px; font-weight: bold; display: block; margin-bottom: 15px;">
                        <i class="fas fa-microchip"></i> TONI ANALYSE-PROTOKOLL
                    </label>
                    <textarea class="pro-textarea" style="height: 120px; resize: none; border-color: #222;" 
                              placeholder="Trage hier Beobachtungen zur Regeneration oder Belastung ein..."></textarea>
                </div>
            </div>
        `;
    },

    updateValue(id, key, label) {
        const p = window.Database.players.find(x => x.id === id);
        const val = prompt(`Neuer Wert für ${label}:`, p[key]);
        if (val !== null && val !== "") {
            const finalVal = parseFloat(val);
            if (!isNaN(finalVal)) {
                window.Database.updatePlayer(id, key, finalVal);
                this.showDetail(id); // Ansicht mit neuem Wert aktualisieren
            }
        }
    }
};
