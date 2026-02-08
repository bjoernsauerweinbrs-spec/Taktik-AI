/**
 * TONI 2.0 - SEKTOR ANALYSE (DATA-ENTRY PRO)
 * Fokus: Manuelle Eingabe von Körperdaten & Clipping-Fix.
 */
window.SektorAnalyse = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Fix: Padding unten hinzufügen, damit nichts abgeschnitten wird
        content.style.paddingBottom = "100px";

        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px; border-bottom: 1px solid rgba(57, 255, 20, 0.2); padding-bottom: 20px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase;">BIOMETRISCHE ANALYSE</h2>
                <p style="color: var(--text-dim); font-size: 0.7rem;">MANUELLE DATENERFASSUNG & VITAL-CHECK</p>
            </div>
            
            <div class="fifa-cards-grid" id="analysis-grid"></div>

            <div id="analysis-detail-view" class="analysis-detail-view" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:var(--bg-deep); z-index:100; padding:40px; border-radius:24px;"></div>

            <div style="text-align: center; margin-top: 50px;">
                <button class="pro-btn-gold" style="width: 250px;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('analysis-grid');
        const players = window.Database ? window.Database.players : [];

        if (players.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-dim); text-align:center; width:100%;">Keine Spieler im Kader gefunden.</p>`;
            return;
        }

        grid.innerHTML = players.map((p, idx) => {
            // Stats aus Database oder Fallback
            const pulse = p.pulse || "--";
            const energy = p.energy || "100";
            
            return `
                <div class="fifa-card fadeIn" onclick="window.SektorAnalyse.showDetails(${idx})">
                    <div class="card-inner">
                        <div class="rating">${p.rat || '80'}</div>
                        <i class="fas fa-heartbeat" style="position:absolute; top:25px; right:20px; color:var(--status-error); font-size:1.2rem;"></i>

                        <div style="margin-top: 30px; text-align: center;">
                            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.03); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(57, 255, 20, 0.1);">
                                <i class="fas fa-user-shield" style="font-size: 1.5rem; color: var(--neon-green);"></i>
                            </div>
                            <div style="font-weight: bold; text-transform: uppercase; font-size: 0.8rem;">${p.name}</div>
                            <div style="font-size: 0.6rem; color: var(--data-cyan);">${p.pos}</div>
                        </div>

                        <div class="vital-bar-container" style="margin-top:20px;">
                            <div class="card-stats-grid">
                                <div class="stat-item">PULS <span class="stat-val">${pulse}</span></div>
                                <div class="stat-item">ENG <span class="stat-val">${energy}%</span></div>
                                <div class="stat-item">KF <span class="stat-val">${p.bodyFat || '--'}%</span></div>
                                <div class="stat-item">STATUS <span class="stat-val" style="color:var(--status-fit);">FIT</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    showDetails(idx) {
        const p = window.Database.players[idx];
        const detailView = document.getElementById('analysis-detail-view');
        
        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing:3px; margin-bottom:5px;">${p.name.toUpperCase()}</h2>
                    <span style="color:#666; font-size:0.7rem;">MANUELLE DATENEINGABE</span>
                </div>
                <button class="tactic-btn" onclick="window.SektorAnalyse.closeDetails()">SPEICHERN & SCHLIESSEN</button>
            </div>

            <div class="detail-grid">
                <div class="body-data-card">
                    <i class="fas fa-percentage"></i>
                    <input type="number" step="0.1" class="editable-val" value="${p.bodyFat || 10.5}" onchange="window.updateBodyStats(${p.id}, 'bodyFat', this.value)">
                    <span class="data-label">Körperfett (%)</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-dumbbell"></i>
                    <input type="number" step="0.1" class="editable-val" value="${p.muscleMass || 42.0}" onchange="window.updateBodyStats(${p.id}, 'muscleMass', this.value)">
                    <span class="data-label">Muskelmasse (kg)</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-tint"></i>
                    <input type="number" step="0.1" class="editable-val" value="${p.water || 64.0}" onchange="window.updateBodyStats(${p.id}, 'water', this.value)">
                    <span class="data-label">Wasseranteil (%)</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-bone"></i>
                    <input type="number" step="0.1" class="editable-val" value="${p.boneMass || 3.2}" onchange="window.updateBodyStats(${p.id}, 'boneMass', this.value)">
                    <span class="data-label">Knochenmasse (kg)</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-fire"></i>
                    <input type="number" class="editable-val" value="${p.kcal || 2400}" onchange="window.updateBodyStats(${p.id}, 'kcal', this.value)">
                    <span class="data-label">Grundumsatz (kcal)</span>
                </div>
                <div class="body-data-card">
                    <i class="fas fa-history"></i>
                    <input type="number" class="editable-val" value="${p.metabolicAge || 20}" onchange="window.updateBodyStats(${p.id}, 'metabolicAge', this.value)">
                    <span class="data-label">Stoffwechselalter</span>
                </div>
            </div>

            <div style="margin-top:40px; padding:25px; background:rgba(57, 255, 20, 0.05); border-radius:15px; border-left:5px solid var(--neon-green);">
                <h4 style="color:var(--neon-green); margin-bottom:10px;"><i class="fas fa-robot"></i> TONI'S ANALYSE-KOMMENTAR</h4>
                <p style="color:#ccc; font-size:0.85rem; line-height:1.5;">
                    Coach, sobald du die Werte oben änderst, passe ich meine Trainingsempfehlungen für ${p.name} an. 
                    Ein Körperfettwert unter 12% signalisiert Top-Fitness für einen Spieler auf der Position ${p.pos}.
                </p>
            </div>
        `;
        detailView.style.display = 'block';
    },

    closeDetails() {
        document.getElementById('analysis-detail-view').style.display = 'none';
        this.renderCards(); // Cards aktualisieren mit neuen Werten
    }
};
