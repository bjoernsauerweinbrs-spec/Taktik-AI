/**
 * TONI 2.0 - INTERNATIONAL PERFORMANCE LAB (PRO-EDITION)
 * Professional Analytics: Evolution Tracking & AI-Scouting Reports.
 * Integriert mit ToniDB für Echtzeit-Kaderdaten und Vital-Alarme.
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

        const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

        return sortedPlayers.map(p => {
            const isSel = this.selectedPlayerId === p.id;
            const statusColor = p.isPresent ? 'var(--neon-green)' : 'var(--status-error)';
            const pulseAlert = p.vitals?.pulse > 165;

            return `
                <div onclick="SektorAnalyse.selectPlayer('${p.id}')" 
                     style="display:flex; align-items:center; gap:12px; padding:15px; margin-bottom:12px; cursor:pointer; border-radius:12px; 
                            background: ${isSel ? 'rgba(57, 255, 20, 0.12)' : 'rgba(255,255,255,0.02)'}; 
                            border: 1px solid ${isSel ? 'var(--neon-green)' : 'rgba(255,255,255,0.05)'}; transition: 0.3s;">
                    <div style="width:38px; height:38px; background:#000; border:1px solid ${statusColor}; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; color:#fff;">
                        ${p.number}
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:0.85rem; font-weight:700; color:#fff;">${p.name.toUpperCase()} ${pulseAlert ? '⚠️' : ''}</div>
                        <div style="font-size:0.6rem; color:var(--text-dim); letter-spacing:1px;">${p.pos} | ${p.rating} OVR</div>
                    </div>
                    ${pulseAlert ? '<i class="fas fa-heartbeat" style="color:var(--status-error); font-size:0.8rem; animation: pulse-glow 1s infinite;"></i>' : ''}
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
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:25px;">
                    <div style="display:flex; gap:30px; align-items:center;">
                        <div style="width:120px; height:120px; border-radius:20px; border:2px solid ${pulseColor}; overflow:hidden; background:#000; box-shadow: 0 0 30px ${pulseColor}33;">
                            <img src="${p.photoUrl || 'https://via.placeholder.com/150/000/39FF14?text=' + p.name[0]}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div>
                            <h1 style="margin:0; font-size:3.2rem; font-weight:900; letter-spacing:-2px; color:#fff; line-height:0.85;">${p.name.toUpperCase()}</h1>
                            <div style="margin-top:10px; display:flex; gap:15px; align-items:center;">
                                <span style="color:${pulseColor}; font-weight:900; letter-spacing:4px; font-size:0.8rem;">ELITE PERFORMANCE DOSSIER</span>
                                <span style="background:rgba(255,255,255,0.05); padding:2px 10px; border-radius:4px; font-size:0.6rem; color:var(--accent-gold); font-weight:bold;">ID: ${p.id}</span>
                            </div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:4rem; font-weight:900; color:var(--accent-gold); line-height:1;">${p.rating || 80}</div>
                        <div style="font-size:0.7rem; color:var(--text-dim); font-weight:bold; letter-spacing:2px;">GLOBAL RATING</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:35px;">
                    
                    <div style="background:rgba(255,255,255,0.02); padding:30px; border-radius:20px; border:1px solid rgba(212,175,55,0.15);">
                        <h3 style="font-size:0.7rem; color:var(--accent-gold); margin-bottom:30px; letter-spacing:3px; text-transform:uppercase;">Performance Radar</h3>
                        ${this.renderSkillBars(p.skills || { spr: 82, aus: 78, tec: 88, pas: 90, phy: 75 })}
                    </div>

                    <div style="background:rgba(0,209,255,0.02); padding:30px; border-radius:20px; border:1px solid rgba(0,209,255,0.15);">
                        <h3 style="font-size:0.7rem; color:var(--data-cyan); margin-bottom:30px; letter-spacing:3px; text-transform:uppercase;">Evolution Matrix (Live)</h3>
                        <div style="display:flex; flex-direction:column; gap:30px;">
                            ${this.renderVitalTrend("CARDIAC LOAD (BPM)", pulse, [72, 115, 145, 168, pulse], pulseColor)}
                            ${this.renderVitalTrend("OXYGEN SATURATION (%)", spo2, [99, 98, 97, 95, spo2], "var(--data-cyan)")}
                        </div>
                    </div>

                    <div style="grid-column: span 2; background:rgba(255,255,255,0.03); padding:35px; border-radius:20px; border-left: 6px solid ${pulseColor}; position:relative; box-shadow: inset 0 0 50px rgba(0,0,0,0.2);">
                        <div style="position:absolute; top:15px; right:25px; font-size:0.6rem; color:var(--text-dim); font-weight:900; letter-spacing:2px;">TONI AI PRO-ANALYST v2.0</div>
                        <h3 style="font-size:0.7rem; color:${pulseColor}; margin-bottom:20px; letter-spacing:3px;">EXPERT REPORT FOR COACH BJÖRN</h3>
                        <p id="ai-report-text" style="font-size:1.2rem; line-height:1.7; color:#fff; font-style:italic; font-weight:300; margin:0;">
                            "${this.generateProReport(p)}"
                        </p>
                    </div>
                </div>
            </div>`;
    },

    renderSkillBars: function(skills) {
        const labels = { spr: 'SPEED / V-MAX', aus: 'STAMINA', tec: 'TECHNIQUE', pas: 'PASSING', phy: 'PHYSICAL' };
        return Object.keys(labels).map(key => `
            <div style="margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:900; margin-bottom:8px; color:#fff;">
                    <span style="letter-spacing:1px; opacity:0.8;">${labels[key]}</span>
                    <span style="color:var(--neon-green);">${skills[key]}%</span>
                </div>
                <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
                    <div style="width:${skills[key]}%; height:100%; background:linear-gradient(90deg, var(--accent-gold), #fff); box-shadow:0 0 15px rgba(212,175,55,0.3);"></div>
                </div>
            </div>
        `).join('');
    },

    renderVitalTrend: function(label, current, history, color) {
        return `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:12px; color:#fff;">
                    <span style="color:var(--text-dim); letter-spacing:1px; font-weight:bold;">${label}</span>
                    <span style="font-weight:900; background:${color}; color:#000; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${current}</span>
                </div>
                <div style="display:flex; align-items:flex-end; gap:10px; height:70px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.08);">
                    ${history.map(val => {
                        const max = label.includes("BPM") ? 200 : 100;
                        const h = Math.min((val / max) * 100, 100);
                        return `<div style="flex:1; height:${h}%; background:${color}; opacity:0.5; border-radius:4px 4px 0 0; transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);"></div>`;
                    }).join('')}
                </div>
            </div>`;
    },

    generateProReport: function(p) {
        const pulse = p.vitals?.pulse || 70;
        const spo2 = p.vitals?.spo2 || 98;
        
        if(pulse > 165) return `KRITISCHER STATUS: Coach Björn, ${p.name} befindet sich in der roten Belastungszone (${pulse} BPM). Die physiologischen Daten deuten auf ein erhöhtes Verletzungsrisiko hin. Ich empfehle die sofortige Belastungssteuerung oder eine taktische Rotation, um die muskuläre Integrität zu schützen.`;
        if(spo2 < 95) return `WARNUNG: Die Sauerstoffsättigung von ${p.name} ist auf ${spo2}% gesunken. Die respiratorische Erholung ist im Vergleich zu den Vorwochen verzögert. Prüfen Sie die Fitnesswerte vor dem nächsten hochintensiven Training.`;
        
        return `ANALYSE: ${p.name} zeigt eine herausragende Verfassung. Mit einem stabilen Ruhepuls und optimaler Sättigung ist der Spieler bereit für taktische Höchstleistungen. Die Evolution Matrix bestätigt den Aufwärtstrend im Bereich ${p.pos}. Volle Einsatzbereitschaft für das Matchday-Szenario.`;
    },

    renderInitialState: function() {
        return `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; opacity:0.4;">
                <div style="width:160px; height:160px; border:2px dashed var(--neon-green); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:40px; animation: pulse-glow 2s infinite;">
                    <i class="fas fa-microchip" style="font-size:4rem; color:var(--neon-green);"></i>
                </div>
                <h3 style="letter-spacing:8px; font-weight:900; color:#fff; margin:0; text-transform:uppercase;">AI Engine Ready</h3>
                <p style="font-size:0.95rem; color:var(--text-dim); margin-top:20px; max-width:450px; line-height:1.7;">Analysiere die biometrischen Daten deines Kaders. Wähle einen Spieler aus der Liste, um das neuronale Dossier zu laden.</p>
            </div>`;
    }
};
