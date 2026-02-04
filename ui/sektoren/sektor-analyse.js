/**
 * TONI 2.0 - INTERNATIONAL PERFORMANCE LAB
 * Professional Analytics: Radar-Matrix, Medical Trends & Evolution Tracking.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px; height: 82vh; animation: fadeIn 0.4s ease-out;">
                
                <div style="background: rgba(255,255,255,0.02); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 20px; overflow-y: auto;">
                    <div style="margin-bottom:25px;">
                        <h2 style="color:var(--neon-green); font-size:0.75rem; letter-spacing:3px; margin:0;">PERFORMANCE LAB</h2>
                        <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Global Scouting Standards</p>
                    </div>
                    ${this.renderSquadSidebar(players)}
                </div>

                <div id="analysis-console" style="background: rgba(13, 20, 33, 0.6); border-radius: 20px; border: 1px solid rgba(57,255,20,0.1); padding: 40px; position:relative; overflow-y:auto;">
                    ${this.renderInitialState()}
                </div>

            </div>`;
    },

    renderSquadSidebar: function(players) {
        if(players.length === 0) return `<p style="color:var(--text-dim); font-size:0.8rem;">Keine Kaderdaten verfügbar.</p>`;

        const starters = players.filter(p => p.isStarter);
        const bench = players.filter(p => !p.isStarter);

        const renderItem = (p) => {
            const isSel = this.selectedPlayerId === p.id;
            return `
                <div onclick="SektorAnalyse.selectPlayer('${p.id}')" 
                     style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:10px; cursor:pointer; border-radius:10px; 
                            background: ${isSel ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255,255,255,0.03)'}; 
                            border: 1px solid ${isSel ? 'var(--neon-green)' : 'transparent'}; transition: 0.3s;">
                    <div style="width:35px; height:35px; background:#000; border:1px solid var(--accent-gold); border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.8rem;">
                        ${p.number}
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:0.8rem; font-weight:700; color:#fff;">${p.name.toUpperCase()}</div>
                        <div style="font-size:0.55rem; color:var(--text-dim);">${p.pos} | ${p.status}</div>
                    </div>
                </div>`;
        };

        return `
            <h4 style="font-size:0.6rem; color:var(--accent-gold); margin:20px 0 10px 0;">STARTING XI</h4>
            ${starters.map(p => renderItem(p)).join('')}
            <h4 style="font-size:0.6rem; color:var(--text-dim); margin:20px 0 10px 0;">SUBSTITUTES</h4>
            ${bench.map(p => renderItem(p)).join('')}
        `;
    },

    selectPlayer: function(id) {
        this.selectedPlayerId = id;
        this.render(); 
        this.updateDetailView(id);
    },

    updateDetailView: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id === id);
        const console = document.getElementById('analysis-console');
        if(!p || !console) return;

        console.innerHTML = `
            <div style="animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px;">
                    <div style="display:flex; gap:20px; align-items:center;">
                        <img src="${p.photoUrl || ''}" style="width:90px; height:90px; border-radius:15px; border:2px solid var(--neon-green); object-fit:cover;">
                        <div>
                            <h1 style="margin:0; font-size:2.5rem; font-weight:900; letter-spacing:-1px;">${p.name.toUpperCase()}</h1>
                            <span style="color:var(--neon-green); font-weight:900; letter-spacing:2px; font-size:0.7rem;">INTERNATIONAL PERFORMANCE DOSSIER</span>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:2.5rem; font-weight:900; color:var(--accent-gold); line-height:1;">${p.rating || 80}</div>
                        <div style="font-size:0.6rem; color:var(--text-dim); font-weight:bold;">OVERALL RATING</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(212,175,55,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--accent-gold); margin-bottom:20px; letter-spacing:2px;">PERFORMANCE RADAR-MATRIX</h3>
                        ${this.renderSkillBars(p.skills)}
                    </div>

                    <div style="background:rgba(0,209,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(0,209,255,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--data-cyan); margin-bottom:20px; letter-spacing:2px;">EVOLUTION MATRIX (LAST 3 DAYS)</h3>
                        <div style="display:flex; flex-direction:column; gap:20px;">
                            ${this.renderVitalTrend("PULS (BPM)", p.vitals?.pulse || 72, [74, 69, p.vitals?.pulse || 72], "var(--status-fit)")}
                            ${this.renderVitalTrend("SAUERSTOFF (SpO2)", p.vitals?.spo2 || 98, [96, 98, p.vitals?.spo2 || 98], "var(--data-cyan)")}
                        </div>
                    </div>

                    <div style="grid-column: span 2; background:rgba(57,255,20,0.03); padding:30px; border-radius:15px; border:1px solid rgba(57,255,20,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--neon-green); margin-bottom:15px; letter-spacing:2px;">INTERNATIONAL PRO-SCOUTING REPORT</h3>
                        <p style="font-size:0.95rem; line-height:1.7; color:#fff; font-style:italic;">
                            "${this.generateProReport(p)}"
                        </p>
                    </div>
                </div>
            </div>`;
    },

    renderSkillBars: function(skills) {
        const s = skills || { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 };
        const labels = { spr: 'SPEED', aus: 'STAMINA', tec: 'TECH', pas: 'PASS', phy: 'PHYSIC' };
        
        return Object.keys(labels).map(key => `
            <div style="margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; font-size:0.6rem; font-weight:900; margin-bottom:5px;">
                    <span>${labels[key]}</span>
                    <span style="color:var(--neon-green);">${s[key]}%</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                    <div style="width:${s[key]}%; height:100%; background:var(--accent-gold); box-shadow:0 0 10px rgba(212,175,55,0.3);"></div>
                </div>
            </div>
        `).join('');
    },

    renderVitalTrend: function(label, current, history, color) {
        return `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:0.65rem; margin-bottom:8px;">
                    <span style="color:var(--text-dim);">${label}</span>
                    <span style="font-weight:900; color:#fff;">${current}</span>
                </div>
                <div style="display:flex; align-items:flex-end; gap:8px; height:50px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    ${history.map(val => {
                        // Dynamische Höhe für Trend-Visualisierung
                        const h = (val / (label.includes("PULS") ? 200 : 100)) * 100;
                        return `<div style="flex:1; height:${h}%; background:${color}; opacity:0.6; border-radius:3px 3px 0 0;"></div>`;
                    }).join('')}
                </div>
            </div>`;
    },

    generateProReport: function(p) {
        const kpis = p.proKpis || { rsa: 75, stress: 75 };
        if(p.status !== 'FIT') return `Achtung Coach: Die medizinische Abteilung empfiehlt für ${p.name} ein individuelles Belastungs-Management. Ein Einsatz in der Startelf ist bei den aktuellen Vitalwerten (Trend abfallend) nicht ratsam.`;
        if(p.rating > 85) return `${p.name} agiert auf absolutem Weltklasse-Niveau. Seine Stress-Resistenz (${kpis.stress}) und die Antizipation von vertikalen Räumen machen ihn zum unverzichtbaren Anker in unserem System.`;
        return `${p.name} zeigt eine stabile Leistungs-Entwicklung in der Evolution-Matrix. Besonders die RSA-Werte (Sprint-Ausdauer) haben sich über die letzten 3 Tage positiv stabilisiert. Einsatzbereit für volle 90 Minuten.`;
    },

    renderInitialState: function() {
        return `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; opacity:0.4;">
                <i class="fas fa-chart-network" style="font-size:4rem; color:var(--neon-green); margin-bottom:20px;"></i>
                <h3 style="letter-spacing:4px; font-weight:900;">READY FOR PRO-ANALYSIS</h3>
                <p style="font-size:0.8rem;">Wähle einen Profi aus dem Kader-Panel links aus,<br>um das internationale Performance-Dossier zu laden.</p>
            </div>`;
    }
};
