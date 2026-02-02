/**
 * BRIEFCASE ERWEITERUNG: Trainingsbuch & Adaptive Logik [cite: 2026-01-29, 2026-02-02]
 */
window.BriefcaseUI.renderSport = function(container) {
    container.innerHTML = `
        <div class="animate-fadeIn">
            <h2 style="color:var(--accent-orange); margin-bottom:20px;">👟 Sporttasche</h2>
            
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <button onclick="BriefcaseUI.renderKaderSub()" class="vibe-btn active">KADERLISTE</button>
                <button onclick="BriefcaseUI.renderTrainingBook()" class="vibe-btn">TRAININGSBUCH</button>
            </div>
            
            <div id="sport-sub-content"></div>
        </div>
    `;
    this.renderKaderSub(); // Startet mit der Kaderansicht
};

window.BriefcaseUI.renderTrainingBook = function() {
    const target = document.getElementById('sport-sub-content');
    const level = ToniAI.config.niveau || 'Basis'; // Nutzt das erkannte Niveau [cite: 2026-01-29]

    target.innerHTML = `
        <div class="animate-fadeIn">
            <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); padding:20px; border-radius:15px; margin-bottom:20px;">
                <h4 style="color:var(--data-cyan); margin-bottom:10px;">AKTUELLER FOKUS: ${ToniAI.config.goal || 'Allgemein'}</h4>
                <p style="font-size:12px; color:var(--text-muted);">Niveau: ${level} // Taktik-Vorgabe: Jogo Bonito [cite: 2026-01-25, 2026-01-29]</p>
            </div>

            <button onclick="BriefcaseUI.generateDrill()" class="login-btn" style="margin-bottom:20px;">
                ✨ ÜBUNG VORSCHLAGEN (AI GENERATED)
            </button>

            <div id="drill-output" class="hidden"></div>
        </div>
    `;
};

window.BriefcaseUI.generateDrill = function() {
    const output = document.getElementById('drill-output');
    output.classList.remove('hidden');
    
    // Übung basierend auf Niveau und brasilianischem Style [cite: 2026-01-25, 2026-01-29]
    const drill = {
        title: "Rondo-Ginga: 4 gegen 2 auf engstem Raum",
        description: "Maximale Technik und Spielfreude. Die roten Spieler (Heim) müssen den Ball mit maximal zwei Kontakten halten, während die blauen (Gegner) pressen [cite: 2026-01-25].",
        coaching: "Fokus auf die Hüftbewegung (Ginga) beim Passspiel. Schnellere Ballzirkulation als beim letzten Mal, Björn!" [cite: 2026-01-24, 2026-01-25]
    };

    output.innerHTML = `
        <div class="toni-speech-bubble" style="background:rgba(255,255,255,0.02);">
            <strong style="color:var(--accent-orange); display:block; margin-bottom:10px;">${drill.title}</strong>
            <p style="font-size:13px; line-height:1.5;">${drill.description}</p>
            <div class="toni-argument" style="margin-top:15px;">
                <b>COACHING-POINT:</b> ${drill.coaching}
            </div>
        </div>
    `;
    
    ToniAI.speak(`Björn, ich habe eine Übung für das ${ToniAI.config.niveau}-Niveau erstellt. Wir trainieren heute die brasilianische Technik im ${arena.mode}-Modus.`); [cite: 2026-01-24, 2026-01-26, 2026-01-29]
};
