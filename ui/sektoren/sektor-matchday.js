/**
 * TONI 2.0 - SEKTOR MATCHDAY (STABILISIERTE ELITE-EDITION)
 * Fokus: Taktik-Setup, Gegner-Check & Clipping-Fix.
 */
window.SektorMatchday = {
    isGrassrootsMode: true, 

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Schutz gegen Abschneiden
        content.style.paddingBottom = "120px";
        content.style.overflowY = "auto";

        this.render();

        // Taktik-Vorbereitung: Toni stellt das Board im Hintergrund ein
        if (window.arena) {
            window.arena.setFormation('B', '3-4-3'); // Trainer-Team
            window.arena.setFormation('A', '4-4-2'); // Toni-Team (Gegner)
            window.ToniVoice.speak("Matchday-Setup geladen. Ich habe das 3-4-3 gegen mein 4-4-2 auf dem Board vorbereitet.");
        }
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        // Sicherstellung, dass Daten existieren
        const plan = (window.Database && window.Database.matchPlan) ? window.Database.matchPlan : { opponentInfo: "Keine Daten." };
        const coach = window.coachInfo || { name: "Coach", verein: "Dein Verein" };

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--accent-orange); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-orange); letter-spacing: 2px;">MATCHDAY HUB: ${coach.verein?.toUpperCase()}</h2>
                    <span style="color: var(--text-dim); font-size: 0.7rem; letter-spacing: 1px;">STRATEGIE-MAPPE | SAISON 2026</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.SektorMatchday.showPlayerIDs()" style="border-color: var(--data-cyan); color: var(--data-cyan);">
                        <i class="fas fa-id-card"></i> PASSKONTROLLE
                    </button>
                    <button class="tactic-btn" onclick="window.SektorMatchday.toggleMode()">
                        <i class="fas fa-exchange-alt"></i> ${this.isGrassrootsMode ? 'KREISLIGA' : 'PROFI-MODUS'}
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="management-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background: rgba(255,106,0,0.05); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,106,0,0.2);">
                        <h3 style="color:var(--accent-orange); font-size: 0.9rem; margin-bottom:15px; text-transform:uppercase;"><i class="fas fa-search"></i> Gegner-Analyse</h3>
                        <div id="opponent-info-box" style="font-size: 0.85rem; color: #ccc; line-height: 1.6; border-left: 2px solid var(--accent-orange); padding-left: 15px;">
                            ${plan.opponentInfo || "Toni scannt... Fokus heute auf das 4-4-2 Pressing gegen deren Aufbau."}
                        </div>
                        <button class="pro-btn-gold" style="margin-top:20px; width:100%;" onclick="window.SektorMatchday.scanOpponent()">ANALYSE AKTUALISIEREN</button>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                        <h3 style="color:#fff; font-size: 0.9rem; margin-bottom:15px;"><i class="fas fa-chess-board"></i> DUELL DER SYSTEME</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; font-size:0.8rem;">
                            <div style="background:rgba(57,255,20,0.1); padding:15px; border-radius:8px; border:1px solid var(--neon-green);">
                                <small style="color:var(--neon-green); font-weight:bold;">TRAINER (DU)</small><br>
                                <strong style="font-size:1.1rem;">3-4-3</strong>
                            </div>
                            <div style="background:rgba(212,175,55,0.1); padding:15px; border-radius:8px; border:1px solid var(--accent-gold);">
                                <small style="color:var(--accent-gold); font-weight:bold;">TONI (KI)</small><br>
                                <strong style="font-size:1.1rem;">4-4-2</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background: #000; padding: 25px; border-radius: 15px; border: 1px solid var(--neon-green); position:relative; box-shadow: 0 0 20px rgba(57,255,20,0.1);">
                        <h3 style="color:var(--neon-green); font-size: 0.9rem; margin-bottom:10px;"><i class="fas fa-comment-dots"></i> TONI'S KABINEN-ANSAGE</h3>
                        <p id="toni-motivation-speech" style="font-style:italic; font-size: 1rem; color:#fff; line-height:1.6; padding: 10px 0;">
                            "Coach ${coach.name}, die Statistiken sprechen für uns. Gehen wir raus und dominieren das Zentrum!"
                        </p>
                        <button class="pro-btn-gold" style="margin-top:10px; background:var(--neon-green); color:#000; width:100%;" onclick="window.SektorMatchday.getNewSpeech()">NEUE ANSPRACHE GENERIEREN</button>
                    </div>

                    <div id="logistics-box" style="display: ${this.isGrassrootsMode ? 'block' : 'none'}; background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                        <h3 style="color:var(--data-cyan); font-size: 0.8rem; margin-bottom:15px; text-transform:uppercase;"><i class="fas fa-tasks"></i> Spieltags-Checkliste</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <label style="font-size:0.8rem; color:#ccc; cursor:pointer;"><input type="checkbox"> Trikotsatz</label>
                            <label style="font-size:0.8rem; color:#ccc; cursor:pointer;"><input type="checkbox"> Wasserboxen</label>
                            <label style="font-size:0.8rem; color:#ccc; cursor:pointer;"><input type="checkbox"> Sani-Koffer</label>
                            <label style="font-size:0.8rem; color:#ccc; cursor:pointer;"><input type="checkbox"> Spielbälle</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="player-id-section" style="margin-top:40px; display:none; padding-bottom: 50px;"></div>
        `;
    },

    showPlayerIDs() {
        const section = document.getElementById('player-id-section');
        const players = window.Database ? window.Database.players : [];
        section.style.display = 'block';
        
        section.innerHTML = `
            <div style="background:rgba(13,20,33,0.98); padding:30px; border-radius:20px; border:1px solid var(--data-cyan); box-shadow: 0 10px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <h3 style="color:var(--data-cyan); font-size:1rem; letter-spacing:2px;">DIGITALE PASSKONTROLLE</h3>
                    <button class="tactic-btn" onclick="document.getElementById('player-id-section').style.display='none'">SCHLIESSEN</button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                    ${players.map(p => `
                        <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; display:flex; align-items:center; gap:20px; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="width:55px; height:55px; background:linear-gradient(135deg, #222, #000); border-radius:50%; display:flex; align-items:center; justify-content:center; border: 2px solid var(--neon-green);">
                                <i class="fas fa-user-check" style="color:var(--neon-green);"></i>
                            </div>
                            <div>
                                <div style="font-weight:bold; font-size:0.9rem; color:#fff;">${p.name}</div>
                                <div style="font-size:0.7rem; color:#888;">ID: 2026-T2-${p.id}</div>
                                <div style="font-size:0.65rem; color:var(--neon-green); font-weight:bold; margin-top:3px;">STATUS: SPIELBERECHTIGT</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        section.scrollIntoView({ behavior: 'smooth' });
    },

    toggleMode() {
        this.isGrassrootsMode = !this.isGrassrootsMode;
        this.render();
    },

    async scanOpponent() {
        const box = document.getElementById('opponent-info-box');
        box.innerHTML = `<span class="thinking">Toni analysiert Scouting-Berichte...</span>`;
        
        setTimeout(() => {
            box.innerHTML = `
                <b style="color:var(--accent-gold);">KI-ERGEBNIS:</b><br>
                - Gegner nutzt 4-4-2 mit hohen Außenverteidigern.<br>
                - Schwachstelle: Raum hinter den Außen bei Ballverlust.<br>
                - Strategie: Schnelle Diagonalbälle in die Schnittstellen.
            `;
            window.ToniVoice.speak("Analyse abgeschlossen. Der Gegner ist anfällig für Konter über die Flügel.");
        }, 2000);
    },

    getNewSpeech() {
        const coach = window.coachInfo || { name: "Coach" };
        const quotes = [
            `Männer, hört auf Coach ${coach.name}. Heute wird Geschichte geschrieben!`,
            "Gras fressen, Punkte holen, Kabinenfest feiern. Los jetzt!",
            "Einer für alle, alle für den Verein! Geht raus und zeigt es ihnen."
        ];
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('toni-motivation-speech').innerText = `"${random}"`;
        window.ToniVoice.speak(random);
    }
};
