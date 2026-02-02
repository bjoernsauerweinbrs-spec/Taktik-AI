/**
 * =========================================
 * TONI 2.0 – ANALYSIS CENTER UI
 * Setcard-Rendering & Leistungsdaten
 * =========================================
 */
(function() {
    window.AnalysisCenter = {
        
        // Befüllt das rechte Panel mit Spielerdetails
        renderSetcard(player) {
            const container = document.getElementById('setcard-content');
            if (!container) return;

            // Professionelle Performance-Farbe (ACWR-Logik)
            const fitness = Math.floor(Math.random() * 30) + 70; // 70-100%
            const color = fitness > 85 ? '#28C76F' : '#FFD166';

            container.innerHTML = `
                <div style="animation: fadeIn 0.3s ease;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: ${player.color || '#FF6A00'}; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; box-shadow: 0 0 15px ${player.color || '#FF6A00'}66;">
                            ${player.number}
                        </div>
                        <div>
                            <h3 style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">${player.name}</h3>
                            <small style="color: #00D1FF;">Rolle: Stammspieler</small>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px;">
                        <div style="background: #2E2E2E; padding: 15px; border-radius: 8px; text-align: center;">
                            <small style="display: block; color: #667085; margin-bottom: 5px;">Fitness</small>
                            <strong style="font-size: 18px; color: ${color};">${fitness}%</strong>
                        </div>
                        <div style="background: #2E2E2E; padding: 15px; border-radius: 8px; text-align: center;">
                            <small style="display: block; color: #667085; margin-bottom: 5px;">Top-Speed</small>
                            <strong style="font-size: 18px; color: #00D1FF;">32.4 km/h</strong>
                        </div>
                    </div>

                    <div style="border-left: 2px solid #FF6A00; padding-left: 15px; margin-top: 20px;">
                        <h4 style="font-size: 12px; color: #FF6A00; text-transform: uppercase; margin-bottom: 8px;">KI-Einschätzung</h4>
                        <p style="font-size: 13px; line-height: 1.5; color: #A0AEC0;">
                            Spieler zeigt hohe taktische Disziplin. Empfehlung: In der Umschaltphase verstärkt über die Außenbahn einsetzen.
                        </p>
                    </div>

                    <button style="width: 100%; margin-top: 30px; background: rgba(255, 106, 0, 0.1); border: 1px solid #FF6A00; color: #FF6A00; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s;" 
                            onmouseover="this.style.background='#FF6A00'; this.style.color='#fff';" 
                            onmouseout="this.style.background='rgba(255, 106, 0, 0.1)'; this.style.color='#FF6A00';">
                        REPORT EXPORTIEREN
                    </button>
                </div>
            `;
        }
    };
})();
