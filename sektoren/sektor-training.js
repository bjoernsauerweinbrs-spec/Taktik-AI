window.SektorTraining = {
    sessionPlan: [],

    render: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; display:grid; grid-template-columns: 1fr 400px; gap:30px; animation: fadeIn 0.4s;">
                
                <div>
                    <h2 style="color:var(--accent-orange); margin-bottom:20px;">TRAININGS-PLANER</h2>
                    <div class="fifa-card" style="text-align:left; cursor:default; margin-bottom:20px;">
                        <h4 style="font-size:0.7rem; color:var(--accent-orange); margin-bottom:15px;">TOOLS PLATZIEREN</h4>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">
                            <button class="tactic-btn" onclick="arena.addTrainingObject('cone')">HÜTCHEN</button>
                            <button class="tactic-btn" onclick="arena.addTrainingObject('ladder')">LEITER</button>
                            <button class="tactic-btn" onclick="arena.addTrainingObject('hurdle')">HÜRDE</button>
                            <button class="tactic-btn" onclick="arena.addTrainingObject('ball')">BALL</button>
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default;">
                        <h4 style="font-size:0.7rem; color:var(--neon-green); margin-bottom:15px;">AKTUELLER TAGESPLAN (A4)</h4>
                        <div id="session-list" style="max-height:300px; overflow-y:auto; margin-bottom:20px;">
                            ${this.renderSessionList()}
                        </div>
                        <button class="login-btn" style="width:100%; background:#fff; color:#000;" onclick="window.print()">
                            <i class="fas fa-print"></i> TAGESPLAN DRUCKEN (A4)
                        </button>
                    </div>
                </div>

                <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--neon-green);">
                    <h4 style="font-size:0.7rem; color:var(--neon-green); margin-bottom:20px;">ÜBUNG SPEICHERN</h4>
                    <input type="text" id="drill-name" placeholder="Name der Übung (z.B. Koordination 1)" class="login-input" style="width:100%; margin-bottom:15px;">
                    <textarea id="drill-desc" placeholder="Beschreibung der Abläufe..." class="login-input" style="width:100%; height:100px; margin-bottom:15px;"></textarea>
                    
                    <button class="login-btn" style="width:100%;" onclick="SektorTraining.saveDrill()">
                        IN TAGESPLAN ÜBERNEHMEN
                    </button>

                    <div style="margin-top:30px; border-top:1px solid #333; padding-top:20px;">
                        <h4 style="font-size:0.6rem; color:var(--accent-gold); margin-bottom:10px;">TONI'S METHODIK-TIPP</h4>
                        <p id="toni-drill-advice" style="font-size:0.75rem; font-style:italic; color:var(--text-dim);">
                            "Wähle ein Tool aus, um methodische Tipps zu erhalten."
                        </p>
                    </div>
                </div>

            </div>
            
            <div id="print-report" class="only-print" style="display:none;"></div>
        `;
    },

    saveDrill: function() {
        const name = document.getElementById('drill-name').value;
        const desc = document.getElementById('drill-desc').value;
        const img = window.arena.getSnapshot();

        if(!name) return alert("Bitte Namen für die Übung vergeben.");

        this.sessionPlan.push({ name, desc, img });
        this.render();
        if(window.ToniTTS) ToniTTS.speak("Übung zum Tagesplan hinzugefügt.", "warm");
    },

    renderSessionList: function() {
        if(this.sessionPlan.length === 0) return "<p style='font-size:0.7rem; color:#555;'>Noch keine Übungen im Plan.</p>";
        return this.sessionPlan.map((d, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:5px; border-radius:5px;">
                <span style="font-size:0.8rem; font-weight:bold;">${i+1}. ${d.name}</span>
                <button onclick="SektorTraining.removeDrill(${i})" style="color:red; background:none; border:none; cursor:pointer;">✕</button>
            </div>
        `).join('');
    },

    removeDrill: function(i) {
        this.sessionPlan.splice(i, 1);
        this.render();
    }
};
