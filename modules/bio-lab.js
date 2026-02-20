const bioLab = {
    data: JSON.parse(localStorage.getItem('toni_bio')) || [
        { name: "Müller", rhr: 48, hrv: 65, kfa: 11.5, h2o: 62.1, musc: 44.5, rpe: 4, vo2: 58 },
    ],

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        container.innerHTML = `
            <div class="bio-entry-form" style="background:var(--card); padding:20px; border-radius:15px; border:1px solid var(--accent); margin-bottom:20px;">
                <h3>Pro-CheckIn (Watch & Scale Data)</h3>
                <div class="bio-input-grid">
                    <select id="bio-p">${this.data.map(p=>`<option>${p.name}</option>`).join('')}</select>
                    <input type="number" id="bio-rhr" placeholder="RHR (Puls)">
                    <input type="number" id="bio-hrv" placeholder="HRV (Stress)">
                    <input type="number" step="0.1" id="bio-kfa" placeholder="KFA (%)">
                    <input type="number" step="0.1" id="bio-h2o" placeholder="Wasser (%)">
                    <input type="number" step="0.1" id="bio-mus" placeholder="Muskel (kg)">
                    <input type="number" id="bio-vo2" placeholder="VO2 Max">
                    <input type="number" id="bio-rpe" placeholder="Last (RPE 1-10)">
                    <button class="action-btn" onclick="bioLab.submit()">LOG ANALYSE</button>
                </div>
            </div>
            <div class="card-grid">
                ${this.data.map(p => `
                    <div class="bio-card">
                        <b>${p.name}</b> <span class="pulse-heart">❤️</span>
                        <div style="font-size:11px; margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px;">
                            <span>RHR: ${p.rhr}</span><span>HRV: ${p.hrv}</span>
                            <span>KFA: ${p.kfa}%</span><span>H2O: ${p.h2o}%</span>
                            <span>VO2: ${p.vo2}</span><span>RPE: ${p.rpe}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    submit: function() {
        const name = document.getElementById('bio-p').value;
        const p = this.data.find(x => x.name === name);
        p.rhr = document.getElementById('bio-rhr').value;
        p.hrv = document.getElementById('bio-hrv').value;
        p.kfa = document.getElementById('bio-kfa').value;
        p.rpe = document.getElementById('bio-rpe').value;
        localStorage.setItem('toni_bio', JSON.stringify(this.data));
        this.render(); addMessage("Toni", `${name} Daten synchronisiert.`);
    }
};
window.addEventListener('load', () => bioLab.init());
