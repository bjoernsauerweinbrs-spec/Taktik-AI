/**
 * TONI 2.0 - SEKTOR TRAINING (PRO DRILL CENTER)
 * Fokus: Übungs-Presets, Equipment-Layouts & Trainings-Management
 * Status: INITIAL-RELEASE 2026
 */
window.SektorTraining = {
    
    init() {
        if (!window.Database.trainingPlan) {
            window.Database.trainingPlan = {
                currentTheme: "Kurzpassspiel & Orientierung",
                duration: "90 Min",
                drills: [
                    { id: 1, name: "Rondo 4vs2", duration: "15 Min" },
                    { id: 2, name: "Positionsspiel", duration: "25 Min" }
                ]
            };
            if(window.Database.save) window.Database.save();
        }
    },

    open() {
        this.init();
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const plan = window.Database.trainingPlan;

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(57, 255, 20, 0.3); padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--neon-green); font-family:'Orbitron'; margin:0; font-size:1.2rem; letter-spacing:2px;">TRAININGS-PLANER</h2>
                        <span style="color:#666; font-size:0.7rem; text-transform:uppercase;">UNIT CONTROL | WORKOUT DESIGN</span>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 350px; gap: 25px;">
                    
                    <div style="display:flex; flex-direction:column; gap:20px;">
                        
                        <div style="background:rgba(255,255,255,0.02); border:1px solid #333; padding:20px; border-radius:15px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                                <h4 style="color:#fff; font-family:'Orbitron'; font-size:0.7rem; margin:0;"><i class="fas fa-list-ol"></i> HEUTIGER ABLAUF</h4>
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
                            
                            <button class="tactic-btn" style="width:100%; margin-top:15px; border-style:dashed; opacity:0.5;" onclick="alert('Bibliothek wird geladen...')">+ ÜBUNG AUS DATENBANK</button>
                        </div>

                        <div style="background:rgba(0,0,0,0.3); border:1px solid #222; padding:20px; border-radius:15px;">
                            <label style="color:#666; font-size:0.6rem; text-transform:uppercase; letter-spacing:1px;">Thematischer Schwerpunkt</label>
                            <input type="text" value="${plan.currentTheme}" 
                                style="width:100%; background:transparent; border:none; border-bottom:1px solid #333; color:var(--neon-green); font-family:'Orbitron'; font-size:1rem; padding:10px 0; outline:none;"
                                onchange="window.Database.trainingPlan.currentTheme = this.value; window.Database.save();">
                        </div>

                    </div>

                    <div style="display:flex; flex-direction:column; gap:20px;">
                        
                        <div style="background:rgba(255,165,0,0.05); border:1px solid var(--accent-orange); padding:20px; border-radius:15px;">
                            <h4 style="color:var(--accent-orange); font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;">EQUIPMENT PUSH</h4>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <button class="tactic-btn" onclick="window.SektorTraining.pushEquipment('cone')"><i class="fas fa-triangle-exclamation"></i> HÜTCHEN</button>
                                <button class="tactic-btn" onclick="window.SektorTraining.pushEquipment('goal')"><i class="fas fa-door-open"></i> MINITOR</button>
                            </div>
                            <button class="tactic-btn" style="width:100%; margin-top:10px; border-color:var(--status-error); color:var(--status-error);" onclick="window.arena.clearEquipment()">
                                <i class="fas fa-trash-alt"></i> ARENA LEEREN
                            </button>
                        </div>

                        <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); padding:20px; border-radius:15px;">
                            <h4 style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;">ARENA KONFIGURATION</h4>
                            <div style="display:grid; gap:8px;">
                                <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.arena.setPitchMode('funino')">FUNINO (4 TORE)</button>
                                <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.arena.setPitchMode('kleinfeld')">KLEINFELD (KOMPAKT)</button>
                                <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.arena.setPitchMode('grossfeld')">GROSSFELD (NORMAL)</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        `;
    },

    pushEquipment(type) {
        if(window.arena && window.arena.addEquipment) {
            // Wir setzen das Equipment in die Mitte der Arena
            const centerX = window.arena.canvas.width / 2;
            const centerY = (window.arena.canvas.height - window.arena.benchHeight) / 2;
            
            window.arena.addEquipment(type, centerX, centerY);
            if(window.ToniVoice) window.ToniVoice.speak(`${type === 'cone' ? 'Hütchen' : 'Tor'} auf das Feld gestellt.`);
        }
    }
};
