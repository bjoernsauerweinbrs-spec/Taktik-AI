const bioLab = {
    players: JSON.parse(localStorage.getItem('toni_bio')) || [
        { name: "Müller", rhr: 48, hrv: 65, kfa: 11.2, mus: 45.1, h2o: 63.4, vo2: 58, rpe: 3 }
    ],

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        container.innerHTML = `
            <div style="background:var(--card); padding:20px; border-radius:15px; border:1px solid var(--accent); margin-bottom:20px;">
                <h3>Pro-CheckIn (Watch & Scale)</h3>
                <div class="bio-input-grid">
                    <select id="sel-p">${this.players.map(p=>`<option>${p.name}</option>`).join('')}</select>
                    <input type="number" id="in-rhr" placeholder="RHR (Puls)">
                    <input type="number" id="in-hrv" placeholder="HRV (Stress)">
                    <input type="number" step="0.1" id="in-kfa" placeholder="KFA (%)">
                    <input type="number" step="0.1" id="in-mus" placeholder="Muskel (kg)">
                    <input type="number" step="0.1" id="in-h2o" placeholder="Wasser (%)">
                    <input type="number" id="in-vo2" placeholder="VO2 Max">
                    <input type="number" id="in-rpe" placeholder="Last (1-10)">
                    <button class="action-btn" onclick="bioLab.submit()" style="grid-column: span 2;">SYNC DATA</button>
                </div>
            </div>
            <div class="card-grid">
                ${this.players.map(p => `
                    <div class="bio-card">
                        <b>${p.name}</b> <span style="animation: pulseHeart 1s infinite">❤️</span>
                        <div style="font-size:11px; margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px; color:#94a3b8;">
                            <span>RHR: ${p.rhr}</span><span>HRV: ${p.hrv}ms</span>
                            <span>KFA: ${p.kfa}%</span><span>Muskel: ${p.mus}kg</span>
                            <span>H2O: ${p.h2o}%</span><span>VO2: ${p.vo2}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    submit: function() {
        const name = document.getElementById('sel-p').value;
        const p = this.players.find(x => x.name === name);
        p.rhr = document.getElementById('in-rhr').value;
        p.hrv = document.getElementById('in-hrv').value;
        p.kfa = document.getElementById('in-kfa').value;
        localStorage.setItem('toni_bio', JSON.stringify(this.players));
        this.render();
    }
};
window.addEventListener('load', () => bioLab.init());
