/**
 * TONI 2.0 - INTERNATIONALES ANALYSEZENTRUM
 * Deep Analysis: Fitness, OVR-Rating & Pressing-Bereitschaft
 */
window.SektorAnalyse = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Kennzahlen-Berechnung (Internationaler Standard)
        const total = players.length;
        const avgOVR = total > 0 ? (players.reduce((s, p) => s + parseInt(p.rating || 0), 0) / total).toFixed(1) : 0;
        const fitPlayers = players.filter(p => p.status === 'FIT');
        const pressingReady = this.calculatePressingPotential(players);

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:1px solid rgba(57,255,20,0.2); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0;">TIEFENANALYSE</h2>
                        <p style="font-size:0.8rem; color:var(--text-dim); margin-top:5px;">Global Scouting & Performance Standards</p>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:2.5rem; font-weight:900; color:#fff; line-height:1;">${avgOVR}</div>
                        <div style="font-size:0.6rem; color:var(--accent-gold); font-weight:bold; letter-spacing:1px;">TEAM OVR</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:25px;">
                    
                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--neon-green);">
                        <div style="font-size:0.7rem; color:var(--neon-green); font-weight:bold; margin-bottom:15px; letter-spacing:1px;">INTENSITY READINESS (PRESSING)</div>
                        <div style="font-size:2.8rem; font-weight:900; color:#fff;">${pressingReady}%</div>
                        <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; margin:15px 0; overflow:hidden;">
                            <div style="width:${pressingReady}%; height:100%; background:var(--neon-green); box-shadow: 0 0 15px var(--neon-green);"></div>
                        </div>
                        <p style="font-size:0.75rem; color:var(--text-dim);">Basierend auf Kader-BMI, Fitness-Status und OVR-Schnitt.</p>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--accent-gold); font-weight:bold; margin-bottom:15px; letter-spacing:1px;">PRO-COACH ADVISOR</div>
                        <div id="toni-commentary" style="font-size:0.95rem; line-height:1.6; color:#fff; font-style:italic;">
                            "${this.getToniAdvice(pressingReady, avgOVR)}"
                        </div>
                        <button onclick="SektorAnalyse.triggerVoiceAdvice()" style="margin-top:20px; background:none; border:1px solid var(--accent-gold); color:var(--accent-gold); padding:5px 15px; border-radius:5px; cursor:pointer; font-size:0.7rem;">
                            <i class="fas fa-volume-up"></i> ANALYSE VORLESEN
                        </button>
                    </div>

                    <div class="fifa-card" style="grid-column: 1 / -1; text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--neon-green); font-weight:bold; margin-bottom:20px; letter-spacing:1px;">ATHLETIC PERFORMANCE MONITOR</div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
                            ${this.renderAthleticMonitor(players)}
                        </div>
                    </div>
                </div>
            </div>`;
    },

    calculatePressingPotential: function(players) {
        if(players.length === 0) return 0;
        const fit = players.filter(p => p.status === 'FIT').length;
        const bmiScores = players.map(p => {
            const bmi = p.weight / ((p.height/100)**2);
            return (bmi >= 20 && bmi <= 24.5) ? 100 : 50;
        });
        const avgBmiScore = bmiScores.reduce((a,b) => a+b, 0) / players.length;
        return Math.round(( (fit / players.length) * 0.6 + (avgBmiScore / 100) * 0.4 ) * 100);
    },

    getToniAdvice: function(score, ovr) {
        if(score < 60) return "Coach Björn, die athletische Basis ist aktuell zu schwach für internationales Pressing. Wir müssen die Belastung steuern.";
        if(ovr > 80 && score > 80) return "Perfekte Balance. Der Kader ist bereit für hochintensiven Fußball auf europäischem Niveau.";
        return "Gute Ansätze, aber wir brauchen mehr Konstanz in der physischen Verfassung für 90 Minuten Vollgas.";
    },

    renderAthleticMonitor: function(players) {
        return players.map(p => {
            const bmi = (p.weight / ((p.height/100)**2)).toFixed(1);
            const isAlert = bmi > 25 || bmi < 19;
            return `
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; border-left: 3px solid ${isAlert ? 'var(--status-error)' : 'var(--status-fit)'};">
                    <div style="font-size:0.85rem; font-weight:bold; color:#fff;">${p.name}</div>
                    <div style="font-size:0.7rem; color:${isAlert ? 'var(--status-error)' : 'var(--text-dim)'}; margin-top:5px;">
                        BMI: ${bmi} ${isAlert ? '[WARNUNG]' : '[OK]'}
                    </div>
                </div>
            `;
        }).join('');
    },

    triggerVoiceAdvice: function() {
        const text = document.getElementById('toni-commentary').innerText;
        if(window.ToniTTS) ToniTTS.speak(text, "warm");
    }
};
