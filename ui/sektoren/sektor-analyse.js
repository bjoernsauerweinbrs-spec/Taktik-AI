/**
 * TONI 2.0 - SEKTOR ANALYSE (PERFORMANCE & VITAL HUB)
 * Fokus: Bio-Metrische Daten, Fettanalyse & Wearable-Stats.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        const title = document.getElementById('sector-title');
        if(title) title.innerText = "PERFORMANCE ANALYSE-ZENTRUM";
        
        // Initial den ersten Spieler auswählen, falls vorhanden
        if (!this.selectedPlayerId && window.Database?.players?.length > 0) {
            this.selectedPlayerId = window.Database.players[0].id;
        }

        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const players = window.Database?.players || [];
        const player = players.find(p => p.id === this.selectedPlayerId) || { name: "Kein Spieler gewählt" };

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.4); border-right: 1px solid #333; padding-right: 15px; overflow-y: auto; max-height: 70vh;">
                    <h3 style="font-size: 0.7rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 15px;">KADER-STATUS</h3>
                    ${players.map(p => `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; border: 1px solid ${this.selectedPlayerId === p.id ? 'var(--neon-green)' : '#222'}; background: ${this.selectedPlayerId === p.id ? 'rgba(57,255,20,0.1)' : 'transparent'}; transition: 0.3s;">
                            <div style="font-weight: bold; font-size: 0.85rem;">${p.name}</div>
                            <div style="font-size: 0.65rem; color: #888;">Bereitschaft: <span style="color:var(--neon-green)">Optimal</span></div>
                        </div>
                    `).join('')}
                </div>

                <div style="overflow-y: auto; padding-right: 10px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 1.5rem; color: #fff; text-transform: uppercase;">${player.name}</h2>
                            <span style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 2px;">VITAL-DIAGNOSTIK SESSION: 2026</span>
                        </div>
                        <button class="tactic-btn" onclick="window.SektorAnalyse.syncWearable()" style="font-size:0.7rem;">
                            <i class="fas fa-sync"></i> SYNC WEARABLE
                        </button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                            <h3 style="font-size: 0.8rem; color: var(--accent-orange); margin-bottom: 15px;"><i class="fas fa-weight"></i> BODY COMPOSITION</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                ${this.renderStatCard("KÖRPERFETT", "11.2 %", "NIEDRIG", "var(--neon-green)")}
                                ${this.renderStatCard("MUSKELMASSE", "44.8 kg", "OPTIMAL", "var(--neon-green)")}
                                ${this.renderStatCard("WASSERANTEIL", "62.4 %", "STABIL", "var(--data-cyan)")}
                                ${this.renderStatCard("VISZERALFETT", "2.0", "EXZELLENT", "var(--neon-green)")}
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.7rem; color: #aaa;">
                                <i class="fas fa-info-circle"></i> Messung via Bio-Impedanz-Analyse (BIA) erfolgt.
                            </div>
                        </div>

                        <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 15px; padding: 20px;">
                            <h3 style="font-size: 0.8rem; color: var(--data-cyan); margin-bottom: 15px;"><i class="fas fa-stopwatch-20"></i> WEARABLE PERFORMANCE</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                ${this.renderStatCard("VO2 MAX", "62 ml/kg", "PROFI", "var(--accent-gold)")}
                                ${this.renderStatCard("HRV (RECOVERY)", "88 ms", "ERHOLT", "var(--neon-green)")}
                                ${this.renderStatCard("SCHLAF-INDEX", "92/100", "DEEP", "var(--data-cyan)")}
                                ${this.renderStatCard("PULS (RUHE)", "48 BPM", "ATHLET", "var(--neon-green)")}
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background: rgba(57,255,20,0.05); border: 1px solid rgba(57,255,20,0.2); border-radius: 8px; color: #fff; font-size: 0.75rem;">
                                <strong>TONI ANALYSE:</strong> "Super Kompensations-Phase erreicht. Volle Belastung möglich."
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 25px; background: #000; border: 1px solid #222; border-radius: 15px; padding: 20px;">
                        <h3 style="font-size: 0.7rem; color: #666; margin-bottom: 10px;">TRAININGSBELASTUNG LETZTE 7 TAGE</h3>
                        <div style="display: flex; align-items: flex-end; gap: 8px; height: 100px; padding-bottom: 5px;">
                            ${[40, 60, 30, 90, 100, 70, 85].map(h => `
                                <div style="flex:1; height:${h}%; background: linear-gradient(to top, var(--neon-green), transparent); border-radius: 2px 2px 0 0; opacity: 0.7;"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border-left: 2px solid ${color};">
                <div style="font-size: 0.6rem; color: #888; text-transform: uppercase;">${label}</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: #fff; margin: 4px 0;">${value}</div>
                <div style="font-size: 0.55rem; color: ${color}; font-weight: bold;">● ${status}</div>
            </div>
        `;
    },

    selectPlayer(id) {
        this.selectedPlayerId = id;
        this.render();
    },

    syncWearable() {
        if(window.ToniVoice) window.ToniVoice.speak("Synchronisiere Daten von Sportuhr und Waage. Bitte warten.");
        const btn = event.currentTarget;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> SYNCING...`;
        
        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-check"></i> SYNC COMPLETED`;
            this.render();
            if(window.ToniVoice) window.ToniVoice.speak("Biometrische Daten erfolgreich aktualisiert. Alle Werte im grünen Bereich.");
        }, 2000);
    }
};
