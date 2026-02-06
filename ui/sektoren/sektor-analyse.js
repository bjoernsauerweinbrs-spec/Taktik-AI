/**
 * SEKTOR: ANALYSE
 */
window.SektorAnalyse = {
    open() {
        const content = document.getElementById('active-content');
        content.innerHTML = `
            <div class="kabine-header">
                <h2>ANALYSE-LABOR</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">Zurück</button>
            </div>
            <div class="analyse-layout">
                <div class="player-selection-list">
                    <div class="analyse-player-item"><div class="vitals-indicator online"></div> Spieler 1</div>
                    <div class="analyse-player-item"><div class="vitals-indicator offline"></div> Spieler 2</div>
                </div>
                <div class="analyse-detail-view">
                    <h3>Vital-Daten (Manuelle Eingabe)</h3>
                    <div class="vitals-grid">
                        <div class="vital-box"><span class="vital-val pulse-anim"><i class="fas fa-heartbeat"></i> 72</span><label>PULS (BPM)</label></div>
                        <div class="vital-box"><span class="vital-val">6.2</span><label>DISTANZ (KM)</label></div>
                        <div class="vital-box"><span class="vital-val">7.5</span><label>SCHLAF (H)</label></div>
                    </div>
                    <div class="preview-box">
                        <textarea class="pro-textarea" placeholder="Toni-Analyse: Spieler zeigt Ermüdungserscheinungen..."></textarea>
                        <button class="pro-btn-gold" style="margin-top:10px;">DATEN SPEICHERN</button>
                    </div>
                </div>
            </div>
        `;
    }
};
