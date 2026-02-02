(function() {
    window.AnalysisCenter = {
        // Rendert die Setcard basierend auf Spielerdaten
        renderSetcard(player) {
            const container = document.getElementById('analysis-sidebar');
            if (!container) return;

            // Dynamische Metriken (Simuliert für Professionalität)
            const loadStatus = Math.floor(Math.random() * 100);
            const statusColor = loadStatus > 80 ? '#FF6A00' : '#28C76F';

            container.innerHTML = `
                <div class="setcard-header">
                    <div class="player-avatar">#${player.number}</div>
                    <div class="player-meta">
                        <h2>${player.name.toUpperCase()}</h2>
                        <span class="player-role">Inverser Flügelspieler</span>
                    </div>
                </div>

                <div class="metric-grid">
                    <div class="metric-box">
                        <span class="label">Belastung</span>
                        <div class="value" style="color: ${statusColor}">${loadStatus}%</div>
                        <div class="sparkline">📈</div>
                    </div>
                    <div class="metric-box">
                        <span class="label">Top Speed</span>
                        <div class="value" style="color: #00D1FF">34.2 km/h</div>
                    </div>
                </div>

                <div class="analysis-section">
                    <h3>KI-Analyse</h3>
                    <p class="ai-comment">
                        „${player.name} zeigt eine starke Tendenz zum Einrücken. 
                        Taktische Empfehlung: Hinterlaufen durch Außenverteidiger forcieren.“
                    </p>
                </div>

                <div class="radar-container">
                    <canvas id="radar-chart"></canvas>
                </div>

                <button class="holo-button" onclick="Stadionzeitung.generatePreview()">Export für Report</button>
            `;
            
            console.log(`👤 Setcard geladen für: ${player.name}`);
        },

        clear() {
            const container = document.getElementById('analysis-sidebar');
            if (container) container.innerHTML = '<p class="empty-state">Spieler auf dem Feld wählen...</p>';
        }
    };
})();
