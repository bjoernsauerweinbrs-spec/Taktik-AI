/**
 * TONI 2.0 - SEKTOR TAKTIK (MATCH-PLANER)
 * Fokus: Formationen (3-4-3 vs 4-4-2) & Automatisierte Spielzüge.
 */
window.SektorTaktik = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const formations = window.Database.matchPlan.formations;

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid var(--accent-gold); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-gold); letter-spacing: 2px;">TAKTIK-SCHALTZENTRALE</h2>
                    <span style="color: #888; font-size: 0.7rem;">STRATEGIE: ${formations.trainer} (TRAINER) VS. ${formations.toni} (TONI-ELF)</span>
                </div>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="management-grid" style="grid-template-columns: 1fr 1.2fr; gap: 30px;">
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background: rgba(212, 175, 55, 0.05); padding: 25px; border-radius: 15px; border: 1px solid var(--accent-gold);">
                        <h3 style="color:var(--accent-gold); margin-bottom:15px;"><i class="fas fa-th"></i> GRUND-FORMATIONEN</h3>
                        <p style="font-size:0.75rem; color:#ccc; margin-bottom:20px;">Beame die Teams in ihren Grundformationen auf das Spielfeld.</p>
                        
                        <div style="display:grid; grid-template-columns: 1fr; gap:10px;">
                            <button class="pro-btn-gold" onclick="window.SektorTaktik.applyFormation('trainer')">
                                MEIN TEAM: ${formations.trainer} STELLEN
                            </button>
                            <button class="tactic-btn" style="border-color:var(--neon-green); color:var(--neon-green);" onclick="window.SektorTaktik.applyFormation('toni')">
                                GEGNER: ${formations.toni} STELLEN
                            </button>
                            <button class="tactic-btn" onclick="window.SektorTaktik.clearBoard()">BOARD LEEREN</button>
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h4 style="color:#fff; font-size:0.8rem; margin-bottom:10px;">TAKTIK-NOTIZEN</h4>
                        <textarea id="tactic-notes" class="pro-textarea" style="height:100px; font-size:0.75rem;" placeholder="Besondere Anweisungen für die Halbzeit..."></textarea>
                        <button class="tactic-btn" style="width:100%; margin-top:10px;" onclick="window.SektorTaktik.saveNotes()">SPEICHERN</button>
                    </div>
                </div>

                <div style="background: #000; padding: 25px; border-radius: 15px; border: 1px solid #222;">
                    <h3 style="color:var(--neon-green); margin-bottom:15px;"><i class="fas fa-play-circle"></i> ANIMIERTE SPIELZÜGE</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        
                        <div class="tactic-play-card" onclick="window.SektorTaktik.playBuildUp()">
                            <strong>SPIELAUFBAU (3-4-3)</strong>
                            <p>Abkippende Sechser & aufrückende Schienenspieler.</p>
                        </div>

                        <div class="tactic-play-card" onclick="window.SektorTaktik.playPressing()">
                            <strong>GEGENPRESSING (4-4-2)</strong>
                            <p>Wie wir das Toni-System im Zentrum isolieren.</p>
                        </div>

                        <div class="tactic-play-card" onclick="window.SektorTaktik.playWingAttack()">
                            <strong>FLÜGELZANGE</strong>
                            <p>Überladung der Außenbahnen gegen die 4er-Kette.</p>
                        </div>

                    </div>

                    <div style="margin-top:30px; padding:15px; background:rgba(57, 255, 20, 0.05); border-radius:10px; border-left:4px solid var(--neon-green);">
                        <h4 style="color:var(--neon-green); font-size:0.75rem; margin-bottom:5px;">TONI'S ANALYSE:</h4>
                        <p id="toni-tactic-advice" style="font-size:0.8rem; color:#ccc; font-style:italic;">
                            "Coach, im 3-4-3 haben wir die perfekte Breite gegen ihr kompaktes 4-4-2. Nutze die Schienenspieler!"
                        </p>
                    </div>
                </div>

            </div>
        `;
    },

    applyFormation(team) {
        if (!window.arena) return;
        const formation = team === 'trainer' ? '3-4-3' : '4-4-2';
        window.arena.setFormation(team === 'trainer' ? 'B' : 'A', formation);
        window.BriefcaseUI.toggle(); // Schließt Mappe für direkte Sicht
        window.ToniVoice.speak(`Formations-Check: ${formation} wird auf das Board projiziert.`);
    },

    playBuildUp() {
        window.ToniVoice.speak("Starte Animation: Spielaufbau aus der Dreierkette.");
        // Hier triggern wir die arena.js Animationen (zukünftiges Feature)
        window.BriefcaseUI.toggle();
    },

    clearBoard() {
        if (window.arena) window.arena.clear();
        window.ToniVoice.speak("Spielfeld bereinigt.");
    },

    saveNotes() {
        const notes = document.getElementById('tactic-notes').value;
        window.Database.matchPlan.notes = notes;
        window.Database.save();
        alert("Taktik-Notizen im Match-Plan gesichert.");
    }
};
