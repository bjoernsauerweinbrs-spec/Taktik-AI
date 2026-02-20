/* ==========================================================
   MANAGEMENT LAB | EXECUTIVE COMMAND & ROI ENGINE
   ========================================================== */

const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI ELITE",
        liquidAssets: 12500000, // 12.5 Mio Startkapital
        squadValue: 85000000,
        infrastructure: [
            { id: 'INF-01', name: 'High-End Med-Center', level: 3, effect: 'Injury-Reduction -15%' },
            { id: 'INF-02', name: 'VR-Tactical Hub', level: 5, effect: 'Tactical-Growth +25%' }
        ],
        sponsorships: [
            { id: 'SP-01', partner: 'Global Dynamics', value: 2500000, type: 'Main', kpi: 0.85 },
            { id: 'SP-02', partner: 'CyberFit', value: 850000, type: 'Equipment', kpi: 0.92 }
        ],
        marketForecast: []
    },

    init: function() {
        this.calculateSquadROI();
        this.render();
    },

    /**
     * ROI CALCULATOR (Elite Metric)
     * Berechnet den finanziellen Impact von Training & Medizin
     */
    calculateSquadROI: function() {
        const players = eliteStore.players;
        this.data.squadValue = players.reduce((sum, p) => sum + (p.rating * 1000000), 0);
        
        // Risiko-Analyse: Wie viele Spieler sind im roten ACWR-Bereich?
        const riskyPlayers = players.filter(p => {
            const acute = p.load.slice(-7).reduce((a,b) => a+b, 0) / 7;
            const chronic = p.load.reduce((a,b) => a+b, 0) / p.load.length;
            return (acute / chronic) > 1.5;
        });
        
        this.data.riskValue = riskyPlayers.length * 2500000; // Potential loss in value
    },

    render: function() {
        const container = document.getElementById('mgmt-dashboard');
        if (!container) return;

        container.innerHTML = `
            <div class="mgmt-grid">
                <div class="mgmt-card high-end">
                    <div class="card-label">TOTAL SQUAD ASSETS</div>
                    <div class="card-value">${(this.data.squadValue / 1000000).toFixed(1)}M €</div>
                    <div class="card-sub">Market Risk Index: <span style="color:var(--danger)">-${(this.data.riskValue / 1000000).toFixed(1)}M €</span></div>
                    
                    <div class="chart-mini">
                        <div style="width:75%; background:var(--accent); height:100%"></div>
                    </div>
                </div>

                <div class="mgmt-card">
                    <h3 class="orbitron">Sponsorship CRM</h3>
                    <div class="sp-list">
                        ${this.data.sponsorships.map(s => `
                            <div class="sp-item">
                                <div class="sp-info">
                                    <span class="sp-name">${s.partner}</span>
                                    <span class="sp-type">${s.type}</span>
                                </div>
                                <div class="sp-value">${(s.value / 1000).toFixed(0)}k €</div>
                                <div class="sp-kpi-bar"><div style="width:${s.kpi * 100}%"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mgmt-card">
                    <h3 class="orbitron">Capital Investments</h3>
                    <div class="infra-grid">
                        ${this.data.infrastructure.map(i => `
                            <div class="infra-box">
                                <strong>${i.name}</strong>
                                <p>Lvl ${i.level}</p>
                                <small>${i.effect}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mgmt-card active-border">
                    <h3 class="orbitron">Strategic Decision Engine</h3>
                    <p style="font-size:12px; margin-bottom:15px;">Simulieren Sie Investitionen in den Kader oder die Infrastruktur.</p>
                    <button class="elite-btn" onclick="mgmt.simulateInvestment('MED')">INVEST: MEDICAL HUB (1.2M €)</button>
                    <button class="elite-btn" onclick="mgmt.simulateInvestment('VR')">UPGRADE: VR-ENGINE (0.5M €)</button>
                </div>
            </div>
        `;
    },

    simulateInvestment: function(type) {
        if (type === 'MED') {
            this.data.liquidAssets -= 1200000;
            voiceEngine.speak("Investition getätigt. Das Verletzungsrisiko sinkt prognostisch um 12 Prozent.");
        }
        this.save();
    },

    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    }
};
