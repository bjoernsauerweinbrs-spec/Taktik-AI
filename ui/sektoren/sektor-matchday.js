/**
 * TONI 2.0 - SEKTOR MATCHDAY (DIE SPIELTAGSMAPPE)
 * Alles für den Spieltag: Aufstellung, Gegner-Check, Motivation & Logistik.
 */
window.SektorMatchday = {
    // Standard-Status für die Logistik (Pro vs. Kreisliga)
    isGrassrootsMode: true, 

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const plan = window.Database.matchPlan;

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid var(--accent-orange); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-orange); letter-spacing: 2px;">DIE SPIELTAGS-MAPPE</h2>
                    <span style="color: #888; font-size: 0.7rem;">STRATEGIE | GEGNER | MOTIVATION | LOGISTIK</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.SektorMatchday.toggleMode()">
                        MODUS: ${this.isGrassrootsMode ? 'KREISLIGA' : 'PROFI'}
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="management-grid" style="grid-template-columns: 1fr 1fr; gap: 30px;">
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    
                    <div style="background: rgba(255,106,0,0.05); padding: 20px; border-radius: 15px; border: 1px solid rgba(255,106,0,0.2);">
                        <h3 style="color:var(--accent-orange); font-size: 0.9rem; margin-bottom:15px;"><i class="fas fa-search"></i> GEGNER-CHECK</h3>
                        <div id="opponent-info-box" style="font-size: 0.85rem; color: #ccc; line-height: 1.5;">
                            ${plan.opponentInfo || "Keine Daten gefunden. Toni empfiehlt: Fokus auf das eigene Spiel (4-4-2 Pressing)."}
                        </div>
                        <button class="pro-btn-gold" style="margin-top:15px; padding: 5px 15px; font-size: 0.7rem;" onclick="window.SektorMatchday.scanOpponent()">GEGNER SCANNEN (KI)</button>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h3 style="color:#fff; font-size: 0.9rem; margin-bottom:15px;"><i class="fas fa-chess-board"></i> MATCH-PLAN</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.75rem;">
                            <div style="color:var(--neon-green);">System: ${plan.formations.trainer}</div>
                            <div style="color:var(--accent-gold);">Kapitän: ${window.Database.players[0]?.name || 'Gesucht'}</div>
                        </div>
                        <p style="margin-top:10px; font-size:0.7rem; color:#666;">Notiz: ${plan.notes || 'Keine speziellen Anweisungen.'}</p>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    
                    <div style="background: #000; padding: 25px; border-radius: 15px; border-left: 5px solid var(--neon-green); position:relative;">
                        <i class="fas fa-quote-left" style="position:absolute; top:10px; left:10px; opacity:0.1; font-size:2rem; color:var(--neon-green);"></i>
                        <h3 style="color:var(--neon-green); font-size: 0.9rem; margin-bottom:10px;">TONI'S KABINEN-FUNKE</h3>
                        <p id="toni-motivation-speech" style="font-style:italic; font-size: 0.9rem; color:#fff; line-height:1.6;">
                            "Männer, heute zählt nicht das Talent, sondern der Wille. Wir fressen den Rasen bis zur 90. Minute!"
                        </p>
                        <button class="pro-btn-gold" style="margin-top:15px; background:var(--neon-green); color:#000;" onclick="window.SektorMatchday.getNewSpeech()">NEUE ANSPRACHE</button>
                    </div>

                    <div id="logistics-box" style="display: ${this.isGrassrootsMode ? 'block' : 'none'}; background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h3 style="color:var(--data-cyan); font-size: 0.8rem; margin-bottom:15px; text-transform:uppercase;">Platzwart-Checkliste</h3>
                        <ul style="list-style:none; padding:0; font-size:0.8rem;">
                            <li style="margin-bottom:8px;"><input type="checkbox"> Trikotsatz (Gewaschen?)</li>
                            <li style="margin-bottom:8px;"><input type="checkbox"> 15 Spielbälle (Aufgepumpt?)</li>
                            <li style="margin-bottom:8px;"><input type="checkbox"> Erste-Hilfe-Koffer & Eisspray</li>
                            <li style="margin-bottom:8px;"><input type="checkbox"> Spielerpässe / Tablet geladen?</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style="text-align:center; margin-top:30px;">
                <button class="pro-btn-gold" onclick="window.print()"><i class="fas fa-print"></i> MAPPE ALS A5 EXPORTIEREN</button>
            </div>
        `;
    },

    toggleMode() {
        this.isGrassrootsMode = !this.isGrassrootsMode;
        this.render();
    },

    async scanOpponent() {
        const box = document.getElementById('opponent-info-box');
        box.innerHTML = `<span class="thinking">Toni scannt Portale (Fußball.de / Transfermarkt)...</span>`;
        
        // Wenn Toni online ist, fragen wir ihn
        if (window.aiOnline) {
            window.handleCommand("Analysiere unseren nächsten Gegner und nenne Stärken und Schwächen.");
        } else {
            setTimeout(() => {
                box.innerHTML = `
                    <b style="color:var(--accent-gold);">SCOUTING-BERICHT:</b><br>
                    - Stark bei Standards (große IV)<br>
                    - Schwäche: Umschaltspiel nach Ballverlust<br>
                    - Keyplayer: Nummer 10 (Zentrales Mittelfeld)
                `;
            }, 2000);
        }
    },

    getNewSpeech() {
        const p = document.getElementById('toni-motivation-speech');
        const quotes = [
            "Heute sind wir eine Einheit. Wenn einer fällt, stehen drei andere für ihn auf!",
            "Vergesst die Tabelle. Heute zählt nur dieser Platz und dieses Team.",
            "Spielt mutig. Fehler sind erlaubt, Aufgeben nicht!",
            "Ich will in euren Augen sehen, dass ihr diesen Sieg mehr wollt als die da draußen!"
        ];
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        p.innerText = `"${random}"`;
        window.ToniVoice.speak(random);
    }
};
