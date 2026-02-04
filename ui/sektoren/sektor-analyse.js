/**
 * TONI 2.0 - INTERNATIONAL PERFORMANCE LAB (PRO-EDITION)
 * Professional Analytics: Evolution Tracking & AI-Scouting Reports.
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
                    ${this.selectedPlayerId ? this.renderDetailView(this.selectedPlayerId) : this.renderInitialState()}
                </div>

            </div>`;
    },

    renderSquadSidebar: function(players) {
        if(players.length === 0) return `<p style="color:var(--text-dim); font-size:0.8rem;">Keine Kaderdaten verfügbar.</p>`;

        const starters = players.filter(p => p.isStarter);
        const bench = players.filter(p => !p.isStarter && p.isNominated);

        const renderItem = (p) => {
            const isSel = this.selectedPlayerId === p.id;
            return `
                <div onclick="SektorAnalyse.selectPlayer('${p.id}')" 
                     style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:10px; cursor:pointer; border-radius:10px; 
                            background: ${isSel ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255,255,255,0.03)'}; 
                            border: 1px solid ${isSel ? 'var(--neon-green)' : 'transparent'}; transition: 0.3s;">
                    <div style="width:35px; height:35px; background:#000; border:1px solid var(--accent-gold); border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.8rem; color:#fff;">
                        ${p.number}
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:0.8rem; font-weight:700; color:#fff;">${p.name.toUpperCase()}</div>
                        <div style="font-size:0.55rem; color:var(--text-dim);">${p.pos} | ${p.isPresent ? 'ANWESEND' : 'ABWESEND'}</div>
                    </div>
                </div>`;
        };

        return `
            <h4 style="font-size:0.6rem; color:var(--accent-gold); margin:20px 0 10px 0; letter-spacing:1px;">STARTING XI</h4>
            ${starters.map(p => renderItem(p)).join('')}
            <h4 style="font-size:0.6rem; color:var(--text-dim); margin:20px 0 10px 0; letter-spacing:1px;">SUBSTITUTES</h4>
            ${bench.length > 0 ? bench.map(p => renderItem(p)).join('') : '<p style="font-size:0.5rem; color:#444;">Keine Auswechselspieler nominiert.</p>'}
        `;
    },

    selectPlayer: function(id) {
        this.selectedPlayerId = id;
        this.render(); 
    },

    renderDetailView: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id === id);
        if(!p) return this.renderInitialState();

        const formTrend = p.formHistory || [p.rating - 2, p.rating - 1, p.rating + 1, p.rating];

        return `
            <div style="animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px;">
                    <div style="display:flex; gap:20px; align-items:center;">
                        <div style="width:90px; height:90px; border-radius:15px; border:2px solid var(--neon-green); overflow:hidden; background:#111;">
                            <img src="${p.photoUrl || 'https://via.placeholder.com/150/000/39FF14?text=' + p.name[0]}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div>
                            <h1 style="margin:0; font-size:2.5rem; font-weight:900; letter-spacing:-1px; color:#fff;">${p.name.toUpperCase()}</h1>
                            <span style="color:var(--neon-green); font-weight:900; letter-spacing:2px; font-size:0.7rem;">ELITE PERFORMANCE DOSSIER</span>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:2.5rem; font-weight:900; color:var(--accent-gold); line-height:1;">${p.rating || 80}</div>
                        <div style="font-size:0.6rem; color:var(--text-dim); font-weight:bold;">OVERALL KPI</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(212,175,55,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--accent-gold); margin-bottom:20px; letter-spacing:2px;">PERFORMANCE RADAR-MATRIX</h3>
                        ${this.renderSkillBars(p.skills || { spr: 82, aus: 78, tec: 88, pas: 90, phy: 75 })}
                    </div>

                    <div style="background:rgba(0,209,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(0,209,255,0.1);">
                        <h3 style="font-size:0.65rem; color:var(--data-cyan); margin-bottom:20px; letter-spacing:2px;">EVOLUTION MATRIX (TREND)</h3>
                        <div style="display:flex; flex-direction:column; gap:20px;">
                            ${this.renderVitalTrend("MARKET VALUE / RATING", p.rating, formTrend, "var(--neon-green)")}
                            ${this.renderVitalTrend("PULS-LOAD (LAST 5)", p.vitals?.pulse || 72, [74, 69, 71, 75, p.vitals?.pulse || 72], "var(--status-error)")}
                        </div>
                    </div>

                    <div style="grid-column: span 2; background:rgba(57,255,20,0.03); padding:30px; border-radius:15px; border:1px solid rgba(57,255,20,0.1); position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; right:0; padding:10px; background:rgba(57,255,20,0.1); font-size:0.5rem; color:var(--neon-green); font-weight:900;">AI ANALYZED</div>
                        <h3 style="font-size:0.65rem; color:var(--neon-green); margin-bottom:15px; letter-spacing:2px;">TONI [PRO] ANALYST REPORT</h3>
                        <p id="ai-report-text" style="font-size:0.95rem; line-height:1.7; color:#fff; font-style:italic;">
                            "${this.generateProReport(p)}"
                        </p>
                    </div>
                </div>
            </div>`;
    },

    renderSkillBars: function(skills) {
        const labels = { spr: 'SPEED', aus: 'STAMINA', tec: 'TECH', pas: 'PASS', phy: 'PHYSIC' };
        return Object.keys(labels).map(key => `
            <div style="margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; font-size:0.6rem; font-weight:900; margin-bottom:5px; color:#fff;">
                    <span>${labels[key]}</span>
                    <span style="color:var(--neon-green);">${skills[key]}%</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                    <div style="width:${skills[key]}%; height:100%; background:var(--accent-gold); box-shadow:0 0 10px rgba(212,175,55,0.3);"></div>
                </div>
            </div>
        `).join('');
    },

    renderVitalTrend: function(label, current, history, color) {
        return `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:0.65rem; margin-bottom:8px; color:#fff;">
                    <span style="color:var(--text-dim);">${label}</span>
                    <span style="font-weight:900;">${current}</span>
                </div>
                <div style="display:flex; align-items:flex-end; gap:8px; height:50px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    ${history.map(val => {
                        const max = label.includes("PULS") ? 200 : 100;
                        const h = (val / max) * 100;
                        return `<div style="flex:1; height:${h}%; background:${color}; opacity:0.6; border-radius:3px 3px 0 0;"></div>`;
                    }).join('')}
                </div>
            </div>`;
    },

    generateProReport: function(p) {
        // Fallback-Bericht, falls die KI-Schnittstelle gerade beschäftigt ist
        const pulse = p.vitals?.pulse || 70;
        if(pulse > 160) return `Achtung Coach Björn: ${p.name} zeigt kritische Puls-Werte. Eine Reduzierung der Belastung im nächsten Block ist zwingend erforderlich.`;
        return `${p.name} agiert aktuell auf einem stabilen ${p.rating}er Niveau. Die RSA-Werte sind exzellent. Toni empfiehlt: Volle Integration in die taktische Endphase.`;
    },

    renderInitialState: function() {
        return `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; opacity:0.4;">
                <i class="fas fa-chart-line" style="font-size:4rem; color:var(--neon-green); margin-bottom:20px;"></i>
                <h3 style="letter-spacing:4px; font-weight:900; color:#fff;">READY FOR ANALYTICS</h3>
                <p style="font-size:0.8rem; color:#fff;">Wähle einen Spieler aus der Kaderliste links aus,<br>um die Tiefenanalyse von Toni zu starten.</p>
            </div>`;
    }
};
