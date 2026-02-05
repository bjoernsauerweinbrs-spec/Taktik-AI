/**
 * TONI 2.0 - INTERNATIONAL PERFORMANCE LAB (PRO-EDITION)
 * Professional Analytics: Evolution Tracking & AI-Scouting Reports.
 * Integriert mit ToniDB für Echtzeit-Kaderdaten.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    render: function() {
        const players = window.ToniDB ? window.ToniDB.getPlayers() : [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px; height: 82vh; animation: fadeIn 0.4s ease-out;">
                
                <div style="background: rgba(255,255,255,0.02); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 20px; overflow-y: auto;">
                    <div style="margin-bottom:25px; padding-top:10px;">
                        <h2 style="color:var(--neon-green); font-size:0.75rem; letter-spacing:3px; margin:0;">PERFORMANCE LAB</h2>
                        <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Global Scouting Standards</p>
                    </div>
                    ${this.renderSquadSidebar(players)}
                </div>

                <div id="analysis-console" style="background: rgba(13, 20, 33, 0.6); border-radius: 20px; border: 1px solid rgba(57,255,20,0.1); padding: 40px; position:relative; overflow-y:auto;">
                    ${this.selectedPlayerId ? this.renderDetailView(this.selectedPlayerId) : this.renderInitialState()}
                </div>

            </div>`;
    },

    renderSquadSidebar: function(players) {
        if(players.length === 0) return `<p style="color:var(--text-dim); font-size:0.8rem; padding:20px; border:1px dashed #333; text-align:center;">Keine Kaderdaten verfügbar.</p>`;

        // Sortierung: Mbappé/Musterprofis nach oben
        const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

        return sortedPlayers.map(p => {
            const isSel = this.selectedPlayerId === p.id;
            const statusColor = p.isPresent ? 'var(--neon-green)' : 'var(--status-error)';
            const pulseAlert = p.vitals?.pulse > 165;

            return `
                <div onclick="SektorAnalyse.selectPlayer('${p.id}')" 
                     style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:10px; cursor:pointer; border-radius:10px; 
                            background: ${isSel ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255,255,255,0.03)'}; 
                            border: 1px solid ${isSel ? 'var(--neon-green)' : 'rgba(255,255,255,0.05)'}; transition: 0.3s;">
                    <div style="width:35px; height:35px; background:#000; border:1px solid ${statusColor}; border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.8rem; color:#fff;">
                        ${p.number}
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:0.8rem; font-weight:700; color:#fff;">${p.name.toUpperCase()} ${pulseAlert ? '⚠️' : ''}</div>
                        <div style="font-size:0.55rem; color:var(--text-dim);">${p.pos} | ${p.isPresent ? 'ANWESEND' : 'ABWESEND'}</div>
                    </div>
                </div>`;
        }).join('');
    },

    selectPlayer: function(id) {
        this.selectedPlayerId = id;
        this.render(); 
    },

    renderDetailView: function(id) {
        const players = window.ToniDB.getPlayers();
        const p = players.find(x => x.id === id);
        if(!p) return this.renderInitialState();

        const pulse = p.vitals?.pulse || 70;
        const spo2 = p.vitals?.spo2 || 98;
        const pulseColor = pulse > 165 ? 'var(--status-error)' : 'var(--neon-green)';

        return `
            <div style="animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px;">
                    <div style="display:flex; gap:25px; align-items:center;">
                        <div style="width:110px; height:110px; border-radius:15px; border:2px solid ${pulseColor}; overflow:hidden; background:#111; box-shadow: 0 0 20px ${pulseColor}44;">
                            <img src="${p.photoUrl || 'https://via.placeholder.com/150/000/39FF14?text=' + p.name[0]}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div>
                            <h1 style="margin:0; font-size:2.8rem; font-weight:900; letter-spacing:-1px; color:#fff; line-height:0.9;">${p.name.toUpperCase()}</h1>
                            <span style="color:${pulseColor}; font-weight:900; letter-spacing:3px; font-size:0.75rem;">ELITE PERFORMANCE DOSSIER</span>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:3.5rem; font-weight:900; color:var(--accent-gold); line-height:1;">${p.rating || 80}</div>
                        <div style="font-size:0.6rem; color:var(--text-dim); font-weight:bold; letter-spacing:1px;">OVERALL SCORE</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(212,175,55,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--accent-gold); margin-bottom:25px; letter-spacing:2px;">PERFORMANCE RADAR-MATRIX</h3>
                        ${this.renderSkillBars(p.skills || { spr: 82, aus: 78, tec: 88, pas: 90, phy: 75 })}
                    </div>

                    <div style="background:rgba(0,209,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(0,209,255,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--data-cyan); margin-bottom:25px; letter-spacing:2px;">EVOLUTION MATRIX (LIVE)</h3>
                        <div style="display:flex; flex-direction:column; gap:25px;">
                            ${this.renderVitalTrend("CURRENT LOAD (PULSE)", pulse, [74, 110, 140, 160, pulse], pulseColor)}
                            ${this.renderVitalTrend("OXYGEN SATURATION (SpO2)", spo2, [98, 97, 98, 96, spo2], "var(--data-cyan)")}
                        </div>
                    </div>

                    <div style="grid-column: span 2; background:rgba(255,255,255,0.03); padding:30px; border-radius:15px; border-left: 5px solid ${pulseColor}; position:relative;">
                        <div style="position:absolute; top:12px; right:20px; font-size:0.55rem; color:var(--text-dim); font-weight:900; letter-spacing:1px;">AI PRO-REPORT v2.0</div>
                        <h3 style="font-size:0.65rem; color:${pulseColor}; margin-bottom:15px; letter-spacing:2px;">TONI [PRO] ANALYST FEEDBACK</h3>
                        <p id="ai-report-text" style="font-size:1.1rem; line-height:1.6; color:#fff; font-style:italic; margin:0;">
                            "${this.generateProReport(p)}"
                        </p>
                    </div>
                </div>
            </div>`;
    },

    renderSkillBars: function(skills) {
        const labels = { spr: 'SPEED / V-MAX', aus: 'STAMINA', tec: 'TECHNIQUE', pas: 'PASSING', phy: 'PHYSICAL' };
        return Object.keys(labels).map(key => `
            <div style="margin-bottom:18px;">
                <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:900; margin-bottom:6px; color:#fff;">
                    <span style="letter-spacing:1px;">${labels[key]}</span>
                    <span style="color:var(--neon-green);">${skills[key]}%</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                    <div style="width:${skills[key]}%; height:100%; background:linear-gradient(90deg, var(--accent-gold), #fff); box-shadow:0 0 10px rgba(212,175,55,0.3);"></div>
                </div>
            </div>
        `).join('');
    },

    renderVitalTrend: function(label, current, history, color) {
        return `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; margin-bottom:10px; color:#fff;">
                    <span style="color:var(--text-dim); letter-spacing:1px;">${label}</span>
                    <span style="font-weight:900; background:${color}; color:#000; padding:1px 6px; border-radius:3px;">${current}</span>
                </div>
                <div style="display:flex; align-items:flex-end; gap:8px; height:60px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    ${history.map(val => {
                        const max = label.includes("PULSE") ? 200 : 100;
                        const h = Math.min((val / max) * 100, 100);
                        return `<div style="flex:1; height:${h}%; background:${color}; opacity:0.6; border-radius:3px 3px 0 0; transition: 0.5s;"></div>`;
                    }).join('')}
                </div>
            </div>`;
    },

    generateProReport: function(p) {
        const pulse = p.vitals?.pulse || 70;
        const spo2 = p.vitals?.spo2 || 98;
        
        if(pulse > 165) return `ACHTUNG COACH BJÖRN: ${p.name} zeigt Symptome akuter Überbelastung (${pulse} BPM). Toni empfiehlt sofortige Reduzierung der Intensität oder Auswechslung, um muskuläre Verletzungen zu vermeiden.`;
        if(spo2 < 95) return `WARNUNG: Sauerstoffsättigung von ${spo2}% kritisch. Die respiratorische Erholung von ${p.name} verläuft zu langsam.`;
        
        return `ANALYSE: ${p.name} agiert auf internationalem Top-Niveau. Pulsstabilisierung im aeroben Bereich. Volle taktische Einsatzbereitschaft für das nächste Matchday-Szenario.`;
    },

    renderInitialState: function() {
        return `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; opacity:0.5;">
                <div style="width:140px; height:140px; border:2px dashed var(--neon-green); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:30px;">
                    <i class="fas fa-chart-line" style="font-size:3.5rem; color:var(--neon-green);"></i>
                </div>
                <h3 style="letter-spacing:6px; font-weight:900; color:#fff; margin:0;">PERFORMANCE READY</h3>
                <p style="font-size:0.85rem; color:var(--text-dim); margin-top:15px; max-width:400px; line-height:1.6;">Wähle einen Spieler links aus, um das Echtzeit-Dossier und Tonis AI-Analyse zu generieren.</p>
            </div>`;
    }
};
