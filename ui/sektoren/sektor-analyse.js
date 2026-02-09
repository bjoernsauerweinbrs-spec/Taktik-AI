/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Bio-Metrische Daten, Manuelle Eingabe & Proaktive Warn-Logik (Smart-Alerts).
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        const title = document.getElementById('sector-title');
        if(title) title.innerText = "PERFORMANCE ANALYSE-ZENTRUM";
        
        if (!this.selectedPlayerId && window.Database?.players?.length > 0) {
            this.selectedPlayerId = window.Database.players[0].id;
        }

        this.render();
    },

    // Die "Gehirn-Logik" für die Warnungen
    getAlerts(player) {
        const alerts = [];
        const fat = parseFloat(player.fat) || 0;
        const sleep = parseFloat(player.sleep) || 100;
        const hrRest = parseFloat(player.hrRest) || 0;

        if (fat > 13.5) alerts.push({ type: 'danger', msg: `KÖRPERFETT-ALARM: ${fat}% liegt über dem Profi-Limit (max 13.5%).` });
        if (sleep < 75) alerts.push({ type: 'warning', msg: `REGENERATIONS-MANGEL: Schlaf-Index (${sleep}) kritisch. Verletzungsgefahr erhöht!` });
        if (hrRest > 60) alerts.push({ type: 'warning', msg: `PULS-ANOMALIE: Ruhepuls (${hrRest}) erhöht. Mögliche Überlastung.` });
        
        return alerts;
    },

    render() {
        const content = document.getElementById('active-content');
        const players = window.Database?.players || [];
        const player = players.find(p => p.id === this.selectedPlayerId) || { name: "Kein Spieler gewählt" };
        const alerts = this.getAlerts(player);

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.4); border-right: 1px solid #333; padding-right: 15px; overflow-y: auto; max-height: 70vh;">
                    <h3 style="font-size: 0.7rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 15px;">KADER-STATUS</h3>
                    ${players.map(p => {
                        const hasDanger = this.getAlerts(p).length > 0;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; border: 1px solid ${this.selectedPlayerId === p.id ? (hasDanger ? 'var(--status-error)' : 'var(--neon-green)') : '#222'}; background: ${this.selectedPlayerId === p.id ? 'rgba(57,255,20,0.1)' : 'transparent'}; transition: 0.3s;">
                            <div style="font-weight: bold; font-size: 0.85rem;">${p.name}</div>
                            <div style="font-size: 0.65rem; color: ${hasDanger ? 'var(--status-error)' : '#888'};">
                                ${hasDanger ? '<i class="fas fa-exclamation-triangle"></i> ANOMALIE' : 'Bereitschaft: <span style="color:var(--neon-green)">Optimal</span>'}
                            </div>
                        </div>
                    `}).join('')}
                </div>

                <div style="overflow-y: auto; padding-right: 10px;">
                    
                    ${alerts.length > 0 ? `
                        <div style="margin-bottom: 20px; background: rgba(255,59,48,0.1); border: 1px solid var(--status-error); border-radius: 12px; padding: 15px; animation: pulse 2s infinite;">
                            <h4 style="color: var(--status-error); margin: 0 0 8px 0; font-size: 0.8rem; text-transform: uppercase;"><i class="fas fa-biohazard"></i> Kritische Bio-Analyse</h4>
                            ${alerts.map(a => `<p style="color: #fff; font-size: 0.75rem; margin: 4px 0;">- ${a.msg}</p>`).join('')}
                        </div>
                    ` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 1.5rem; color: #fff; text-transform: uppercase;">${player.name}</h2>
                            <span style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 2px;">VITAL-DIAGNOSTIK SESSION: 2026</span>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="pro-btn-gold" onclick="window.SektorAnalyse.openDataEditor()" style="font-size:0.7rem;">
                                <i class="fas fa-edit"></i> DIAGNOSE-DATEN EINPFLEGEN
                            </button>
                            <button class="tactic-btn" onclick="window.SektorAnalyse.syncWearable()" style="font-size:0.7rem;">
                                <i class="fas fa-sync"></i> SYNC WEARABLE
                            </button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                            <h3 style="font-size: 0.8rem; color: var(--accent-orange); margin-bottom: 15px;"><i class="fas fa-weight"></i> BODY COMPOSITION (WAAGE)</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                ${this.renderStatCard("KÖRPERFETT", (player.fat || "11.2") + " %", (parseFloat(player.fat) > 13.5 ? "KRITISCH" : "NIEDRIG"), (parseFloat(player.fat) > 13.5 ? "var(--status-error)" : "var(--neon-green)"))}
                                ${this.renderStatCard("MUSKELMASSE", (player.muscle || "44.8") + " kg", "OPTIMAL", "var(--neon-green)")}
                                ${this.renderStatCard("WASSERANTEIL", (player.water || "62.4") + " %", "STABIL", "var(--data-cyan)")}
                                ${this.renderStatCard("GEWICHT", (player.weight || "78.5") + " kg", "SOLIDE", "var(--neon-green)")}
                            </div>
                        </div>

                        <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                            <h3 style="font-size: 0.8rem; color: var(--data-cyan); margin-bottom: 15px;"><i class="fas fa-stopwatch-20"></i> PERFORMANCE (WEARABLE)</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                ${this.renderStatCard("VO2 MAX", (player.vo2 || "62") + " ml/kg", "PROFI", "var(--accent-gold)")}
                                ${this.renderStatCard("HRV (RECOVERY)", (player.hrv || "88") + " ms", "ERHOLT", "var(--neon-green)")}
                                ${this.renderStatCard("SCHLAF-INDEX", (player.sleep || "92") + "/100", (parseFloat(player.sleep) < 75 ? "MANGEL" : "DEEP"), (parseFloat(player.sleep) < 75 ? "var(--status-error)" : "var(--data-cyan)"))}
                                ${this.renderStatCard("PULS (RUHE)", (player.hrRest || "48") + " BPM", (parseFloat(player.hrRest) > 60 ? "ERHÖHT" : "ATHLET"), (parseFloat(player.hrRest) > 60 ? "var(--accent-orange)" : "var(--neon-green)"))}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background: rgba(57,255,20,0.05); border: 1px solid rgba(57,255,20,0.2); border-radius: 8px; color: #fff; font-size: 0.8rem;">
                        <strong style="color:var(--neon-green);">TONI BIO-FEEDBACK:</strong> 
                        ${alerts.length > 0 ? `"Coach, wir müssen bei ${player.name} intervenieren. Die biometrischen Abweichungen gefährden die Match-Performance."` : `"Basierend auf den Werten von ${player.name} ist das System im optimalen Bereich. Volle Belastung empfohlen."`}
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border-left: 2px solid ${color};">
                <div style="font-size: 0.6rem; color: #888; text-transform: uppercase;">${label}</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: #fff; margin: 4px 0;">${value}</div>
                <div style="font-size: 0.55rem; color: ${color}; font-weight: bold;">● ${status}</div>
            </div>
        `;
    },

    selectPlayer(id) {
        this.selectedPlayerId = id;
        this.render();
    },

    openDataEditor() {
        const players = window.Database?.players || [];
        const player = players.find(p => p.id === this.selectedPlayerId);
        if(!player) return;

        const overlay = document.createElement('div');
        overlay.id = "diagnose-editor-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10001; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);";
        
        overlay.innerHTML = `
            <div style="background:#111; border:1px solid var(--neon-green); padding:30px; border-radius:20px; width:450px; box-shadow:0 0 50px rgba(57,255,20,0.2);">
                <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:20px;">UPDATE: ${player.name}</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:20px;">
                    <div><label style="color:#666; font-size:0.7rem;">GEWICHT (KG)</label><input type="number" id="inp-weight" value="${player.weight || 78.5}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="color:#666; font-size:0.7rem;">KÖRPERFETT (%)</label><input type="number" id="inp-fat" value="${player.fat || 11.2}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="color:#666; font-size:0.7rem;">MUSKELMASSE (KG)</label><input type="number" id="inp-muscle" value="${player.muscle || 44.8}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="color:#666; font-size:0.7rem;">VO2 MAX</label><input type="number" id="inp-vo2" value="${player.vo2 || 62}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="color:#666; font-size:0.7rem;">RUHEPULS (BPM)</label><input type="number" id="inp-hr" value="${player.hrRest || 48}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="color:#666; font-size:0.7rem;">SCHLAF-INDEX</label><input type="number" id="inp-sleep" value="${player.sleep || 92}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="pro-btn" onclick="document.getElementById('diagnose-editor-overlay').remove()" style="flex:1;">ABBRECHEN</button>
                    <button class="pro-btn-gold" onclick="window.SektorAnalyse.saveDiagnose('${player.id}')" style="flex:1;">SPEICHERN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    saveDiagnose(playerId) {
        const player = window.Database.players.find(p => p.id === playerId);
        if(player) {
            player.weight = document.getElementById('inp-weight').value;
            player.fat = document.getElementById('inp-fat').value;
            player.muscle = document.getElementById('inp-muscle').value;
            player.vo2 = document.getElementById('inp-vo2').value;
            player.hrRest = document.getElementById('inp-hr').value;
            player.sleep = document.getElementById('inp-sleep').value;
            if(window.Database.save) window.Database.save();
            document.getElementById('diagnose-editor-overlay').remove();
            this.render();
            
            const alerts = this.getAlerts(player);
            if(window.ToniVoice) {
                if(alerts.length > 0) window.ToniVoice.speak("Daten gespeichert. Achtung Coach, kritische Bio-Werte erkannt!");
                else window.ToniVoice.speak("Daten für " + player.name + " erfolgreich aktualisiert.");
            }
        }
    },

    syncWearable() {
        if(window.ToniVoice) window.ToniVoice.speak("Synchronisiere Wearable-Daten...");
        const btn = event.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> SYNCING...`;
        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-check"></i> DONE`;
            setTimeout(() => btn.innerHTML = original, 2000);
            this.render();
        }, 1500);
    }
};
