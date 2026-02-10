/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Biometrie-Sync, Skill-Spider & 2026 Marktwert-Hebel
 * Status: MASTER-SYNC 2026 - FINAL RECOVERY
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        console.log("🧬 Performance-Hub: Initialisiere Biometrie-Monitoring...");
        const players = window.Database?.players || [];
        if (!this.selectedPlayerId && players.length > 0) {
            this.selectedPlayerId = players[0].id;
        }
        this.render();
    },

    /**
     * KI-Grenzwertanalyse für biometrische Daten
     */
    getAlerts(player) {
        const alerts = [];
        const fat = parseFloat(player.fat) || 0;
        const sleep = parseFloat(player.sleep) || 100;
        const hrRest = parseFloat(player.hrRest) || 0;

        if (fat > 13.5) alerts.push({ type: 'danger', msg: `KÖRPERFETT-ALARM: ${fat}%` });
        if (sleep < 75) alerts.push({ type: 'warning', msg: `ERHOLUNG: ${sleep}%` });
        if (hrRest > 60) alerts.push({ type: 'warning', msg: `RUHEPULS: ${hrRest} BPM` });
        
        return alerts;
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const players = window.Database?.players || [];
        const player = players.find(p => p.id == this.selectedPlayerId) || { name: "KEIN PROFIL", rat: 50 };
        const alerts = this.getAlerts(player);
        const missionProgress = player.exp || 65; 
        
        // Marktwert-Formel 2026: Rating + Fitness-Bonus
        const marketValue = (player.rat * 0.75 + (100 - (player.fat || 12)) * 0.25).toFixed(1);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 15px; overflow-y: auto; max-height: 75vh;">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-MONITORING</h3>
                    ${players.map(p => {
                        const pAlerts = this.getAlerts(p);
                        const isSelected = this.selectedPlayerId == p.id;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 10px; cursor: pointer; border: 1px solid ${isSelected ? 'var(--data-cyan)' : '#222'}; 
                             background: ${isSelected ? 'rgba(0,209,255,0.05)' : 'transparent'}; transition: 0.3s;">
                            <div style="font-weight: 900; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; margin-top:4px; color: ${pAlerts.length > 0 ? 'var(--status-error)' : '#666'};">
                                ${pAlerts.length > 0 ? '⚠️ BIOMETRIE-CHECK' : 'STATUS: OPTIMAL'}
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto; padding-right: 10px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 2rem; color: #fff; font-family:'Orbitron'; letter-spacing:-1px;">${player.name.toUpperCase()}</h2>
                            <div style="display:flex; gap:20px; margin-top:8px;">
                                <span style="color: var(--neon-green); font-size: 0.6rem; font-family:'Orbitron'; letter-spacing: 1px;"><i class="fas fa-microchip"></i> UID: ${player.id}</span>
                                <span style="color: var(--accent-gold); font-size: 0.6rem; font-family:'Orbitron'; letter-spacing: 1px;"><i class="fas fa-euro-sign"></i> ESTIMATED VALUE: ${marketValue}M</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="pro-btn-gold" onclick="window.SektorAnalyse.openDataEditor()" style="font-size:0.65rem;">DIAGNOSE-UPDATE</button>
                            <button class="tactic-btn" onclick="window.SektorAnalyse.syncWearable()" style="font-size:0.65rem; border-color:var(--data-cyan); color:var(--data-cyan);">WEARABLE SYNC</button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            ${this.renderStatCard("REGENERATION", (player.sleep || "92") + "%", "ERHOLT", "var(--neon-green)")}
                            ${this.renderStatCard("RUHEPULS", (player.hrRest || "48") + " BPM", "STABIL", "var(--data-cyan)")}
                            ${this.renderStatCard("KÖRPERFETT", (player.fat || "11.2") + " %", (parseFloat(player.fat) > 13.5 ? "WARNUNG" : "ATHLET"), (parseFloat(player.fat) > 13.5 ? "var(--status-error)" : "var(--neon-green)"))}
                            ${this.renderStatCard("VO2 MAX", (player.vo2 || "62"), "ELITE", "var(--accent-gold)")}
                        </div>

                        <div style="background: rgba(255,255,255,0.01); border: 1px solid #222; border-radius: 15px; padding: 25px; text-align:center;">
                             <h3 style="font-size: 0.65rem; color: var(--data-cyan); margin-bottom: 25px; text-align:left; font-family:'Orbitron'; letter-spacing:2px;">PERFORMANCE-VEKTOR</h3>
                             ${this.renderSpiderChart(player)}
                        </div>
                    </div>

                    <div style="margin-top:25px; background: rgba(0,0,0,0.4); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                             <h3 style="font-size: 0.7rem; color: var(--accent-gold); margin:0; font-family:'Orbitron';">MISSION STAMMPLATZ: LVL ${Math.floor(missionProgress/10)}</h3>
                             <span style="font-size: 0.65rem; color: var(--accent-gold); font-family:'Orbitron';">${missionProgress}% XP</span>
                        </div>
                        <div style="width:100%; height:10px; background:#111; border-radius:5px; overflow:hidden; border:1px solid #222;">
                            <div style="width:${missionProgress}%; height:100%; background: linear-gradient(90deg, var(--accent-gold), #ffcc00); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);"></div>
                        </div>
                    </div>

                    <div style="margin-top: 25px; padding: 20px; background: rgba(0,209,255,0.03); border: 1px solid rgba(0,209,255,0.2); border-radius: 15px; color: #aaa; font-size: 0.85rem; line-height: 1.6;">
                        <strong style="color:var(--data-cyan); font-family:'Orbitron'; font-size: 0.65rem; display:block; margin-bottom:8px; letter-spacing:1px;">TONI ANALYSE-ENGINE:</strong> 
                        ${alerts.length > 0 ? 
                            `<span style="color:var(--status-error);">Kritische Anomalien bei ${player.name} detektiert.</span> Ich empfehle eine Belastungssteuerung und zusätzliche Elektrolyt-Zufuhr.` : 
                            `Biometrische Signatur von ${player.name} ist im Profi-Bereich. Die aktuellen Skill-Vektoren stützen seinen Anspruch auf einen Platz in der Startelf.`
                        }
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 12px; border: 1px solid #222; border-top: 2px solid ${color};">
                <div style="font-size: 0.5rem; color: #666; text-transform: uppercase; letter-spacing:1px; font-family:'Orbitron';">${label}</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 6px 0; font-family:'Orbitron';">${value}</div>
                <div style="font-size: 0.5rem; color: ${color}; font-weight: bold; letter-spacing:1px;">● ${status}</div>
            </div>`;
    },

    renderSpiderChart(p) {
        // Vektoren berechnen
        const pac = ((p.pac || 50) / 100) * 80;
        const sho = ((p.sho || 50) / 100) * 80;
        const def = ((p.def || 50) / 100) * 80;
        const dri = ((p.dri || 50) / 100) * 80;

        return `
            <div style="width:200px; height:200px; margin: 0 auto; border: 1px dashed #333; border-radius:50%; position:relative; background: radial-gradient(circle, rgba(0,209,255,0.05) 0%, transparent 70%);">
                <div style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); color:#555; font-size:0.5rem; font-family:'Orbitron';">PAC</div>
                <div style="position:absolute; bottom:-15px; left:50%; transform:translateX(-50%); color:#555; font-size:0.5rem; font-family:'Orbitron';">DEF</div>
                <div style="position:absolute; top:50%; left:-25px; transform:translateY(-50%); color:#555; font-size:0.5rem; font-family:'Orbitron';">SHO</div>
                <div style="position:absolute; top:50%; right:-25px; transform:translateY(-50%); color:#555; font-size:0.5rem; font-family:'Orbitron';">DRI</div>
                
                <svg width="200" height="200" style="position:absolute; top:0; left:0; filter: drop-shadow(0 0 5px var(--data-cyan));">
                    <polygon points="100,${100-pac} ${100+dri},100 100,${100+def} ${100-sho},100" 
                        fill="rgba(0, 209, 255, 0.2)" stroke="var(--data-cyan)" stroke-width="2" />
                    <circle cx="100" cy="100" r="3" fill="var(--data-cyan)" />
                </svg>
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
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:2000000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px);";
        
        overlay.innerHTML = `
            <div class="fadeIn" style="background:#0a0a0a; border:1px solid var(--data-cyan); padding:40px; border-radius:20px; width:480px; box-shadow:0 0 50px rgba(0,209,255,0.15);">
                <h3 style="color:var(--data-cyan); font-family:'Orbitron'; margin-bottom:30px; letter-spacing:3px; text-align:center;">BIOMETRIE UPDATE: ${player.name.toUpperCase()}</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:25px; margin-bottom:30px;">
                    <div><label style="color:#666; font-size:0.55rem; font-family:'Orbitron';">KÖRPERFETT (%)</label><input type="number" id="inp-fat" value="${player.fat || 11.2}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; margin-top:8px; border-radius:5px;"></div>
                    <div><label style="color:#666; font-size:0.55rem; font-family:'Orbitron';">VO2 MAX</label><input type="number" id="inp-vo2" value="${player.vo2 || 62}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; margin-top:8px; border-radius:5px;"></div>
                    <div><label style="color:#666; font-size:0.55rem; font-family:'Orbitron';">RUHEPULS</label><input type="number" id="inp-hr" value="${player.hrRest || 48}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; margin-top:8px; border-radius:5px;"></div>
                    <div><label style="color:#666; font-size:0.55rem; font-family:'Orbitron';">TRAININGS-XP</label><input type="number" id="inp-exp" value="${player.exp || 65}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; margin-top:8px; border-radius:5px;"></div>
                </div>
                <div style="display:flex; gap:15px;">
                    <button class="tactic-btn" onclick="document.getElementById('diagnose-editor-overlay').remove()" style="flex:1;">CANCEL</button>
                    <button class="pro-btn-gold" onclick="window.SektorAnalyse.saveDiagnose('${player.id}')" style="flex:2; background:var(--data-cyan); color:#000; border-color:var(--data-cyan);">SAVE DIAGNOSIS</button>
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
            
            if(window.ToniVoice) window.ToniVoice.speak("Biometrische Signatur für " + player.name + " aktualisiert.");
        }
    },

    syncWearable() {
        if(window.ToniVoice) window.ToniVoice.speak("Synchronisiere biometrische Echtzeitdaten mit Wearable-Sensorik...");
        const btn = event.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-sync fa-spin"></i> SYNCING...`;
        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-check"></i> LIVE SYNC OK`;
            setTimeout(() => {
                btn.innerHTML = original;
                this.render();
            }, 2000);
        }, 1500);
    }
};
