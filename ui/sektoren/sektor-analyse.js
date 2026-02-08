/**
 * TONI 2.0 - SEKTOR ANALYSE (DATA-ENTRY PRO)
 * Status: STABILISIERT (Auto-Save & Scroll-Fix)
 */
window.SektorAnalyse = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Fix: Genug Platz für die Karten und die untere Navigation
        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";

        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px; border-bottom: 1px solid rgba(57, 255, 20, 0.2); padding-bottom: 20px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase;">BIOMETRISCHE ANALYSE</h2>
                <p style="color: var(--text-dim); font-size: 0.75rem;">MANUELLE DATENERFASSUNG & VITAL-CHECK</p>
            </div>
            
            <div class="fifa-cards-grid" id="analysis-grid"></div>

            <div id="analysis-detail-view" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:var(--bg-deep); z-index:100; padding:40px; border-radius:24px; overflow-y:auto;"></div>

            <div style="text-align: center; margin-top: 50px;">
                <button class="pro-btn-gold" style="width: 250px;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('analysis-grid');
        if (!grid) return;
        const players = window.Database ? window.Database.players : [];

        if (players.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-dim); text-align:center; width:100%;">Keine Spieler im Kader gefunden.</p>`;
            return;
        }

        grid.innerHTML = players.map((p, idx) => {
            const energy = p.energy || "100";
            
            return `
                <div class="fifa-card" onclick="window.SektorAnalyse.showDetails(${idx})">
                    <div class="card-inner">
                        <div class="rating">${p.rat || '80'}</div>
                        <i class="fas fa-heartbeat" style="position:absolute; top:25px; right:20px; color:var(--status-error); font-size:1.2rem;"></i>

                        <div style="margin-top: 30px; text-align: center;">
                            <div style="width: 65px; height: 65px; background: rgba(255,255,255,0.03); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(57, 255, 20, 0.2);">
                                <i class="fas fa-user-shield" style="font-size: 1.8rem; color: var(--neon-green);"></i>
                            </div>
                            <div style="font-weight: bold; text-transform: uppercase; font-size: 0.85rem; color:#fff;">${p.name}</div>
                            <div style="font-size: 0.6rem; color: var(--data-cyan); font-weight:bold;">${p.pos}</div>
                        </div>

                        <div class="vital-bar-container" style="margin-top:20px; width:100%;">
                            <div class="card-stats-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:0.65rem;">
                                <div class="stat-item">PULS <span class="stat-val">${p.pulse || '--'}</span></div>
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
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom: 1px solid #333; padding-bottom:20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing:3px;">${p.name.toUpperCase()}</h2>
                    <span style="color:var(--data-cyan); font-size:0.75rem; font-weight:bold;">DATENSATZ: BIOMETRIE-PROFI</span>
                </div>
                <button class="tactic-btn" style="background:var(--neon-green); color:#000; font-weight:bold;" onclick="window.SektorAnalyse.closeDetails()">SPEICHERN & SCHLIESSEN</button>
            </div>

            <div class="detail-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
                ${this.renderInputCard('percentage', 'bodyFat', 'Körperfett (%)', p.bodyFat || 12.0, p.id)}
                ${this.renderInputCard('dumbbell', 'muscleMass', 'Muskelmasse (kg)', p.muscleMass || 40.0, p.id)}
                ${this.renderInputCard('tint', 'water', 'Wasseranteil (%)', p.water || 60.0, p.id)}
                ${this.renderInputCard('bone', 'boneMass', 'Knochenmasse (kg)', p.boneMass || 3.0, p.id)}
                ${this.renderInputCard('fire', 'kcal', 'Grundumsatz (kcal)', p.kcal || 2200, p.id)}
                ${this.renderInputCard('history', 'metabolicAge', 'Stoffwechselalter', p.metabolicAge || 22, p.id)}
            </div>

            <div style="margin-top:40px; padding:25px; background:rgba(0, 209, 255, 0.05); border-radius:15px; border-left:5px solid var(--data-cyan);">
                <h4 style="color:var(--data-cyan); margin-bottom:10px;"><i class="fas fa-microchip"></i> TONI'S ANALYSE-KOMMENTAR</h4>
                <p id="toni-analysis-text" style="color:#ccc; font-size:0.9rem; line-height:1.6; font-style:italic;">
                    "Coach, ich überwache die Werte von ${p.name}. Eine Änderung der Muskelmasse wird sofort in meine Kraft-Trainingspläne einfließen."
                </p>
            </div>
        `;
        detailView.style.display = 'block';
    },

    renderInputCard(icon, key, label, value, playerId) {
        return `
            <div class="body-data-card" style="background:rgba(255,255,255,0.02); padding:20px; border-radius:15px; border:1px solid #222; text-align:center;">
                <i class="fas fa-${icon}" style="color:var(--neon-green); margin-bottom:10px; font-size:1.2rem;"></i><br>
                <input type="number" step="0.1" 
                    style="background:#000; border:1px solid var(--data-cyan); color:#fff; width:100%; text-align:center; padding:8px; border-radius:8px; font-weight:bold; font-size:1.1rem;" 
                    value="${value}" 
                    onchange="window.SektorAnalyse.updateStat(${playerId}, '${key}', this.value)">
                <span style="display:block; margin-top:10px; font-size:0.7rem; color:#888; text-transform:uppercase;">${label}</span>
            </div>
        `;
    },

    updateStat(playerId, key, value) {
        if (window.Database && window.Database.updatePlayer) {
            window.Database.updatePlayer(playerId, key, parseFloat(value));
            console.log(`Update: Player ${playerId} -> ${key}: ${value}`);
        }
    },

    closeDetails() {
        if (window.Database && window.Database.save) {
            window.Database.save(); // Alles dauerhaft sichern
        }
        document.getElementById('analysis-detail-view').style.display = 'none';
        this.renderCards(); 
        window.ToniVoice.speak("Biometrische Daten wurden aktualisiert und gespeichert.");
    }
};
