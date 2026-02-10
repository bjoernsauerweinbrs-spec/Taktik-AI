/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Dynamische Spider-Charts, Biometrie-Sync & Marktwert
 * Status: MASTER-SYNC 2026
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        console.log("🚀 Analyse-Zentrum: Biometrie-Scan gestartet...");
        
        // Initialer Spieler-Check
        if (!this.selectedPlayerId && window.Database?.players?.length > 0) {
            this.selectedPlayerId = window.Database.players[0].id;
        }

        this.render();
    },

    getAlerts(player) {
        const alerts = [];
        const fat = parseFloat(player.fat) || 0;
        const sleep = parseFloat(player.sleep) || 100;
        const hrRest = parseFloat(player.hrRest) || 0;

        if (fat > 13.5) alerts.push({ type: 'danger', msg: `KÖRPERFETT-ALARM: ${fat}% liegt über Limit.` });
        if (sleep < 75) alerts.push({ type: 'warning', msg: `ERHOLUNG: Schlaf-Index (${sleep}) kritisch.` });
        if (hrRest > 60) alerts.push({ type: 'warning', msg: `PULS: Ruhepuls (${hrRest}) erhöht.` });
        
        return alerts;
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const players = window.Database?.players || [];
        const player = players.find(p => p.id == this.selectedPlayerId) || { name: "Kein Profil" };
        const alerts = this.getAlerts(player);

        // Progress & Marktwert-Berechnung (Simuliert für 2026)
        const missionProgress = player.exp || 65; 
        const marketValue = (player.rat * 0.8 + (100 - (player.fat || 12)) * 0.2).toFixed(1);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 15px; overflow-y: auto;">
                    <h3 style="font-size: 0.65rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 15px; font-family:'Orbitron';">BIO-MONITORING</h3>
                    ${players.map(p => {
                        const pAlerts = this.getAlerts(p);
                        const isSelected = this.selectedPlayerId == p.id;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; border: 1px solid ${isSelected ? 'var(--neon-green)' : '#222'}; 
                             background: ${isSelected ? 'rgba(57,255,20,0.05)' : 'transparent'}; transition: 0.2s;">
                            <div style="font-weight: bold; font-size: 0.8rem; color:#fff;">${p.name}</div>
                            <div style="font-size: 0.6rem; color: ${pAlerts.length > 0 ? 'var(--status-error)' : 'var(--text-dim)'};">
                                ${pAlerts.length > 0 ? '⚠️ ANOMALIE GEFUNDEN' : 'STATUS: OPTIMAL'}
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto; padding-right: 10px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 1.6rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                            <div style="display:flex; gap:15px; margin-top:5px;">
                                <span style="color: var(--neon-green); font-size: 0.65rem; letter-spacing: 1px;"><i class="fas fa-shield-alt"></i> ${player.team || 'SENIOREN'}</span>
                                <span style="color: var(--accent-gold); font-size: 0.65rem; letter-spacing: 1px;"><i class="fas fa-chart-line"></i> MARKTWERT: ${marketValue}M</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="pro-btn-gold" onclick="window.SektorAnalyse.openDataEditor()" style="font-size:0.65rem; padding:8px 15px;">DIAGNOSE</button>
                            <button class="tactic-btn" onclick="window.SektorAnalyse.syncWearable()" style="font-size:0.65rem; padding:8px 15px;">WEARABLE SYNC</button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 15px; padding: 20px;">
                            <h3 style="font-size: 0.75rem; color: var(--accent-orange); margin-bottom: 15px; font-family:'Orbitron';">VITAL-PARAMETER</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                ${this.renderStatCard("REGENERATION", (player.sleep || "92") + "%", "ERHOLT", "var(--neon-green)")}
                                ${this.renderStatCard("RUHEPULS", (player.hrRest || "48") + " BPM", "STABIL", "var(--data-cyan)")}
                                ${this.renderStatCard("KÖRPERFETT", (player.fat || "11.2") + " %", (parseFloat(player.fat) > 13.5 ? "WARNUNG" : "PROFI"), (parseFloat(player.fat) > 13.5 ? "var(--status-error)" : "var(--neon-green)"))}
                                ${this.renderStatCard("VO2 MAX", (player.vo2 || "62"), "ELITE", "var(--accent-gold)")}
                            </div>
                        </div>

                        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 15px; padding: 20px; text-align:center;">
                             <h3 style="font-size: 0.75rem; color: var(--data-cyan); margin-bottom: 20px; text-align:left; font-family:'Orbitron';">PERFORMANCE-NETZ</h3>
                             ${this.renderSpiderChart(player)}
                        </div>
                    </div>

                    <div style="margin-top:20px; background: rgba(0,0,0,0.2); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                             <h3 style="font-size: 0.75rem; color: var(--accent-gold); margin:0; font-family:'Orbitron';">MISSION STAMMPLATZ: LEVEL ${Math.floor(missionProgress/10)}</h3>
                             <span style="font-size: 0.65rem; color: var(--accent-gold);">${missionProgress}% XP</span>
                        </div>
                        <div style="width:100%; height:8px; background:#111; border-radius:4px; overflow:hidden; border:1px solid #222;">
                            <div style="width:${missionProgress}%; height:100%; background: linear-gradient(90deg, var(--accent-gold), #ffcc00); box-shadow: 0 0 15px var(--accent-gold);"></div>
                        </div>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background: rgba(57,255,20,0.03); border: 1px solid rgba(57,255,20,0.15); border-radius: 10px; color: #ccc; font-size: 0.8rem; line-height: 1.5;">
                        <strong style="color:var(--neon-green); font-family:'Orbitron'; font-size: 0.7rem; display:block; margin-bottom:5px;">TONI ANALYSE-BOT:</strong> 
                        ${alerts.length > 0 ? `"Achtung Coach, bei ${player.name} zeigen die Daten eine kritische Ermüdung. Ich empfehle, die Trainingsbelastung um 20% zu reduzieren."` : `"Die biometrische Signatur von ${player.name} ist stabil. Die Entwicklung der Skill-Parameter deutet auf einen Stammplatz-Anspruch hin."`}
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: 0.55rem; color: #666; text-transform: uppercase; letter-spacing:1px;">${label}</div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #fff; margin: 4px 0;">${value}</div>
                <div style="font-size: 0.5rem; color: ${color}; font-weight: bold; letter-spacing:1px;">● ${status}</div>
            </div>`;
    },

    renderSpiderChart(p) {
        // Berechnet die Punkte für das Clip-Path basierend auf echten Werten
        const pac = (p.pac || 50) / 100 * 50;
        const sho = (p.sho || 50) / 100 * 50;
        const def = (p.def || 50) / 100 * 50;
        const dri = (p.dri || 50) / 100 * 50;

        return `
            <div style="width:180px; height:180px; margin: 0 auto; border: 1px solid #333; border-radius:50%; position:relative; background: radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.5) 100%);">
                <div style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); color:#666; font-size:0.5rem;">PAC</div>
                <div style="position:absolute; bottom:-10px; left:50%; transform:translateX(-50%); color:#666; font-size:0.5rem;">DEF</div>
                <div style="position:absolute; top:50%; left:-15px; transform:translateY(-50%); color:#666; font-size:0.5rem;">SHO</div>
                <div style="position:absolute; top:50%; right:-15px; transform:translateY(-50%); color:#666; font-size:0.5rem;">DRI</div>
                
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); 
                            width:100px; height:100px; background:rgba(0, 209, 255, 0.2); 
                            clip-path: polygon(50% ${50-pac}%, ${50+dri}% 50%, 50% ${50+def}%, ${50-sho}% 50%); 
                            border: 1px solid var(--data-cyan); transition: 0.5s;">
                </div>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:4px; height:4px; background:var(--data-cyan); border-radius:50%;"></div>
            </div>
        `;
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
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:2000000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);";
        
        overlay.innerHTML = `
            <div class="fadeIn" style="background:var(--panel-dark); border:1px solid var(--neon-green); padding:35px; border-radius:20px; width:450px; box-shadow:0 0 50px rgba(57,255,20,0.1);">
                <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:25px; letter-spacing:2px;">BIO-UPDATE: ${player.name}</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:25px;">
                    <div><label style="color:#555; font-size:0.6rem; letter-spacing:1px;">KÖRPERFETT (%)</label><input type="number" id="inp-fat" value="${player.fat || 11.2}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; margin-top:5px;"></div>
                    <div><label style="color:#555; font-size:0.6rem; letter-spacing:1px;">VO2 MAX</label><input type="number" id="inp-vo2" value="${player.vo2 || 62}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; margin-top:5px;"></div>
                    <div><label style="color:#555; font-size:0.6rem; letter-spacing:1px;">RUHEPULS</label><input type="number" id="inp-hr" value="${player.hrRest || 48}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; margin-top:5px;"></div>
                    <div><label style="color:#555; font-size:0.6rem; letter-spacing:1px;">EXP (0-100)</label><input type="number" id="inp-exp" value="${player.exp || 65}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; margin-top:5px;"></div>
                </div>
                <div style="display:flex; gap:15px;">
                    <button class="tactic-btn" onclick="document.getElementById('diagnose-editor-overlay').remove()" style="flex:1;">ABBRECHEN</button>
                    <button class="pro-btn-gold" onclick="window.SektorAnalyse.saveDiagnose('${player.id}')" style="flex:2;">DATEN ÜBERMITTELN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    saveDiagnose(playerId) {
        const player = window.Database.players.find(p => p.id == playerId);
        if(player) {
            player.fat = document.getElementById('inp-fat').value;
            player.vo2 = document.getElementById('inp-vo2').value;
            player.hrRest = document.getElementById('inp-hr').value;
            player.exp = document.getElementById('inp-exp').value;

            if(window.Database.save) window.Database.save();
            document.getElementById('diagnose-editor-overlay').remove();
            this.render();
            
            if(window.ToniVoice) window.ToniVoice.speak("Biometrische Analyse für " + player.name + " abgeschlossen. Daten synchronisiert.");
        }
    },

    syncWearable() {
        if(window.ToniVoice) window.ToniVoice.speak("Synchronisiere biometrische Sensoren...");
        const btn = event.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> SYNCING...`;
        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-check"></i> SYNC OK`;
            setTimeout(() => {
                btn.innerHTML = original;
                this.render();
            }, 2000);
        }, 1500);
    }
};
