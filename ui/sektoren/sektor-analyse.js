window.SektorAnalyse = {
    render: function() {
        const container = document.getElementById('active-content');
        const players = window.ToniDB.getPlayers().filter(p => p.team === 'home');

        container.innerHTML = `
            <div class="analyse-header">
                <h2><i class="fas fa-microchip"></i> PERFORMANCE-LABOR</h2>
                <p>Echtzeit-Analyse & Vitaldaten der Heimelf</p>
            </div>
            <div class="analyse-layout">
                <div class="player-selection-list">
                    ${players.map(p => `
                        <div class="analyse-player-item" onclick="window.SektorAnalyse.showDetail('${p.id}')">
                            <span class="player-nr">${p.nr}</span>
                            <span class="player-name">${p.name}</span>
                            <span class="vitals-indicator ${p.isPresent ? 'online' : 'offline'}"></span>
                        </div>
                    `).join('')}
                </div>
                <div id="analyse-detail-view" class="analyse-detail-view">
                    <div class="placeholder-msg">Wähle einen Spieler für die Tiefenanalyse aus.</div>
                </div>
            </div>
        `;
    },

    showDetail: function(id) {
        const player = window.ToniDB.getPlayers().find(p => p.id === id);
        const detailView = document.getElementById('analyse-detail-view');

        // Simulation von Vitalwerten (da wir keine echten Sensoren haben)
        const pulse = Math.floor(Math.random() * (180 - 60) + 60);
        const spo2 = Math.floor(Math.random() * (100 - 95) + 95);
        const stress = Math.floor(Math.random() * 100);

        detailView.innerHTML = `
            <div class="player-detail-card">
                <div class="detail-header">
                    <h3>${player.name.toUpperCase()}</h3>
                    <div class="rating-badge">${player.rat || '??'}</div>
                </div>
                
                <div class="vitals-grid">
                    <div class="vital-box">
                        <i class="fas fa-heartbeat pulse-anim"></i>
                        <span class="vital-val">${pulse}</span>
                        <span class="vital-unit">BPM</span>
                        <label>PULS</label>
                    </div>
                    <div class="vital-box">
                        <i class="fas fa-wind"></i>
                        <span class="vital-val">${spo2}%</span>
                        <span class="vital-unit">SpO2</span>
                        <label>SAUERSTOFF</label>
                    </div>
                    <div class="vital-box">
                        <i class="fas fa-brain"></i>
                        <span class="vital-val">${stress}</span>
                        <span class="vital-unit">%</span>
                        <label>STRESSLEVEL</label>
                    </div>
                </div>

                <div class="scouting-report">
                    <h4><i class="fas fa-comment-dots"></i> TONI'S SCOUTING REPORT</h4>
                    <p class="scouting-text">
                        "Der Spieler zeigt heute eine ${pulse > 150 ? 'sehr hohe Belastung' : 'stabile physische Verfassung'}. 
                        Taktisch empfehle ich ${player.pos === 'ST' ? 'mehr Tiefenläufe' : 'eine defensivere Positionierung'}, 
                        um die ${stress > 70 ? 'mentale Erschöpfung' : 'aktuelle Konzentration'} optimal zu nutzen."
                    </p>
                </div>

                <div class="performance-meter">
                    <label>TRAININGS-SCORE (1-10):</label>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${Math.random() * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
    }
};
