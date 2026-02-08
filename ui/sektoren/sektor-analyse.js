/**
 * TONI 2.0 - SEKTOR ANALYSE (PRO-EDITION)
 * Visualisierung als FIFA-Elite-Cards & Deep-Body-Analytics Overlay.
 */

window.SektorAnalyse = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px;">LIVE-ANALYSE (VITALDATEN)</h2>
                <p style="color: var(--text-dim);">Echtzeit-Daten der Sportuhren & Bio-Impedanz-Analyse</p>
            </div>
            
            <div class="fifa-cards-grid" id="analysis-grid"></div>

            <div id="analysis-detail-view" class="analysis-detail-view"></div>

            <div style="text-align: center; margin-top: 40px; padding-bottom: 40px;">
                <button class="pro-btn-gold" style="width: 250px;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('analysis-grid');
        const players = window.Database ? window.Database.players : [];

        if (players.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-dim);">Keine Spielerdaten im System gefunden.</p>`;
            return;
        }

        grid.innerHTML = players.map((player, idx) => {
            // Live-Simulation der Uhren-Daten
            const pulse = Math.floor(Math.random() * (165 - 110) + 110);
            const water = Math.floor(Math.random() * (72 - 62) + 62);
            const energy = Math.floor(Math.random() * (100 - 45) + 45);

            return `
                <div class="fifa-card home-team fadeIn" onclick="window.SektorAnalyse.showDetails(${idx})">
                    <div class="card-inner">
                        <div class="rating">${player.rating || '80'}</div>
                        <i class="fas fa-heartbeat card-pulse-icon"></i>

                        <div style="margin-top: 35px; text-align: center;">
                            <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.05); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(57, 255, 20, 0.2);">
                                <i class="fas fa-user-ninja" style="font-size: 1.8rem; color: var(--neon-green);"></i>
                            </div>
                            <div style="font-weight: 900; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px;">
                                ${player.name}
                            </div>
                            <div style="font-size: 0.6rem; color: var(--data-cyan);">${player.pos || 'PRO'}</div>
                        </div>

                        <div class="vital-bar-container">
                            <div class="card-stats-grid">
                                <div class="stat-item">PULS <span class="stat-val">${pulse}</span></div>
                                <div class="stat-item">H2O <span class="stat-val">${water}%</span></div>
                                <div class="stat-item">ENG <span class="stat-val">${energy}%</span></div>
                                <div class="stat-item">FIT <span class="stat-val">OK</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    showDetails(idx) {
        const player = window.Database.players[idx];
        const detailView = document.getElementById('analysis-detail-view');
        if (!detailView) return;

        // Simulierte Körperanalyse-Werte
        const bodyFat = (Math.random() * (14 - 8) + 8).toFixed(1);
        const muscle = (Math.random() * (45 - 38) + 38).toFixed(1);
        const bone = (Math.random() * (4 - 2.5) + 2.5).toFixed(1);
        const kcal = Math.floor(Math.random() * (2800 - 2200) + 2200);

        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <h2 style="color:var(--neon-green); letter-spacing:3px;">BIOMETRISCHER SCAN: ${player.name.toUpperCase()}</h2>
                <button class="tactic-btn" onclick="window.SektorAnalyse.closeDetails()">SCHLIESSEN</button>
            </div>

            <div class="detail-grid">
                <div class="body-data-card">
                    <i class="fas fa-percentage"></i>
                    <span class="data-value" style="color:var(--status-error);">${bodyFat}%</span>
                    <span class="data-label">Körperfettanteil</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-dumbbell"></i>
                    <span class="data-value" style="color:var(--neon-green);">${muscle}kg</span>
                    <span class="data-label">Muskelmasse</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-tint"></i>
                    <span class="data-value" style="color:var(--data-cyan);">64.2%</span>
                    <span class="data-label">Gesamtkörperwasser</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-fire"></i>
                    <span class="data-value">${kcal}</span>
                    <span class="data-label">Grundumsatz (kcal)</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-bone"></i>
                    <span class="data-value">${bone}kg</span>
                    <span class="data-label">Knochenmasse</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-clock"></i>
                    <span class="data-value">21</span>
                    <span class="data-label">Stoffwechselalter</span>
                </div>
            </div>

            <div style="margin-top:50px; padding:30px; background:rgba(255,255,255,0.02); border-radius:15px; border-left:5px solid var(--accent-gold);">
                <h4 style="color:var(--accent-gold); margin-bottom:10px;">TONI'S PERFORMANCE-CHECK</h4>
                <p style="color:#ccc; font-size:0.9rem; line-height:1.6;">
                    Coach, der Körperfettwert von ${bodyFat}% ist für einen ${player.pos}-Spieler in der aktuellen Saisonphase absolut im Elite-Bereich. 
                    Der Fokus im Training sollte jetzt auf der Explosivität liegen, da die Regenerationswerte (Energie) stabil bei über 80% liegen.
                </p>
            </div>
        `;
        detailView.style.display = 'block';
    },

    closeDetails() {
        document.getElementById('analysis-detail-view').style.display = 'none';
    }
};
