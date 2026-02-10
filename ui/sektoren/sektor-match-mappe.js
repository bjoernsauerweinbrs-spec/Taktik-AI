/**
 * TONI 2.0 - SEKTOR MATCH-MAPPE (PRO PREPARATION)
 * Fokus: Motivation, Match-Plan & Formation-Sync
 * Status: INITIAL-RELEASE 2026
 */
window.SektorMatchMappe = {
    
    init() {
        if (!window.Database.matchDay) {
            window.Database.matchDay = {
                motivation: "Heute zeigen wir, wer der Herr im Haus ist!",
                tactics: "Hohes Pressing ab der ersten Minute. Kompakt stehen.",
                opponent: "Unbekannter Gegner"
            };
            if(window.Database.save) window.Database.save();
        }
    },

    open() {
        this.init();
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const data = window.Database.matchDay;
        const verein = window.coachInfo.verein || "DEIN VEREIN";

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(57, 255, 20, 0.3); padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--neon-green); font-family:'Orbitron'; margin:0; font-size:1.2rem; letter-spacing:2px;">MATCH-MAPPE</h2>
                        <span style="color:#666; font-size:0.7rem; text-transform:uppercase;">${verein} | SPIELTAGS-VORSCHAU</span>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 350px; gap: 25px;">
                    
                    <div style="display:flex; flex-direction:column; gap:20px;">
                        
                        <div style="background:rgba(57, 255, 20, 0.05); border:1px solid var(--neon-green); padding:25px; border-radius:15px; position:relative;">
                            <i class="fas fa-quote-left" style="position:absolute; top:15px; left:15px; opacity:0.2; font-size:2rem; color:var(--neon-green);"></i>
                            <h4 style="color:var(--neon-green); font-family:'Orbitron'; font-size:0.7rem; margin:0 0 15px 0; text-align:center;">KABINEN-ANSPRACHE</h4>
                            <textarea id="match-motivation" 
                                style="width:100%; background:transparent; border:none; color:#fff; font-family:'Orbitron'; font-size:1.1rem; text-align:center; outline:none; resize:none; font-style:italic;"
                                onchange="window.SektorMatchMappe.saveData()">${data.motivation}</textarea>
                        </div>

                        <div style="background:rgba(255,255,255,0.02); border:1px solid #333; padding:20px; border-radius:15px;">
                            <h4 style="color:#fff; font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;"><i class="fas fa-clipboard-list"></i> TAKTISCHE MARSCHROUTE</h4>
                            <textarea id="match-tactics" 
                                style="width:100%; height:120px; background:rgba(0,0,0,0.3); border:1px solid #222; border-radius:8px; color:#aaa; padding:15px; font-size:0.85rem; line-height:1.5; outline:none; resize:none;"
                                onchange="window.SektorMatchMappe.saveData()">${data.tactics}</textarea>
                        </div>

                    </div>

                    <div style="display:flex; flex-direction:column; gap:20px;">
                        
                        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--data-cyan); padding:20px; border-radius:15px;">
                            <h4 style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.7rem; margin-bottom:15px;">AUFSTELLUNG PUSH</h4>
                            <div style="display:grid; gap:10px;">
                                <button class="pro-btn-gold" style="font-size:0.7rem;" onclick="window.SektorMatchMappe.applyFormation('Toni', '4-4-2')">
                                    TONI-ELF: 4-4-2 AKTIVIEREN
                                </button>
                                <button class="pro-btn-gold" style="border-color:var(--accent-orange); color:var(--accent-orange); font-size:0.7rem;" onclick="window.SektorMatchMappe.applyFormation('Trainer', '3-4-3')">
                                    TRAINER-ELF: 3-4-3 AKTIVIEREN
                                </button>
                            </div>
                            <p style="font-size:0.6rem; color:#555; margin-top:15px; text-align:center;">
                                <i class="fas fa-info-circle"></i> Klicke auf ein System, um die Spieler in der Arena zu positionieren.
                            </p>
                        </div>

                        <div style="background:rgba(255,255,255,0.03); border:1px dashed #444; padding:20px; border-radius:15px;">
                            <strong style="color:var(--neon-green); font-size:0.65rem; font-family:'Orbitron';">TONI PRE-MATCH CHECK:</strong>
                            <p id="toni-prematch-feedback" style="font-size:0.75rem; color:#888; margin-top:10px; line-height:1.5;">
                                "Coach, die Stimmung in der Kabine ist gut. Die gewählte Taktik erfordert eine hohe Laufbereitschaft deiner Sechser."
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        `;
    },

    saveData() {
        const mot = document.getElementById('match-motivation').value;
        const tac = document.getElementById('match-tactics').value;

        window.Database.matchDay.motivation = mot;
        window.Database.matchDay.tactics = tac;

        if(window.Database.save) window.Database.save();
        console.log("Match-Mappe: Daten gesichert.");
    },

    applyFormation(team, formation) {
        if(window.arena && window.arena.setupFormation) {
            window.arena.setupFormation(team, formation);
            if(window.ToniVoice) {
                window.ToniVoice.speak(`System umgestellt auf ${formation} für das Team ${team}.`);
            }
            // Visuelles Feedback
            const feedback = document.getElementById('toni-prematch-feedback');
            feedback.innerHTML = `"System ${formation} wird auf das Spielfeld projiziert. Alle Spieler rücken auf ihre Positionen."`;
            feedback.style.color = "var(--neon-green)";
        } else {
            alert("Arena Engine nicht bereit für Formations-Sync.");
        }
    }
};
