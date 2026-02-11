/**
 * TONI 2.0 - SEKTOR TRAINING (PRO DRILL CENTER)
 * Fokus: Übungs-Presets & Biometrie-basierte Belastungssteuerung
 * Status: MASTER-SYNC 2026 - BIOMETRIE-LINK ACTIVE
 */
window.SektorTraining = {
    
    init() {
        if (!window.Database.trainingPlan) {
            window.Database.trainingPlan = {
                currentTheme: "Kurzpassspiel & Orientierung",
                duration: "90 Min",
                drills: [
                    { id: 1, name: "Rondo 4vs2", duration: "15 Min" },
                    { id: 2, name: "Positionsspiel", duration: "25 Min" },
                    { id: 3, name: "Abschlussform", duration: "20 Min" }
                ]
            };
            if(window.Database.save) window.Database.save();
        }
    },

    /**
     * Scannt die Datenbank nach Spielern, die Zusatztraining benötigen
     */
    getWeightWatchers() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database.players.filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team)
        );

        return players.filter(p => {
            const hMeter = (p.height || 180) / 100;
            const bmi = (p.weight || 75) / (hMeter * hMeter);
            const fat = parseFloat(p.fat) || 0;
            // Elite-Grenzwerte: BMI > 26 ODER Fett > 13.5%
            return bmi > 26 || fat > 13.5;
        });
    },

    open() {
        this.init();
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
        
        // Sprach-Feedback bei kritischen Werten
        const criticalCount = this.getWeightWatchers().length;
        if(criticalCount > 0 && window.ToniVoice) {
            window.ToniVoice.speak(`Achtung Coach: ${criticalCount} Spieler benötigen heute eine Zusatzschicht Ausdauer.`);
        }
    },

    render() {
        const content = document.getElementById('active-content');
        const plan = window.Database.trainingPlan;
        const extraPlayers = this.getWeightWatchers();

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(57, 255, 20, 0.3); padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--neon-green); font-family:'Orbitron'; margin:0; font-size:1.2rem; letter-spacing:2px;">TRAININGS-PLANER</h2>
                        <span style="color:#666; font-size:0.7rem; text-transform:uppercase;">UNIT CONTROL | LOAD MANAGEMENT</span>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 350px; gap: 25px;">
                    
                    <div style="display:flex; flex-direction:column; gap:20px;">
                        <div style="background:rgba(255,255,255,0.02); border:1px solid #333; padding:20px; border-radius:15px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                                <h4 style="color:#fff; font-family:'Orbitron'; font-size:0.7rem; margin:0;"><i class="fas fa-running"></i> HAUPT-TRAINING</h4>
                                <span style="color:var(--neon-green); font-size:0.6rem; font-family:'Orbitron';">${plan.duration}</span>
                            </div>
                            
                            <div id="drill-list" style="display:flex; flex-direction:column; gap:10px;">
                                ${plan.drills.map(d => `
                                    <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px; border-left:3px solid var(--neon-green); display:flex; justify-content:space-between; align-items:center;">
                                        <div style="font-size:0.85rem; color:#fff;">${d.name}</div>
                                        <div style="font-size:0.7rem; color:#666;">${d.duration}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div style="background:rgba(255, 59, 48, 0.05); border:1px solid var(--status-error); padding:20px; border-radius:15px;">
                            <h4 style="color:var(--status-error); font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;">
                                <i class="fas fa-weight"></i> EXTRA-SHIFTS (BIO-ALARM)
                            </h4>
                            <div style="display:grid; gap:8px;">
                                ${extraPlayers.length > 0 ? extraPlayers.map(p => `
                                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; border: 1px solid rgba(255, 59, 48, 0.2);">
                                        <div>
                                            <span style="color:#fff; font-size:0.75rem; font-weight:bold;">${p.name.toUpperCase()}</span>
                                            <div style="font-size:0.55rem; color:var(--status-error);">GRUND: BIO-WERTE ÜBER LIMIT</div>
                                        </div>
                                        <div style="text-align:right;">
                                            <div style="font-size:0.6rem; color:#fff;">+20 MIN</div>
                                            <div style="font-size:0.5rem; color:#666;">AUSDAUER</div>
                                        </div>
                                    </div>
                                `).join('') : '<div style="color:#666; font-size:0.7rem; text-align:center;">Alle Spieler im optimalen Bereich.</div>'}
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:20px;">
                        <div style="background:rgba(0,0,0,0.3); border:1px solid #222; padding:20px; border-radius:15px;">
                            <label style="color:#666; font-size:0.6rem; text-transform:uppercase; letter-spacing:1px;">Schwerpunkt</label>
                            <input type="text" value="${plan.currentTheme}" 
                                style="width:100%; background:transparent; border:none; border-bottom:1px solid #333; color:var(--neon-green); font-family:'Orbitron'; font-size:0.9rem; padding:10px 0; outline:none;"
                                onchange="window.Database.trainingPlan.currentTheme = this.value; window.Database.save();">
                        </div>

                        <div style="background:rgba(255,165,0,0.05); border:1px solid var(--accent-orange); padding:20px; border-radius:15px;">
                            <h4 style="color:var(--accent-orange); font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;">EQUIPMENT PUSH</h4>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <button class="tactic-btn" onclick="window.SektorTraining.pushEquipment('cone')">HÜTCHEN</button>
                                <button class="tactic-btn" onclick="window.SektorTraining.pushEquipment('goal')">MINITOR</button>
                            </div>
                        </div>

                        <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); padding:20px; border-radius:15px;">
                            <h4 style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;">ARENA-VORGABE</h4>
                            <div style="display:grid; gap:8px;">
                                <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.arena.setPitchMode('funino')">FUNINO SETUP</button>
                                <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.arena.setPitchMode('kleinfeld')">KLEINFELD PRO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    pushEquipment(type) {
        if(window.arena && window.arena.addEquipment) {
            const centerX = window.arena.canvas.width / 2;
            const centerY = (window.arena.canvas.height - (window.arena.benchHeight || 0)) / 2;
            window.arena.addEquipment(type, centerX, centerY);
            if(window.ToniVoice) window.ToniVoice.speak(`${type === 'cone' ? 'Hütchen' : 'Tor'} platziert.`);
        }
    }
};
