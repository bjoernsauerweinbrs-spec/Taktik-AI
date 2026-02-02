/**
 * =========================================
 * TONI 2.0 – STADIONZEITUNG GENERATOR
 * Datenbindung & PDF-Layout
 * =========================================
 */
(function() {
    window.Stadionzeitung = {
        show() {
            const sidebar = document.getElementById('setcard-content');
            sidebar.innerHTML = `
                <div class="sz-generator" style="animation: fadeIn 0.4s ease;">
                    <h3 style="color: #00D1FF;">STADIONREPORT GEN</h3>
                    <div style="background: #2E2E2E; padding: 15px; margin: 15px 0; border-radius: 8px;">
                        <p style="font-size: 12px; color: #888;">MATCHDAY PREVIEW</p>
                        <strong style="display: block; margin-top: 5px;">Toni vs. Gastverein</strong>
                    </div>
                    <ul style="font-size: 13px; color: #A0AEC0; padding-left: 20px;">
                        <li>Taktik: 4-3-3 Offensiv</li>
                        <li>Top-Spieler: Max Miller</li>
                        <li>Sponsor: NeonEnergy</li>
                    </ul>
                    <button class="holo-button" style="width: 100%; margin-top: 20px;" onclick="window.print()">DRUCK-PDF ERZEUGEN</button>
                </div>
            `;
            console.log("📰 Stadionzeitung: Layout generiert.");
        }
    };
})();
