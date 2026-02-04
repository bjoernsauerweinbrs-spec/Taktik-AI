/**
 * TONI 2.0 - ANALYSEZENTRUM
 * Performance-Tracking & Kader-Metriken
 */
window.SektorAnalyse = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Berechnungen
        const avgRating = players.length > 0 
            ? (players.reduce((sum, p) => sum + parseInt(p.rating || 0), 0) / players.length).toFixed(1) 
            : 0;
            
        const injuredCount = players.filter(p => p.status === 'Verletzt').length;
        const fitCount = players.filter(p => p.status === 'FIT').length;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <h2 style="color:var(--accent-orange); letter-spacing:2px; margin-bottom:30px;">ANALYSEZENTRUM</h2>
                
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px;">
                    
                    <div class="fifa-card" style="text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--accent-gold);">DURCHSCHNITTS-RATING</div>
                        <div style="font-size:3rem; font-weight:900; color:var(--text-main);">${avgRating}</div>
                        <div style="font-size:0.8rem; color:var(--text-dim);">Basierend auf ${players.length} Profis</div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--accent-gold);">KADER-VERFÜGBARKEIT</div>
                        <div style="margin-top:10px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <span>Einsatzbereit</span><span style="color:var(--status-fit);">${fitCount}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between;">
                                <span>Lazarett</span><span style="color:var(--status-error);">${injuredCount}</span>
                            </div>
                        </div>
                    </div>

                    <div class="fifa-card" style="grid-column: 1 / -1; text-align:left; cursor:default;">
                        <div style="font-size:0.7rem; color:var(--accent-gold); margin-bottom:15px;">BMI-PERFORMANCE-CHECK (OPTIMAL: 20-24)</div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
                            ${this.renderBMICheck(players)}
                        </div>
                    </div>

                </div>
            </div>`;
    },

    renderBMICheck: function(players) {
        if(players.length === 0) return "Keine Daten verfügbar.";
        
        return players.map(p => {
            const bmi = (p.weight && p.height) ? (p.weight / ((p.height/100)**2)).toFixed(1) : null;
            if(!bmi) return "";
            
            let color = "var(--status-fit)";
            let statusText = "OPTIMAL";
            
            if(bmi > 24.9) { color = "var(--status-error)"; statusText = "GEWICHT HOCH"; }
            if(bmi < 19) { color = "var(--status-warn)"; statusText = "GEWICHT NIEDRIG"; }

            return `
                <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; border-left:4px solid ${color};">
                    <div style="font-size:0.8rem; font-weight:bold;">${p.name}</div>
                    <div style="font-size:0.7rem; color:${color};">BMI: ${bmi} (${statusText})</div>
                </div>
            `;
        }).join('');
    }
};
