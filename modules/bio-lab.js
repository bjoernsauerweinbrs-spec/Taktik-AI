const bioLab = {
    playerHealth: [
        { id: 1, name: "Müller", rhr: 48, hrv: 65, sleep: 8.2, kfa: 11.5, status: "fit" },
        { id: 2, name: "Schmidt", rhr: 56, hrv: 41, sleep: 5.8, kfa: 13.0, status: "warning" }
    ],

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        if (!container) return;

        container.innerHTML = `
            <div style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid var(--accent-color); margin-bottom: 25px;">
                <h3 style="margin-top:0">Trainer-Dashboard: Wearable Check-In</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <select id="sel-player" style="background:#0f172a; color:white; padding:10px; border-radius:5px;">
                        ${this.playerHealth.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                    </select>
                    <input type="number" id="in-rhr" placeholder="Puls (RHR)">
                    <input type="number" id="in-hrv" placeholder="Stress (HRV)">
                    <input type="number" step="0.1" id="in-sleep" placeholder="Schlaf (h)">
                    <input type="number" step="0.1" id="in-kfa" placeholder="Körperfett (%)">
                    <button class="action-btn" onclick="bioLab.submit()" style="grid-column: span 3; margin-top:10px;">DATEN ANALYSIEREN</button>
                </div>
            </div>

            <div class="lab-grid">
                ${this.playerHealth.map(p => `
                    <div class="bio-card" style="border-left: 6px solid ${p.status === 'fit' ? '#22c55e' : '#f59e0b'};">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b>${p.name}</b> <span class="pulse-heart">❤️</span>
                        </div>
                        <svg viewBox="0 0 100 25" style="height:40px; width:100%; margin:10px 0;">
                            <path class="ekg-path" d="M0 12 L10 12 L15 2 L20 22 L25 12 L100 12" stroke="${p.status === 'fit' ? '#22c55e' : '#f59e0b'}" />
                        </svg>
                        <div style="display:grid; grid-template-columns:1fr 1fr; font-size:11px; color:#94a3b8; gap:5px;">
                            <span>RHR: <b>${p.rhr}</b></span><span>HRV: <b>${p.hrv}</b></span>
                            <span>Schlaf: <b>${p.sleep}h</b></span><span>KFA: <b>${p.kfa}%</b></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    submit: function() {
        const id = parseInt(document.getElementById('sel-player').value);
        const rhr = parseInt(document.getElementById('in-rhr').value);
        const hrv = parseInt(document.getElementById('in-hrv').value);
        const player = this.playerHealth.find(p => p.id === id);
        
        player.rhr = rhr; player.hrv = hrv;
        player.status = (rhr > 62 || hrv < 45) ? "warning" : "fit";
        this.render();
        addMessage("Toni", `Analyse ${player.name}: ${player.status === 'fit' ? 'Top-Zustand.' : 'Überbelastung droht.'}`);
    }
};
window.addEventListener('load', () => bioLab.init());
