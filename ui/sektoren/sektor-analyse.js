/**
 * TONI 2.0 - INTERNATIONALES ANALYSEZENTRALE PRO
 * Deep Analysis: Skill-Ranking, Top-Performers & Ginga-Balance
 */
window.SektorAnalyse = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // 1. Kennzahlen-Berechnung
        const total = players.length;
        const avgOVR = total > 0 ? (players.reduce((s, p) => s + parseInt(p.rating || 0), 0) / total).toFixed(1) : 0;
        
        // Durchschnittswerte für die Team-Balance
        const avgSkills = this.calculateAvgSkills(players);
        const pressingReady = this.calculatePressingPotential(players);

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:1px solid rgba(57,255,20,0.2); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0; text-shadow: 0 0 10px rgba(57,255,20,0.3);">TIEFENANALYSE</h2>
                        <p style="font-size:0.8rem; color:var(--text-dim); margin-top:5px; text-transform:uppercase;">Kader-Performance & Skill-Monitoring</p>
                    </div>
                    <div style="text-align:right; background:rgba(255,255,255,0.05); padding:10px 20px; border-radius:10px; border:1px solid var(--accent-gold);">
                        <div style="font-size:2.5rem; font-weight:900; color:#fff; line-height:1;">${avgOVR}</div>
                        <div style="font-size:0.6rem; color:var(--accent-gold); font-weight:bold; letter-spacing:1px;">TEAM OVR</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                    
                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--accent-gold);">
                        <div style="font-size:0.7rem; color:var(--accent-gold); font-weight:bold; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:5px;">
                            <i class="fas fa-trophy"></i> TOP PERFORMER (GINGA ELITE)
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            ${this.renderTopPerformers(players)}
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--neon-green); display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                            <div style="font-size:0.7rem; color:var(--neon-green); font-weight:bold; margin-bottom:15px; letter-spacing:1px;">PRO-COACH ADVISOR</div>
                            <div id="toni-commentary" style="font-size:0.95rem; line-height:1.6; color:#fff; font-style:italic;">
                                "${this.getToniAdvice(pressingReady, avgOVR, avgSkills)}"
                            </div>
                        </div>
                        <button onclick="SektorAnalyse.triggerVoiceAdvice()" style="margin-top:20px; background:var(--neon-green); border:none; color:#000; padding:10px; border-radius:5px; cursor:pointer; font-size:0.7rem; font-weight:900; width:100%;">
                            <i class="fas fa-volume-up"></i> ANALYSE JETZT VORLESEN
                        </button>
                    </div>

                    <div class="fifa-card" style="grid-column: 1 / -1; text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--neon-green); font-weight:bold; margin-bottom:20px; letter-spacing:1px;">TEAM-SKILL BALANCE</div>
                        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:20px; text-align:center;">
                            ${this.renderSkillBars(avgSkills)}
                        </div>
                    </div>

                    <div class="fifa-card" style="grid-column: 1 / -1; text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--accent-orange); font-weight:bold; margin-bottom:20px; letter-spacing:1px;">ATHLETIC PERFORMANCE MONITOR (BMI & FITNESS)</div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
                            ${this.renderAthleticMonitor(players)}
                        </div>
                    </div>
                </div>
            </div>`;
    },

    calculateAvgSkills: function(players) {
        if(players.length === 0) return { spr: 0, aus: 0, tec: 0, pas: 0, phy: 0 };
        const sum = players.reduce((acc, p) => {
            const s = p.skills || { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 };
            return {
                spr: acc.spr + parseInt(s.spr),
                aus: acc.aus + parseInt(s.aus),
                tec: acc.tec + parseInt(s.tec),
                pas: acc.pas + parseInt(s.pas),
                phy: acc.phy + parseInt(s.phy)
            };
        }, { spr: 0, aus: 0, tec: 0, pas: 0, phy: 0 });

        return {
            spr: (sum.spr / players.length).toFixed(0),
            aus: (sum.aus / players.length).toFixed(0),
            tec: (sum.tec / players.length).toFixed(0),
            pas: (sum.pas / players.length).toFixed(0),
            phy: (sum.phy / players.length).toFixed(0)
        };
    },

    renderTopPerformers: function(players) {
        if(players.length === 0) return `<div style="color:var(--text-dim); font-size:0.7rem;">Keine Daten verfügbar.</div>`;
        
        // Finde die Besten in Kategorien
        const topSprinter = [...players].sort((a,b) => (b.skills?.spr || 0) - (a.skills?.spr || 0))[0];
        const topTechnician = [...players].sort((a,b) => (b.skills?.tec || 0) - (a.skills?.tec || 0))[0];
        const topEndurance = [...players].sort((a,b) => (b.skills?.aus || 0) - (a.skills?.aus || 0))[0];

        const list = [
            { label: 'TOP SPEED', name: topSprinter.name, val: topSprinter.skills.spr, icon: 'fa-bolt', color: 'var(--neon-green)' },
            { label: 'BEST TECHNIQUE', name: topTechnician.name, val: topTechnician.skills.tec, icon: 'fa-magic', color: 'var(--accent-gold)' },
            { label: 'ENDURANCE PRO', name: topEndurance.name, val: topEndurance.skills.aus, icon: 'fa-heartbeat', color: 'var(--accent-orange)' }
        ];

        return list.map(item => `
            <div style="display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.03); padding:10px; border-radius:8px;">
                <div style="color:${item.color}; font-size:1.2rem; width:30px; text-align:center;"><i class="fas ${item.icon}"></i></div>
                <div style="flex:1;">
                    <div style="font-size:0.55rem; color:var(--text-dim); letter-spacing:1px;">${item.label}</div>
                    <div style="font-size:0.85rem; font-weight:bold; color:#fff;">${item.name.toUpperCase()}</div>
                </div>
                <div style="font-weight:900; color:${item.color}; font-size:1.1rem;">${item.val}</div>
            </div>
        `).join('');
    },

    renderSkillBars: function(skills) {
        const categories = [
            { id: 'SPR', val: skills.spr, color: 'var(--neon-green)' },
            { id: 'TEC', val: skills.tec, color: 'var(--accent-gold)' },
            { id: 'AUS', val: skills.aus, color: 'var(--accent-orange)' },
            { id: 'PAS', val: skills.pas, color: 'var(--data-cyan)' },
            { id: 'PHY', val: skills.phy, color: '#fff' }
        ];

        return categories.map(c => `
            <div>
                <div style="font-size:0.6rem; margin-bottom:10px; font-weight:bold; color:${c.color};">${c.id}</div>
                <div style="height:120px; width:15px; background:rgba(255,255,255,0.05); margin: 0 auto; border-radius:10px; position:relative; overflow:hidden;">
                    <div style="position:absolute; bottom:0; width:100%; height:${c.val}%; background:${c.color}; box-shadow: 0 0 10px ${c.color};"></div>
                </div>
                <div style="font-size:0.75rem; font-weight:900; margin-top:10px;">${c.val}</div>
            </div>
        `).join('');
    },

    calculatePressingPotential: function(players) {
        if(players.length === 0) return 0;
        const sumEndurance = players.reduce((s, p) => s + parseInt(p.skills?.aus || 70), 0);
        const avgEndurance = sumEndurance / players.length;
        const fitRatio = players.filter(p => p.status === 'FIT').length / players.length;
        return Math.round(avgEndurance * 0.7 * fitRatio + (fitRatio * 30));
    },

    getToniAdvice: function(score, ovr, skills) {
        if(skills.tec > 85) return "Coach Björn, die technische Dominanz ist beeindruckend. Wir sollten den Gegner durch Ballbesitz müde spielen – Ginga-Style pur!";
        if(score < 55) return "Die Ausdauerwerte sind kritisch. Hochintensives Pressing über 90 Minuten wird uns heute die Punkte kosten. Vorsicht!";
        if(ovr > 80 && skills.phy > 80) return "Physisch und spielerisch auf Top-Niveau. Wir können den Gegner heute regelrecht erdrücken.";
        return "Guter Kader-Schnitt. Konzentrieren wir uns auf die individuelle Stärke unserer Top-Performer im Umschaltspiel.";
    },

    renderAthleticMonitor: function(players) {
        return players.map(p => {
            const bmi = (p.weight / ((p.height/100)**2)).toFixed(1);
            const isAlert = bmi > 25 || bmi < 19;
            return `
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; border-left: 3px solid ${isAlert ? 'var(--status-error)' : 'var(--status-fit)'};">
                    <div style="font-size:0.85rem; font-weight:bold; color:#fff;">${p.name}</div>
                    <div style="font-size:0.65rem; color:${isAlert ? 'var(--status-error)' : 'var(--text-dim)'}; margin-top:5px;">
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
