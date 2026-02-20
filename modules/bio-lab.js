/* --- BIO-LAB MODUL (High-Tech Dashboard) --- */

const bioLab = {
    playerHealth: [
        { id: 1, name: "Müller", hr: 62, sleep: 8.2, stress: 2, status: "fit" },
        { id: 2, name: "Schmidt", hr: 78, sleep: 5.4, stress: 7, status: "warning" },
        { id: 3, name: "Schneider", hr: 58, sleep: 7.8, stress: 3, status: "fit" }
    ],

    init: function() {
        this.render();
    },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        if (!container) return;

        container.innerHTML = `
            <div style="grid-column: 1 / -1; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid var(--accent-color); margin-bottom: 20px;">
                <h3 style="margin-top:0">Spieler Selbstauskunft (Login)</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <select id="login-name" style="padding: 10px; border-radius: 5px; background: #0f172a; color: white; border: 1px solid #334155;">
                        ${this.playerHealth.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                    </select>
                    <input type="number" id="login-hr" placeholder="Puls (BPM)" style="padding: 10px; border-radius: 5px; width: 100px;">
                    <input type="number" id="login-sleep" placeholder="Schlaf (h)" style="padding: 10px; border-radius: 5px; width: 100px;">
                    <button class="action-btn" style="width: auto; padding: 10px 20px;" onclick="bioLab.submitData()">Daten senden</button>
                </div>
            </div>

            <div class="lab-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; width: 100%;">
                ${this.playerHealth.map(p => `
                    <div class="bio-card ${p.status}" style="background: #0f172a; padding: 15px; border-radius: 12px; border-left: 5px solid ${p.status === 'fit' ? '#22c55e' : '#f59e0b'};">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b>${p.name}</b>
                            <span style="animation: pulseHeart 1s infinite">❤️</span>
                        </div>
                        <div style="height: 40px; margin: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <svg viewBox="0 0 100 20" style="width:100%; height:100%;">
                                <path d="M0 10 L10 10 L15 2 L20 18 L25 10 L100 10" fill="none" stroke="${p.status === 'fit' ? '#22c55e' : '#f59e0b'}" stroke-width="2" />
                            </svg>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8;">
                            <span>Puls: <b>${p.hr}</b></span>
                            <span>Schlaf: <b>${p.sleep}h</b></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    submitData: function() {
        const id = parseInt(document.getElementById('login-name').value);
        const hr = parseInt(document.getElementById('login-hr').value);
        const sleep = parseFloat(document.getElementById('login-sleep').value);
        
        if(isNaN(hr) || isNaN(sleep)) {
            addMessage("System", "Bitte alle Felder korrekt ausfüllen.");
            return;
        }

        const player = this.playerHealth.find(p => p.id === id);
        player.hr = hr;
        player.sleep = sleep;
        player.status = (hr > 85 || sleep < 6) ? "warning" : "fit";

        this.render();
        addMessage("Toni", `Daten für ${player.name} empfangen. Analyse: ${player.status === 'fit' ? 'Topfit!' : 'Achtung: Erhöhte Belastung erkannt.'}`);
    }
};

window.addEventListener('load', () => bioLab.init());
