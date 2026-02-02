/**
 * =========================================
 * TONI 2.0 – SPONSORING MANAGEMENT
 * Verträge, Assets & Platzierungs-Generator
 * =========================================
 */
(function() {
    window.Sponsoring = {
        partners: [
            { id: 1, name: "NeonEnergy", tier: "Premium", assets: ["Logo_Main", "Banner_Pitch"], color: "#FF6A00" },
            { id: 2, name: "CyanBank", tier: "Standard", assets: ["Logo_Small"], color: "#00D1FF" }
        ],

        init() {
            console.log("💰 Sponsoring-Modul: Aktiviert.");
        },

        show() {
            const stage = document.getElementById('stage');
            // Verstecke Arena/Planner
            document.getElementById('main-canvas').style.display = 'none';
            if(document.getElementById('training-planner')) document.getElementById('training-planner').style.display = 'none';

            let spPanel = document.getElementById('sponsoring-panel');
            if (!spPanel) {
                spPanel = document.createElement('div');
                spPanel.id = 'sponsoring-panel';
                stage.appendChild(spPanel);
            }
            spPanel.style.display = 'block';
            this.renderDashboard();
        },

        renderDashboard() {
            const container = document.getElementById('sponsoring-panel');
            container.innerHTML = `
                <div style="padding: 40px; background: #0B1220; height: 100%;">
                    <h2 style="color: #FF6A00; text-transform: uppercase; margin-bottom: 30px;">Sponsoring & Aktivierung</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="sponsor-card" style="background: #1A2233; padding: 20px; border: 1px solid #FF6A00;">
                            <h3>Vertrags-Status</h3>
                            <p>Premium-Partner: NeonEnergy (Aktiv)</p>
                            <button class="tool-btn" style="margin-top: 10px;">Assets hochladen</button>
                        </div>
                        <div class="sponsor-card" style="background: #1A2233; padding: 20px; border: 1px solid #00D1FF;">
                            <h3>Platzierungs-KI</h3>
                            <p>Optimale Logo-Position in Stadionzeitung berechnet.</p>
                            <button class="tool-btn" onclick="Stadionzeitung.show()">Vorschau Zeitung</button>
                        </div>
                    </div>
                </div>
            `;
        }
    };
})();
