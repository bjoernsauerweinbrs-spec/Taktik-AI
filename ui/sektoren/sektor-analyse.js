/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Biometrie-Sync, BMI-Kalkulation & Physis-Index
 * Status: MASTER-SYNC 2026 - FINAL RECOVERY
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        console.log("🧬 Performance-Hub: Initialisiere Biometrie-Monitoring...");
        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        
        if (!this.selectedPlayerId && players.length > 0) {
            this.selectedPlayerId = players[0].id;
        }
        this.render();
    },

    getFilteredPlayers(team) {
        if (!window.Database?.players) return [];
        return window.Database.players.filter(p => {
            if (team === "Senioren") return p.team === "Senioren";
            return p.jugend === team;
        });
    },

    calculateBMI(height, weight) {
        if (!height || !weight) return "---";
        const hMeter = height / 100;
        return (weight / (hMeter * hMeter)).toFixed(1);
    },

    /**
     * Errechnet einen Performance-Index (0-100) basierend auf 
     * VO2 Max, Körperfett und BMI-Stabilität.
     */
    calculatePhysisIndex(p) {
        const vo2 = parseFloat(p.vo2) || 50;
        const fat = parseFloat(p.fat) || 12;
        const bmi = parseFloat(this.calculateBMI(p.height, p.weight)) || 22;

        // Gewichtung: VO2 Max (50%), Körperfett (30%), BMI-Optimum (20%)
        let score = (vo2 / 70) * 50; 
        score += (1 - (fat / 25)) * 30;
        const bmiDiff = Math.abs(22 - bmi);
        score += (1 - (bmiDiff / 10)) * 20;

        return Math.min(100, Math.max(0, Math.round(score)));
    },

    getAlerts(player) {
        const alerts = [];
        const fat = parseFloat(player.fat) || 0;
        const bmi = parseFloat(this.calculateBMI(player.height, player.weight));

        if (fat > 13.5) alerts.push({ type: 'danger', msg: `FETT-ALARM: ${fat}%` });
        if (bmi > 26) alerts.push({ type: 'warning', msg: `BMI-ALARM: ${bmi}` });
        if (parseFloat(player.hrRest) > 60) alerts.push({ type: 'warning', msg: `PULS-ALARM: ${player.hrRest} BPM` });
        
        return alerts;
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        const player = players.find(p => p.id == this.selectedPlayerId) || players[0] || { name: "KEIN PROFIL", rat: 50 };
        
        const alerts = this.getAlerts(player);
        const bmi = this.calculateBMI(player.height, player.weight);
        const pIndex = this.calculatePhysisIndex(player);
        const marketValue = (player.rat * 0.75 + (100 - (player.fat || 12)) * 0.25).toFixed(1);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 15px; overflow-y: auto;">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-LISTE: ${team.toUpperCase()}</h3>
                    ${players.map(p => {
                        const pAlerts = this.getAlerts(p);
                        const isSelected = this.selectedPlayerId == p.id;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 10px; cursor: pointer; border: 1px solid ${isSelected ? 'var(--data-cyan)' : '#222'}; 
                             background: ${isSelected ? 'rgba(0,209,255,0.05)' : 'transparent'}; transition: 0.3s;">
                            <div style="font-weight: 900; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; color: ${pAlerts.length > 0 ? 'var(--status-error)' : '#666'};">
                                BMI: ${this.calculateBMI(p.height, p.weight)} | ${pAlerts.length > 0 ? '⚠️ CHECK' : 'OK'}
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 2rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                            <div style="display:flex; gap:20px; margin-top:8px;">
                                <span style="color: var(--accent-gold); font-size: 0.6rem; font-family:'Orbitron';">PHYSIS-INDEX: ${pIndex}/100</span>
                                <span style="color: var(--data-cyan); font-size: 0.6rem; font-family:'Orbitron';">EST. VALUE: ${marketValue}M</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="pro-btn-gold" onclick="window.SektorAnalyse.openDataEditor()">DIAGNOSE-UPDATE</button>
                            <button class="tactic-btn" onclick="window.SektorAnalyse.syncWearable()" style="border-color:var(--data-cyan); color:var(--data-cyan);">SYNC</button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            ${this.renderStatCard("BMI (BODY-MASS)", bmi, (bmi > 25 ? "ERHÖHT" : "OPTIMAL"), (bmi > 25 ? "var(--status-error)" : "var(--neon-green)"))}
                            ${this.renderStatCard("KÖRPERFETT", (player.fat || "11") + "%", "ATHLETIC", "var(--neon-green)")}
                            ${this.renderStatCard("GRÖSSE", (player.height || "---") + " CM", "STATUR", "#fff")}
                            ${this.renderStatCard("GEWICHT", (player.weight || "---") + " KG", "MASSE", "#fff")}
                            ${this.renderStatCard("VO2 MAX", (player.vo2 || "60"), "ELITE", "var(--accent-gold)")}
                            ${this.renderStatCard("RUHEPULS", (player.hrRest || "50"), "STABIL", "var(--data-cyan)")}
                        </div>

                        <div style="background: rgba(255,255,255,0.01); border: 1px solid #222; border-radius: 15px; padding: 25px; text-align:center;">
                             <h3 style="font-size: 0.65rem; color: var(--data-cyan); margin-bottom: 25px; text-align:left; font-family:'Orbitron';">LEISTUNGS-VEKTOR</h3>
                             ${this.renderSpiderChart(player)}
                        </div>
                    </div>

                    <div style="margin-top:25px; background: rgba(0,0,0,0.4); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                             <h3 style="font-size: 0.7rem; color: var(--accent-gold); margin:0; font-family:'Orbitron';">ENTWICKLUNGS-XP</h3>
                             <span style="font-size: 0.65rem; color: var(--accent-gold); font-family:'Orbitron';">${player.exp || 0}%</span>
                        </div>
                        <div style="width:100%; height:8px; background:#111; border-radius:4px; overflow:hidden;">
                            <div style="width:${player.exp || 0}%; height:100%; background: var(--accent-gold); box-shadow: 0 0 15px var(--accent-gold);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 12px; border: 1px solid #222; border-top: 2px solid ${color};">
                <div style="font-size: 0.5rem; color: #666; font-family:'Orbitron'; text-transform:uppercase;">${label}</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 4px 0; font-family:'Orbitron';">${value}</div>
                <div style="font-size: 0.5rem; color: ${color}; font-weight: bold;">● ${status}</div>
            </div>`;
    },

    renderSpiderChart(p) {
        const pac = ((p.pac || 50) / 100) * 80;
        const sho = ((p.sho || 50) / 100) * 80;
        const def = ((p.def || 50) / 100) * 80;
        const dri = ((p.dri || 50) / 100) * 80;
        return `
            <div style="width:200px; height:200px; margin: 0 auto; border: 1px dashed #333; border-radius:50%; position:relative;">
                <svg width="200" height="200" style="filter: drop-shadow(0 0 5px var(--data-cyan));">
                    <polygon points="100,${100-pac} ${100+dri},100 100,${100+def} ${100-sho},100" 
                        fill="rgba(0, 209, 255, 0.2)" stroke="var(--data-cyan)" stroke-width="2" />
                </svg>
            </div>`;
    },

    selectPlayer(id) {
        this.selectedPlayerId = id;
        this.render();
    },

    openDataEditor() {
        const player = window.Database.players.find(p => p.id == this.selectedPlayerId);
        if(!player) return;

        const overlay = document.createElement('div');
        overlay.id = "diagnose-editor-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:2000000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px);";
        
        overlay.innerHTML = `
            <div style="background:#0a0a0a; border:1px solid var(--data-cyan); padding:40px; border-radius:20px; width:480px;">
                <h3 style="color:var(--data-cyan); font-family:'Orbitron'; margin-bottom:30px; text-align:center;">UPDATE: ${player.name.toUpperCase()}</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                    <div><label style="color:#666; font-size:0.5rem;">GRÖSSE (cm)</label><input type="number" id="inp-height" value="${player.height || 180}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px;"></div>
                    <div><label style="color:#666; font-size:0.5rem;">GEWICHT (kg)</label><input type="number" id="inp-weight" value="${player.weight || 75}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px;"></div>
                    <div><label style="color:#666; font-size:0.5rem;">FETT (%)</label><input type="number" id="inp-fat" value="${player.fat || 11.2}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px;"></div>
                    <div><label style="color:#666; font-size:0.5rem;">VO2 MAX</label><input type="number" id="inp-vo2" value="${player.vo2 || 62}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px;"></div>
                </div>
                <div style="display:flex; gap:15px; margin-top:30px;">
                    <button class="tactic-btn" onclick="document.getElementById('diagnose-editor-overlay').remove()" style="flex:1;">CANCEL</button>
                    <button class="pro-btn-gold" onclick="window.SektorAnalyse.saveDiagnose('${player.id}')" style="flex:2; background:var(--data-cyan); color:#000; border:none;">SICHERN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    saveDiagnose(playerId) {
        const player = window.Database.players.find(p => p.id == playerId);
        if(player) {
            player.height = document.getElementById('inp-height').value;
            player.weight = document.getElementById('inp-weight').value;
            player.fat = document.getElementById('inp-fat').value;
            player.vo2 = document.getElementById('inp-vo2').value;

            if(window.Database.save) window.Database.save();
            document.getElementById('diagnose-editor-overlay').remove();
            this.render();
            if(window.ToniVoice) window.ToniVoice.speak("Biometrie-Check für " + player.name + " abgeschlossen.");
        }
    },

    syncWearable() {
        if(window.ToniVoice) window.ToniVoice.speak("Synchronisiere biometrische Echtzeitdaten...");
        this.render();
    }
};
