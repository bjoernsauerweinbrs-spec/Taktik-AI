/* --- BIO-LAB MODUL (Trainer-Dashboard) --- */

const bioLab = {
    playerHealth: [
        { id: 1, name: "Müller", rhr: 48, hrv: 65, sleep: 8.2, kfa: 11.5, status: "fit" },
        { id: 2, name: "Schmidt", rhr: 55, hrv: 42, sleep: 6.1, kfa: 13.2, status: "warning" }
    ],

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        if (!container) return;

        container.innerHTML = `
            <div style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid var(--accent-color); margin-bottom: 20px;">
                <h3>Trainer-Eingabe (Wearable-Daten)</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <select id="login-name" style="padding: 10px; border-radius: 5px; background: #0f172a; color: white;">
                        ${this.playerHealth.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                    </select>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="number" id="in-rhr" placeholder="Ruhepuls (RHR)">
                        <input type="number" id="in-hrv" placeholder="Stress (HRV)">
                        <input type="number" step="0.1" id="in-sleep" placeholder="Schlaf (h)">
                        <input type="number" step="0.1" id="in-kfa" placeholder="Körperfett (%)">
                    </div>
                    <button class="action-btn" onclick="bioLab.submitData()">Werte analysieren</button>
                </div>
            </div>

            <div class="lab-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                ${this.playerHealth.map(p => `
                    <div class="bio-card" style="background:#0f172a; padding:15px; border-radius:12px; border-top:4px solid ${p.status === 'fit' ? '#22c55e' : '#f59e0b'};">
                        <div style="display:flex; justify-content:space-between;">
                            <b>${p.name}</b> <span class="heart-icon">❤️</span>
                        </div>
                        <svg viewBox="0 0 100 20" style="height:30px; width:100%; margin:10px 0;">
                            <path class="ekg-path" d="M0 10 L10 10 L15 2 L20 18 L25 10 L100 10" stroke="${p.status === 'fit' ? '#22c55e' : '#f59e0b'}" />
                        </svg>
                        <div style="font-size:11px; color:#94a3b8; display:grid; grid-template-columns:1fr 1fr;">
                            <span>Puls: ${p.rhr}</span><span>HRV: ${p.hrv}</span>
                            <span>Schlaf: ${p.sleep}h</span><span>KFA: ${p.kfa}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    submitData: function() {
        const id = parseInt(document.getElementById('login-name').value);
        const rhr = parseInt(document.getElementById('in-rhr').value);
        const hrv = parseInt(document.getElementById('in-hrv').value);
        const player = this.playerHealth.find(p => p.id === id);
        
        player.rhr = rhr; player.hrv = hrv;
        player.status = (rhr > 60 || hrv < 45) ? "warning" : "fit";
        
        this.render();
        addMessage("Toni", `Analyse für ${player.name}: ${player.status === 'fit' ? 'Topfit!' : 'Belastung steuern.'}`);
    }
};
window.addEventListener('load', () => bioLab.init());
