/* ==========================================================
   MANAGEMENT LAB | EXECUTIVE ROI & ASSET ENGINE
   ========================================================== */

const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        liquidAssets: 15250000, 
        sponsorships: [
            { partner: "Global Dynamics", value: 3500000, status: "Active", kpi: 0.88 },
            { partner: "CyberFit Analytics", value: 1200000, status: "Active", kpi: 0.94 },
            { partner: "Elite Energy", value: 950000, status: "Pending", kpi: 0.60 }
        ],
        infrastructure: [
            { name: "Medical Excellence Center", level: 4, effect: "Injury Risk -12%" },
            { name: "VR Tactical Hub", level: 5, effect: "Tactical Growth +20%" }
        ]
    },

    init: function() {
        this.render();
    },

    /**
     * BERECHNET DEN FINANZIELLEN RISK-INDEX
     * Koppelung von ACWR (Medizin) und Marktwert (Asset)
     */
    getRiskAnalysis: function() {
        const players = typeof eliteStore !== 'undefined' ? eliteStore.players : [];
        let totalRiskValue = 0;

        players.forEach(p => {
            const acute = p.load.slice(-7).reduce((a,b) => a+b, 0) / 7;
            const chronic = p.load.reduce((a,b) => a+b, 0) / p.load.length;
            const acwr = chronic > 0 ? (acute / chronic) : 1.0;

            // Risiko-Kosten: Ein verletzter Top-Spieler kostet prozentual seinen Marktwert
            if (acwr > 1.5) {
                totalRiskValue += (p.rating * 150000); 
            }
        });
        return totalRiskValue;
    },

    render: function() {
        const container = document.getElementById('mgmt-dashboard');
        if (!container) return;

        const squadValue = (typeof eliteStore !== 'undefined' ? eliteStore.players.length : 0) * 8500000;
        const risk = this.getRiskAnalysis();

        container.innerHTML = `
            <div class="mgmt-grid">
                <div class="mgmt-card high-end">
                    <h3 class="orbitron">CAPITAL ASSETS</h3>
                    <div class="big-value">${(this.data.liquidAssets / 1000000).toFixed(2)}M €</div>
                    <p>Squad Market Value: ${(squadValue / 1000000).toFixed(1)}M €</p>
                    <div class="risk-bar">
                        <div class="risk-fill" style="width: ${(risk / 5000000 * 100)}%; background: #ef4444;"></div>
                    </div>
                    <small>Market Risk Exposure: <span style="color:#ef4444">${risk.toLocaleString()} €</span></small>
                </div>

                <div class="mgmt-card">
                    <h3 class="orbitron">SPONSORSHIP PORTFOLIO</h3>
                    <div class="sp-table">
                        ${this.data.sponsorships.map(s => `
                            <div class="sp-row">
                                <span>${s.partner}</span>
                                <span class="sp-kpi">${(s.kpi * 100).toFixed(0)}% ROI</span>
                                <strong>${(s.value / 1000).toFixed(0)}k €</strong>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mgmt-card active-border">
                    <h3 class="orbitron">INFRASTRUCTURE UPGRADES</h3>
                    <div class="infra-list">
                        ${this.data.infrastructure.map(i => `
                            <div class="infra-item">
                                <strong>${i.name} (Lvl ${i.level})</strong>
                                <p>${i.effect}</p>
                            </div>
                        `).join('')}
                    </div>
                    <button class="elite-btn" onclick="mgmt.invest()">INVEST: DATA-CENTER UPGRADE (2.5M €)</button>
                </div>
            </div>
        `;
    },

    invest: function() {
        if (this.data.liquidAssets >= 2500000) {
            this.data.liquidAssets -= 2500000;
            this.save();
            if (typeof voiceEngine !== 'undefined') voiceEngine.speak("Investition bestätigt. Infrastruktur-Level erhöht.");
        }
    },

    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    }
};

window.addEventListener('load', () => mgmt.init());
