window.SektorAnalyse = {
    open() {
        const content = document.querySelector('.briefcase-window');
        let html = `
            <div class="kabine-header" style="display:flex; justify-content:space-between;">
                <h2>VITAL-ANALYSE</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
            <div class="analyse-layout" style="display:grid; grid-template-columns: 300px 1fr; gap:20px; margin-top:20px;">
                <div class="player-selection-list" style="max-height:60vh; overflow-y:auto; background:rgba(0,0,0,0.3); padding:10px;">
                    ${window.Database.players.map(p => `
                        <div class="analyse-player-item" onclick="window.SektorAnalyse.showDetail(${p.id})" style="padding:10px; border-bottom:1px solid #222; cursor:pointer;">
                            <span class="vitals-indicator ${p.present ? 'online' : 'offline'}"></span> ${p.name}
                        </div>
                    `).join('')}
                </div>
                <div id="analyse-detail" class="analyse-detail-view">
                    <p style="color:var(--text-dim); text-align:center; margin-top:50px;">Wähle einen Spieler für die Vital-Daten-Eingabe.</p>
                </div>
            </div>
        `;
        content.innerHTML = html;
    },
    showDetail(id) {
        const p = window.Database.players.find(x => x.id === id);
        const detail = document.getElementById('analyse-detail');
        detail.innerHTML = `
            <h3>DATEN FÜR: ${p.name}</h3>
            <div class="vitals-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0;">
                <div class="vital-box" onclick="window.SektorAnalyse.updateVital(${p.id}, 'heart')">
                    <span class="vital-val pulse-anim"><i class="fas fa-heartbeat"></i> ${p.heart || 0}</span>
                    <label>PULS (BPM)</label>
                </div>
                <div class="vital-box" onclick="window.SektorAnalyse.updateVital(${p.id}, 'km')">
                    <span class="vital-val">${p.km || 0}</span>
                    <label>DISTANZ (KM)</label>
                </div>
            </div>
            <textarea class="pro-textarea" placeholder="Toni-Analyse: Spieler zeigt stabile Werte..."></textarea>
        `;
    },
    updateVital(id, key) {
        const val = prompt(`Neuer Wert für ${key.toUpperCase()}:`);
        if(val) { window.Database.updatePlayer(id, key, parseFloat(val)); this.showDetail(id); }
    }
};
