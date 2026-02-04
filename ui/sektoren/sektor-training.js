/**
 * TONI 2.0 - INTERNATIONAL TRAINING & METHODOLOGY
 * Verwaltung von Trainings-Pools, Platzaufbau & A4-Export.
 */
window.SektorTraining = {
    sessionPlan: [], // Liste der gespeicherten Übungen für A4
    currentMode: 'pro',

    render: function() {
        const squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; display:grid; grid-template-columns: 1fr 380px; gap:30px; animation: fadeIn 0.4s ease-out;">
                
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                        <div>
                            <h2 style="color:var(--accent-orange); margin:0; letter-spacing:2px;">TRAININGS-ZENTRALE</h2>
                            <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Methodik & Belastungssteuerung</p>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="tactic-btn" onclick="SektorTraining.setMode('pro')" style="${this.currentMode==='pro'?'border-color:var(--neon-green);color:#fff':''}">PRO-PITCH</button>
                            <button class="tactic-btn" onclick="SektorTraining.setMode('youth')" style="${this.currentMode==='youth'?'border-color:var(--neon-green);color:#fff':''}">F-JUGEND</button>
                            <button class="tactic-btn" onclick="SektorTraining.setMode('funino')" style="${this.currentMode==='funino'?'border-color:var(--neon-green);color:#fff':''}">FUNINO</button>
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default; margin-bottom:25px;">
                        <h4 style="font-size:0.6rem; color:var(--accent-gold); margin-bottom:15px; letter-spacing:1px;">ANWESENHEITSPRÜFUNG (POOL: MAX 20)</h4>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:10px; max-height:250px; overflow-y:auto; padding-right:10px;">
                            ${this.renderAttendanceList(squad)}
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default;">
                        <h4 style="font-size:0.6rem; color:var(--data-cyan); margin-bottom:15px; letter-spacing:1px;">MATERIAL & TOOLS</h4>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
                            <button class="tactic-btn" onclick="arena.addTrainingObject('cone')"><i class="fas fa-triangle"></i> HÜTCHEN</button>
                            <button class="tactic-btn" onclick="arena.addTrainingObject('ladder')"><i class="fas fa-align-justify"></i> LEITER</button>
                            <button class="tactic-btn" onclick="arena.addTrainingObject('hurdle')"><i class="fas fa-minus"></i> HÜRDE</button>
                            <button class="tactic-btn" onclick="arena.addTrainingObject('ball')"><i class="fas fa-volleyball-ball"></i> EXTRA-BALL</button>
                        </div>
                        <button class="login-btn" style="width:100%; margin-top:20px; background:var(--accent-orange); color:#fff;" onclick="SektorTraining.startSession()">
                            TRAINING AUF BOARD STARTEN
                        </button>
                    </div>
                </div>

                <div class="fifa-card" style="border-color:var(--neon-green); text-align:left; cursor:default; display:flex; flex-direction:column;">
                    <h4 style="font-size:0.6rem; color:var(--neon-green); margin-bottom:20px; letter-spacing:1px;">A4 TAGESPLAN-EDITOR</h4>
                    
                    <div style="flex:1;">
                        <input type="text" id="drill-name" placeholder="Name der Übung..." class="login-input" style="width:100%; margin-bottom:10px;">
                        <textarea id="drill-desc" placeholder="Ablauf & Coaching-Punkte..." class="login-input" style="width:100%; height:80px; margin-bottom:15px;"></textarea>
                        
                        <button class="login-btn" style="width:100%; font-size:0.7rem;" onclick="SektorTraining.addDrillToPlan()">
                            ÜBUNG IN PLAN SPEICHERN
                        </button>

                        <div style="margin-top:25px; border-top:1px solid #333; padding-top:20px;">
                            <h4 style="font-size:0.55rem; color:var(--accent-gold); margin-bottom:10px;">GESPEICHERTE EINHEITEN:</h4>
                            <div id="session-list-summary" style="font-size:0.75rem; color:#fff;">
                                ${this.renderSessionSummary()}
                            </div>
                        </div>
                    </div>

                    <button class="login-btn" style="width:100%; background:#fff; color:#000; margin-top:20px;" onclick="window.print()">
                        <i class="fas fa-print"></i> PLAN DRUCKEN (A4)
                    </button>
                </div>
            </div>
            
            <div id="a4-print-layout" class="only-print"></div>
        `;
    },

    setMode: function(mode) {
        this.currentMode = mode;
        if(window.arena) window.arena.setPitchMode(mode);
        this.render();
    },

    renderAttendanceList: function(squad) {
        return squad.map(p => {
            const isAtTraining = p.isPresent;
            return `
                <div onclick="SektorTraining.toggleAttendance('${p.id}')" 
                     style="padding:10px; border:1px solid ${isAtTraining ? 'var(--accent-orange)' : '#222'}; border-radius:8px; cursor:pointer; background:${isAtTraining ? 'rgba(255,106,0,0.1)' : 'rgba(0,0,0,0.2)'}; text-align:center; transition:0.2s;">
                    <div style="font-size:0.9rem; font-weight:900; color:${isAtTraining ? '#fff' : '#444'}">${p.number}</div>
                    <div style="font-size:0.5rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:${isAtTraining ? '#fff' : '#444'}">${p.name.toUpperCase()}</div>
                </div>
            `;
        }).join('');
    },

    toggleAttendance: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(p => p.id === id);
        if(idx > -1) {
            players[idx].isPresent = !players[idx].isPresent;
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    },

    startSession: function() {
        if(window.arena) {
            window.arena.resetBoard(); // Lädt nominierte & anwesende Spieler
            if(window.BriefcaseUI) window.BriefcaseUI.toggle();
            if(window.ToniTTS) ToniTTS.speak("Trainingsaufbau wird auf das Board übertragen.", "warm");
        }
    },

    addDrillToPlan: function() {
        const name = document.getElementById('drill-name').value;
        const desc = document.getElementById('drill-desc').value;
        if(!name) return alert("Bitte Namen für die Übung eingeben.");

        const snapshot = window.arena ? window.arena.getSnapshot() : null;
        this.sessionPlan.push({ name, desc, snapshot });
        
        document.getElementById('drill-name').value = "";
        document.getElementById('drill-desc').value = "";
        this.render();
        this.preparePrintLayout();
    },

    renderSessionSummary: function() {
        if(this.sessionPlan.length === 0) return "<span style='color:#444'>Plan ist leer...</span>";
        return this.sessionPlan.map((d, i) => `
            <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                <span>${i+1}. ${d.name}</span>
                <i class="fas fa-trash" style="color:var(--status-error); cursor:pointer; font-size:0.7rem;" onclick="SektorTraining.removeDrill(${i})"></i>
            </div>
        `).join('');
    },

    removeDrill: function(i) {
        this.sessionPlan.splice(i, 1);
        this.render();
        this.preparePrintLayout();
    },

    preparePrintLayout: function() {
        const printArea = document.getElementById('a4-print-layout');
        if(!printArea) return;
        
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || { name: "Pro Club", coach: "Coach" };

        printArea.innerHTML = `
            <div style="padding:20mm; font-family:Inter, sans-serif; color:#000; background:#fff;">
                <div style="display:flex; justify-content:space-between; border-bottom:4px solid #000; padding-bottom:10px; margin-bottom:30px;">
                    <h1 style="margin:0; font-size:24pt;">TRAININGSPLAN</h1>
                    <div style="text-align:right; font-weight:bold;">
                        ${config.name.toUpperCase()}<br>COACH: ${config.coach.toUpperCase()}
                    </div>
                </div>
                ${this.sessionPlan.map((d, i) => `
                    <div style="margin-bottom:40px; page-break-inside: avoid;">
                        <h2 style="font-size:16pt; margin-bottom:10px;">${i+1}. ${d.name.toUpperCase()}</h2>
                        <div style="display:grid; grid-template-columns: 100mm 1fr; gap:15px;">
                            <img src="${d.snapshot}" style="width:100%; border:1px solid #000;">
                            <div style="font-size:10pt; line-height:1.4;">
                                <strong>ABLAUF / COACHING:</strong><br>
                                ${d.desc.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
