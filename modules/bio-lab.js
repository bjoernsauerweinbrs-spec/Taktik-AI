const bioLab = {
    players: JSON.parse(localStorage.getItem('toni_bio')) || [
        { name: "Müller", rhr: 48, hrv: 65, kfa: 11.2, mus: 44.8, h2o: 62.5, vo2: 58, rpe: 4, status: "fit" },
        { name: "Schmidt", rhr: 58, hrv: 41, kfa: 13.5, mus: 41.2, h2o: 59.8, vo2: 52, rpe: 8, status: "warning" }
    ],

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        container.innerHTML = `
            <div style="background:var(--card); padding:25px; border-radius:20px; border:1px solid var(--accent); margin-bottom:30px;">
                <h3>Pro-CheckIn: Watch & Scale Data</h3>
                <div class="bio-input-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px;">
                    <select id="sel-p" style="grid-column: span 2;">${this.players.map(p=>`<option>${p.name}</option>`).join('')}</select>
                    <input type="number" id="in-rhr" placeholder="RHR (Puls)">
                    <input type="number" id="in-hrv" placeholder="HRV (ms)">
                    <input type="number" step="0.1" id="in-kfa" placeholder="KFA (%)">
                    <input type="number" step="0.1" id="in-h2o" placeholder="H2O (%)">
                    <input type="number" step="0.1" id="in-mus" placeholder="Muskel (kg)">
                    <input type="number" id="in-vo2" placeholder="VO2 Max">
                    <div style="grid-column: span 2; display:flex; align-items:center; gap:10px;">
                        <span style="font-size:12px;">Last (RPE):</span>
                        <input type="range" id="in-rpe" min="1" max="10" value="5" style="flex:1;">
                    </div>
                    <button class="action-btn" onclick="bioLab.submit()" style="grid-column: span 2; margin-top:10px;">DATEN SYNCHRONISIEREN</button>
                </div>
            </div>
            <div class="card-grid">
                ${this.players.map(p => `
                    <div class="bio-card" style="border-left: 6px solid ${p.status==='fit'?'var(--accent)':'var(--warning)'};">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b>${p.name}</b> <span class="pulse-heart">❤️</span>
                        </div>
                        <svg viewBox="0 0 100 25" style="height:45px; width:100%; margin:15px 0;">
                            <path class="ekg-path" d="M0 12 L10 12 L15 2 L20 22 L25 12 L100 12" stroke="${p.status==='fit'?'var(--accent)':'var(--warning)'}" />
                        </svg>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:11px; color:#94a3b8;">
                            <span>RHR: <b>${p.rhr}</b></span><span>HRV: <b>${p.hrv}ms</b></span>
                            <span>KFA: <b>${p.kfa}%</b></span><span>Muskel: <b>${p.mus}kg</b></span>
                            <span>H2O: <b>${p.h2o}%</b></span><span>VO2: <b>${p.vo2}</b></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    submit: function() {
        const name = document.getElementById('sel-p').value;
        const p = this.players.find(x => x.name === name);
        p.rhr = document.getElementById('in-rhr').value || p.rhr;
        p.hrv = document.getElementById('in-hrv').value || p.hrv;
        p.kfa = document.getElementById('in-kfa').value || p.kfa;
        p.rpe = document.getElementById('in-rpe').value;
        p.status = (p.rhr > 60 || p.hrv < 45 || p.rpe > 7) ? "warning" : "fit";
        localStorage.setItem('toni_bio', JSON.stringify(this.players));
        this.render(); addMessage("Toni", `Bio-Update für ${name} abgeschlossen. Status: ${p.status.toUpperCase()}`);
    }
};
window.addEventListener('load', () => bioLab.init());
