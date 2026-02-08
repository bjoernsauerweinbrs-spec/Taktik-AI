/**
 * TONI 2.0 - SEKTOR ANALYSE
 * Visualisierung der Spieler als FIFA-Elite-Cards mit Vital-Daten.
 */

window.SektorAnalyse = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Header Bereich
        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px;">LIVE-ANALYSE (VITALDATEN)</h2>
                <p style="color: var(--text-dim);">Echtzeit-Daten der Sportuhren & Leistungsdiagnostik</p>
            </div>
            
            <div class="fifa-cards-grid" id="analysis-grid">
                </div>

            <div style="text-align: center; margin-top: 40px; padding-bottom: 40px;">
                <button class="pro-btn-gold" style="width: 250px;" onclick="window.BriefcaseUI.renderMainGrid()">ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('analysis-grid');
        const players = window.Database ? window.Database.players : [];

        if (players.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-dim);">Keine Spielerdaten im System gefunden.</p>`;
            return;
        }

        grid.innerHTML = players.map(player => {
            // Wir simulieren hier die "Sportuhr-Daten" basierend auf dem Rating
            const pulse = Math.floor(Math.random() * (160 - 110) + 110); // Simulierter Puls
            const water = Math.floor(Math.random() * (75 - 60) + 60);    // Wasseranteil in %
            const energy = Math.floor(Math.random() * (100 - 40) + 40);  // Restenergie in %

            return `
                <div class="fifa-card home-team fadeIn">
                    <div class="card-inner">
                        <div class="rating">${player.rating || '80'}</div>
                        <div class="pos-label">${player.pos || 'ST'}</div>
                        
                        <i class="fas fa-heartbeat card-pulse-icon"></i>

                        <div style="margin-top: 45px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-user" style="font-size: 2rem; color: rgba(255,255,255,0.2);"></i>
                            </div>
                            <div style="font-weight: 900; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px;">
                                ${player.name}
                            </div>
                        </div>

                        <div class="vital-bar-container">
                            <div class="vital-stat">Puls <span>${pulse} BPM</span></div>
                            <div class="progress-mini">
                                <div class="progress-fill" style="width: ${(pulse/200)*100}%"></div>
                            </div>

                            <div class="vital-stat" style="margin-top: 8px;">Wasser <span>${water}%</span></div>
                            <div class="progress-mini">
                                <div class="progress-fill" style="width: ${water}%; background: var(--data-cyan);"></div>
                            </div>

                            <div class="vital-stat" style="margin-top: 8px;">Energie <span>${energy}%</span></div>
                            <div class="progress-mini">
                                <div class="progress-fill" style="width: ${energy}%; background: var(--accent-gold);"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
