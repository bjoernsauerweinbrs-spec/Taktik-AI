/**
 * TONI 2.0 - SEKTOR ANALYSE (PRO VITAL MONITOR)
 * Konsolidierte Version: Verwalte Puls und Laufleistung der Spieler.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Wir holen nur die Spieler, die im aktuellen Modus (Training/Match) dabei sind
        const presentPlayers = window.Database.getPresentPlayers();
        const modeLabel = window.Database.activeMode === 'training' ? 'TRAINING' : 'SPIELBETRIEB';

        content.innerHTML = `
            <div class="kabine-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 3px; margin-bottom:5px;">VITAL-MONITOR</h2>
                    <span style="color: #555; font-size: 0.7rem; letter-spacing: 2px; font-weight: bold;">MODUS: ${modeLabel}</span>
                </div>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="analyse-layout" style="display:grid; grid-template-columns: 280px 1fr; gap:25px; height: 70vh;">
                <div class="player-selection-list" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(57,255,20,0.1); border-radius:15px; overflow-y:auto; padding: 15px;">
                    <h4 style="color: #555; font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 20px; padding-left: 10px;">AKTIVE KADER-EINHEIT</h4>
                    ${presentPlayers.length > 0 ? presentPlayers.map(p => `
                        <div class="analyse-player-item fadeIn" 
                             onclick="window.SektorAnalyse.showDetail(${p.id})" 
                             style="display:flex; align-items:center; gap:12px; padding: 12px; border-bottom: 1px solid #111; cursor:pointer; transition: 0.2s;">
                            <span style="color: var(--neon-green); font-size: 0.8rem; text-shadow: 0 0 10px var(--neon-green);">●</span> 
                            <span style="font-size: 0.9rem; color: #fff">${p.name.toUpperCase()}</span>
                            <span style="margin-left:auto; font-size: 0.6rem; color: #444;">#${p.number}</span>
                        </div>
                    `).join('') : '<p style="color:#444; font-size:0.8rem; text-align:center;">Keine Spieler im aktuellen Modus aktiv.</p>'}
                </div>

                <div id="analyse-detail" style="background: rgba(255,255,255,0.01); border-radius:15px; padding: 40px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
                    <div style="text-align:center; opacity: 0.3;">
                        <i class="fas fa-heartbeat" style="font-size: 4rem; margin-bottom: 20px;"></i>
                        <p>WÄHLE EINEN SPIELER AUS DER LISTE,<br>UM DIE LIVE-DATEN ZU ANALYSIEREN.</p>
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

        // Farbbestimmung für Herzfrequenz (Zonen-Training)
        const heartColor = p.heart > 160 ? '#ff3b30' : (p.heart > 120 ? 'var(--accent-gold)' : 'var(--neon-green)');

        detailZone.style.display = "block";
        detailZone.innerHTML = `
            <div style="animation: fadeIn 0.4s ease;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px;">
                    <div>
                        <h3 style="color: var(--neon-green); font-size: 1.8rem; margin-bottom: 5px;">${p.name} <span style="color:#333; font-size:1.2rem;">#${p.number}</span></h3>
                        <p style="color: var(--accent-gold); font-size: 0.8rem; font-weight: bold; letter-spacing: 2px;">
                            POSITION: ${p.pos} | TEAM: ${p.team === 'A' ? 'HAUPTKADER' : 'LEIBCHEN'}
                        </p>
                    </div>
                    <div style="text-align: right; color: #444; font-family: monospace; font-size: 0.75rem;">
                        ID: TRNR-00${p.id}<br>SCAN-TIME: ${new Date().toLocaleTimeString()}
                    </div>
                </div>

                <div class="vitals-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                    <div class="vital-box" onclick="window.SektorAnalyse.updateValue(${p.id}, 'heart', 'PULS (BPM)')" 
                         style="background:#000; border: 1px solid #222; padding: 35px; border-radius: 20px; text-align:center; cursor:pointer; transition: 0.3s;">
                        <span style="display:block; font-size: 3.5rem; font-weight:900; color: ${heartColor};" class="${p.heart > 140 ? 'pulse-anim' : ''}">
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
                    <div style="color:#aaa; font-size: 0.85rem; line-height:1.6;">
                        ${this.generateAISuggestion(p)}
                    </div>
                </div>
            </div>
        `;
    },

    // Simuliert eine KI-Einschätzung basierend auf den Werten
    generateAISuggestion(p) {
        if (p.heart > 170) return "ACHTUNG: Spieler befindet sich im anaeroben Bereich. Belastung reduzieren oder Auswechslung vorbereiten.";
        if (p.km > 10) return "HOHE LAUFLEISTUNG: Regenerations-Check nach dem Training empfohlen.";
        return "NORMALBEREICH: Spieler zeigt stabile Vitalwerte. Keine taktischen Anpassungen nötig.";
    },

    updateValue(id, key, label) {
        const p = window.Database.players.find(x => x.id === id);
        const val = prompt(`Neuer Wert für ${label}:`, p[key]);
        if (val !== null && val !== "") {
            const finalVal = parseFloat(val);
            if (!isNaN(finalVal)) {
                window.Database.updatePlayer(id, key, finalVal);
                this.showDetail(id);
            }
        }
    }
};
