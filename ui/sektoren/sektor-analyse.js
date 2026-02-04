/**
 * TONI 2.0 - SEKTOR ANALYSEZENTRUM
 * Visualisierung von Performance-Daten, BMI-Trends und Trainings-Empfehlungen.
 */

window.SektorAnalyse = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avgBmi = this.calculateAverageBmi(players);

        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; color:var(--text-main);">
                <h3 style="color:var(--data-cyan); margin-bottom:20px; letter-spacing:2px;">PERFORMANCE DASHBOARD</h3>
                
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; margin-bottom:30px;">
                    <div class="kpi-card">
                        <span style="font-size:0.6rem; color:var(--text-dim);">DURCHSCHNITT. BMI</span>
                        <div style="font-size:1.8rem; font-weight:900; color:var(--data-cyan);">${avgBmi}</div>
                        <div class="bmi-bar"><div class="bmi-fill" style="width:${(avgBmi/30)*100}%"></div></div>
                    </div>
                    <div class="kpi-card" style="border-left-color:var(--status-fit);">
                        <span style="font-size:0.6rem; color:var(--text-dim);">KADER-STATUS</span>
                        <div style="font-size:1.8rem; font-weight:900; color:var(--status-fit);">${players.filter(p => p.status==='FIT').length} / ${players.length}</div>
                        <span style="font-size:0.5rem;">EINSATZBEREIT</span>
                    </div>
                    <div class="kpi-card" style="border-left-color:var(--accent-orange);">
                        <span style="font-size:0.6rem; color:var(--text-dim);">TRAININGS-VORSCHLAG</span>
                        <div style="font-size:0.8rem; font-weight:bold; margin-top:5px; color:#fff;">REGENERATION</div>
                        <button onclick="SektorAnalyse.generatePackage()" style="background:none; border:1px solid var(--accent-orange); color:var(--accent-orange); font-size:0.5rem; padding:3px 8px; margin-top:5px; cursor:pointer; border-radius:3px;">JETZT GENERIEREN</button>
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:15px; border:1px solid #222;">
                    <h4 style="font-size:0.8rem; margin-top:0; color:var(--text-dim);">SPIELER-ENTWICKLUNG (VORSCHAU)</h4>
                    <div style="height:150px; display:flex; align-items:flex-end; gap:10px; padding-bottom:10px; border-bottom:1px solid #333;">
                        ${this.renderChartBars(players)}
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.6rem; color:var(--text-dim);">
                        <span>MONTAG</span><span>HEUTE</span><span>MATCHDAY</span>
                    </div>
                </div>

                <h4 style="font-size:0.8rem; margin-top:30px; color:var(--text-dim);">FITNESS-CHECK EINZELANALYSE</h4>
                <div style="max-height:200px; overflow-y:auto;">
                    <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
                        <tr style="text-align:left; color:var(--data-cyan); border-bottom:1px solid #333;">
                            <th style="padding:10px 5px;">SPIELER</th>
                            <th>STATUS</th>
                            <th>BMI</th>
                            <th>EMPFEHLUNG</th>
                        </tr>
                        ${players.map(p => this.renderTableRow(p)).join('')}
                    </table>
                </div>
            </div>
        `;
    },

    calculateAverageBmi: function(players) {
        if(!players.length) return 0;
        const sum = players.reduce((acc, p) => {
            const h = p.height || 180;
            const w = p.weight || 75;
            return acc + (w / ((h/100)*(h/100)));
        }, 0);
        return (sum / players.length).toFixed(1);
    },

    renderChartBars: function(players) {
        return players.slice(0, 10).map(p => {
            const height = Math.random() * 80 + 20; // Simulation
            return `<div style="flex:1; height:${height}%; background:var(--data-cyan); opacity:0.6; border-radius:2px 2px 0 0;" title="${p.name}"></div>`;
        }).join('');
    },

    renderTableRow: function(p) {
        const h = p.height || 180;
        const w = p.weight || 75;
        const bmi = (w / ((h/100)*(h/100))).toFixed(1);
        let rec = bmi > 25 ? "Ausdauer-Fokus" : "Kraft-Aufbau";
        if(p.status === 'OFF') rec = "Physiotherapie";

        return `
            <tr style="border-bottom:1px solid #111;">
                <td style="padding:10px 5px;">${p.name}</td>
                <td><span class="status-indicator ${p.status === 'FIT' ? 'status-fit' : (p.status === 'WARN' ? 'status-warn' : 'status-error')}" style="position:relative; display:inline-block; margin-right:5px;"></span> ${p.status}</td>
                <td>${bmi}</td>
                <td style="color:var(--text-dim);">${rec}</td>
            </tr>
        `;
    },

    generatePackage: function() {
        if(window.ToniTTS) ToniTTS.speak("Analysiere Kaderstatus. Generiere personalisiertes Trainingspaket für Björn.", "deep");
        alert("Trainingspaket-Generierung gestartet. Das PDF wird im Modul TRAINING bereitgestellt.");
    }
};
