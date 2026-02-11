/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Biometrie-Sync, FIFA-Card-Logik & Physis-Index
 * Status: MASTER-SYNC 2026 - FINAL RECOVERY COMPLETED
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        console.log("🧬 Performance-Hub: Initialisiere Biometrie-Monitoring...");
        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        
        if (!this.selectedPlayerId && players.length > 0) {
            this.selectedPlayerId = players[0].id;
        }
        this.render();
    },

    getFilteredPlayers(team) {
        if (!window.Database?.players) return [];
        return window.Database.players.filter(p => {
            if (team === "Senioren") return p.team === "Senioren";
            return p.jugend === team;
        });
    },

    /**
     * Ermittelt das Karten-Design basierend auf dem Rating (Elite-Logik)
     */
    getCardDesign(rat) {
        if (rat >= 80) return { color: "var(--accent-gold)", label: "GOLD / ELITE", glow: "0 0 20px rgba(255, 215, 0, 0.4)" };
        if (rat >= 70) return { color: "#C0C0C0", label: "SILVER / PRO", glow: "0 0 15px rgba(192, 192, 192, 0.3)" };
        return { color: "#CD7F32", label: "BRONZE / TALENT", glow: "0 0 10px rgba(205, 127, 50, 0.2)" };
    },

    calculateBMI(height, weight) {
        if (!height || !weight) return "---";
        const hMeter = height / 100;
        return (weight / (hMeter * hMeter)).toFixed(1);
    },

    calculatePhysisIndex(p) {
        const vo2 = parseFloat(p.vo2) || 50;
        const fat = parseFloat(p.fat) || 12;
        const bmi = parseFloat(this.calculateBMI(p.height, p.weight)) || 22;
        let score = (vo2 / 70) * 50 + (1 - (fat / 25)) * 30;
        const bmiDiff = Math.abs(22 - bmi);
        score += (1 - (bmiDiff / 10)) * 20;
        return Math.min(100, Math.max(0, Math.round(score)));
    },

    getAlerts(player) {
        const alerts = [];
        const fat = parseFloat(player.fat) || 0;
        const bmi = parseFloat(this.calculateBMI(player.height, player.weight));
        if (fat > 13.5) alerts.push({ type: 'danger', msg: `FETT-ALARM: ${fat}%` });
        if (bmi > 26) alerts.push({ type: 'warning', msg: `BMI-ALARM: ${bmi}` });
        return alerts;
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        const player = players.find(p => p.id == this.selectedPlayerId) || players[0] || { name: "KEIN PROFIL", rat: 50 };
        
        const cardStyle = this.getCardDesign(player.rat);
        const bmi = this.calculateBMI(player.height, player.weight);
        const pIndex = this.calculatePhysisIndex(player);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 15px; overflow-y: auto;">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-MONITORING: ${team.toUpperCase()}</h3>
                    ${players.map(p => {
                        const design = this.getCardDesign(p.rat);
                        const isSelected = this.selectedPlayerId == p.id;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 10px; cursor: pointer; border: 1px solid ${isSelected ? design.color : '#222'}; 
                             background: ${isSelected ? 'rgba(255,255,255,0.05)' : 'transparent'}; transition: 0.3s;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight: 900; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</span>
                                <span style="font-size:0.6rem; color:${design.color}; font-weight:900;">${p.rat}</span>
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 2.2rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                            <div style="display:flex; gap:15px; margin-top:8px;">
                                <span style="color:${cardStyle.color}; font-size: 0.7rem; font-family:'Orbitron'; font-weight:900;">● ${cardStyle.label}</span>
                                <span style="color: var(--data-cyan); font-size: 0.7rem; font-family:'Orbitron';">PHYSIS-INDEX: ${pIndex}/100</span>
                            </div>
                        </div>
                        <div style="background: ${cardStyle.color}; color: #000; padding: 15px 25px; border-radius: 10px; font-family: 'Orbitron'; font-weight: 900; text-align: center; box-shadow: ${cardStyle.glow};">
                            <div style="font-size: 0.6rem;">OVERALL</div>
                            <div style="font-size: 1.8rem;">${player.rat}</div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            ${this.renderStatCard("BMI (BIOMETRIE)", bmi, (bmi > 25 ? "ERHÖHT" : "OPTIMAL"), (bmi > 25 ? "var(--status-error)" : "var(--neon-green)"))}
                            ${this.renderStatCard("KÖRPERFETT", (player.fat || "11") + "%", "ATHLETIC", "var(--neon-green)")}
                            ${this.renderStatCard("GRÖSSE", (player.height || "---") + " CM", "STATUR", "#fff")}
                            ${this.renderStatCard("GEWICHT", (player.weight || "---") + " KG", "MASSE", "#fff")}
                        </div>

                        <div style="background: rgba(255,255,255,0.01); border: 1px solid #222; border-radius: 15px; padding: 25px; text-align:center;">
                             <h3 style="font-size: 0.65rem; color: var(--data-cyan); margin-bottom: 25px; text-align:left; font-family:'Orbitron';">SKILL-VEKTOR</h3>
                             ${this.renderSpiderChart(player)}
                        </div>
                    </div>

                    <div style="margin-top:25px; background: rgba(0,0,0,0.4); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                             <h3 style="font-size: 0.7rem; color: var(--accent-gold); margin:0; font-family:'Orbitron';">ELITE-LEVEL FORTSCHRITT</h3>
                             <span style="font-size: 0.65rem; color: var(--accent-gold); font-family:'Orbitron';">${player.rat}%</span>
                        </div>
                        <div style="width:100%; height:8px; background:#111; border-radius:4px; overflow:hidden;">
                            <div style="width:${player.rat}%; height:100%; background: linear-gradient(90deg, #b8860b, #ffd700); box-shadow: 0 0 15px var(--accent-gold);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 12px; border: 1px solid #222; border-top: 2px solid ${color};">
                <div style="font-size: 0.5rem; color: #666; font-family:'Orbitron'; text-transform:uppercase;">${label}</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 4px 0; font-family:'Orbitron';">${value}</div>
                <div style="font-size: 0.5rem; color: ${color}; font-weight: bold;">● ${status}</div>
            </div>`;
    },

    renderSpiderChart(p) {
        const teamColor = p.assignment === "Toni" ? "var(--neon-green)" : "var(--status-error)";
        return `
            <div style="width:180px; height:180px; margin: 0 auto; border: 1px dashed #333; border-radius:50%; position:relative;">
                <svg width="180" height="180" style="filter: drop-shadow(0 0 5px ${teamColor});">
                    <polygon points="90,40 140,90 90,140 40,90" 
                        fill="rgba(57, 255, 20, 0.1)" stroke="${teamColor}" stroke-width="2" />
                </svg>
            </div>`;
    },

    selectPlayer(id) {
        this.selectedPlayerId = id;
        this.render();
    }
};
