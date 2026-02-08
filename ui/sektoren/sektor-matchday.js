/**
 * TONI 2.0 - SEKTOR MATCHDAY (DIE SPIELTAGSMAPPE)
 * Fokus: Taktik-Setup (4-4-2 vs 3-4-3), Gegner-Analyse & Digitale Passkontrolle.
 */
window.SektorMatchday = {
    isGrassrootsMode: true, 

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const plan = window.Database.matchPlan;
        const coach = window.coachInfo || { name: "Coach", verein: "Dein Verein" };

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid var(--accent-orange); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-orange); letter-spacing: 2px;">MATCHDAY: ${coach.verein?.toUpperCase() || 'UNSER SPIEL'}</h2>
                    <span style="color: #888; font-size: 0.7rem;">STRATEGIE-MAPPE FÜR COACH ${coach.name?.toUpperCase() || 'PRO'}</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.SektorMatchday.showPlayerIDs()" style="border-color: var(--data-cyan); color: var(--data-cyan);">
                        <i class="fas fa-id-card"></i> PASSKONTROLLE
                    </button>
                    <button class="tactic-btn" onclick="window.SektorMatchday.toggleMode()">
                        ${this.isGrassrootsMode ? 'KREISLIGA' : 'PROFI-MODUS'}
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="management-grid" style="grid-template-columns: 1fr 1fr; gap: 30px;">
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background: rgba(255,106,0,0.05); padding: 20px; border-radius: 15px; border: 1px solid rgba(255,106,0,0.2);">
                        <h3 style="color:var(--accent-orange); font-size: 0.9rem; margin-bottom:15px;"><i class="fas fa-search"></i> GEGNER-CHECK</h3>
                        <div id="opponent-info-box" style="font-size: 0.85rem; color: #ccc; line-height: 1.5;">
                            ${plan.opponentInfo || "Toni scannt... Fokus heute auf das 4-4-2 Pressing gegen deren Aufbau."}
                        </div>
                        <button class="pro-btn-gold" style="margin-top:15px; padding: 5px 15px; font-size: 0.7rem;" onclick="window.SektorMatchday.scanOpponent()">GEGNER-ANALYSE STARTEN</button>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h3 style="color:#fff; font-size: 0.9rem; margin-bottom:15px;"><i class="fas fa-chess-board"></i> FORMATION & MARSCHROUTE</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; font-size:0.8rem;">
                            <div style="background:rgba(57,255,20,0.1); padding:10px; border-radius:8px;">
                                <small style="color:var(--neon-green);">UNSERE ELF</small><br>
                                <strong>System: 3-4-3</strong>
                            </div>
                            <div style="background:rgba(212,175,55,0.1); padding:10px; border-radius:8px;">
                                <small style="color:var(--accent-gold);">TONI-AUSWAHL</small><br>
                                <strong>System: 4-4-2</strong>
                            </div>
                        </div>
                        <p style="margin-top:15px; font-size:0.75rem; color:#888; border-left: 2px solid var(--neon-green); padding-left: 10px;">
                            Toni's Rat: "Coach, mit dem 3-4-3 haben wir die Überzahl im Mittelfeld. Wenn wir deren 4-4-2 früh stören, bricht ihr Aufbau zusammen."
                        </p>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background: #000; padding: 25px; border-radius: 15px; border-left: 5px solid var(--neon-green); position:relative;">
                        <i class="fas fa-quote-left" style="position:absolute; top:10px; left:10px; opacity:0.1; font-size:2rem; color:var(--neon-green);"></i>
                        <h3 style="color:var(--neon-green); font-size: 0.9rem; margin-bottom:10px;">TONI'S KABINEN-FUNKE</h3>
                        <p id="toni-motivation-speech" style="font-style:italic; font-size: 0.9rem; color:#fff; line-height:1.6;">
                            "Coach ${coach.name || ''}, sag den Jungs: Wir spielen heute nicht gegen elf Gegner, wir spielen für unseren Verein ${coach.verein || ''}. Geht raus und holt euch die Punkte!"
                        </p>
                        <button class="pro-btn-gold" style="margin-top:15px; background:var(--neon-green); color:#000;" onclick="window.SektorMatchday.getNewSpeech()">ANSPRACHE ÄNDERN</button>
                    </div>

                    <div id="logistics-box" style="display: ${this.isGrassrootsMode ? 'block' : 'none'}; background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h3 style="color:var(--data-cyan); font-size: 0.8rem; margin-bottom:15px; text-transform:uppercase;">Platzwart & Logistik</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label style="font-size:0.75rem; color:#ccc;"><input type="checkbox"> Trikotsatz</label>
                            <label style="font-size:0.75rem; color:#ccc;"><input type="checkbox"> Wasserboxen</label>
                            <label style="font-size:0.75rem; color:#ccc;"><input type="checkbox"> Sani-Koffer</label>
                            <label style="font-size:0.75rem; color:#ccc;"><input type="checkbox"> Warmmach-Bälle</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="player-id-section" style="margin-top:30px; display:none;"></div>
        `;
    },

    showPlayerIDs() {
        const section = document.getElementById('player-id-section');
        const players = window.Database.players;
        section.style.display = 'block';
        
        section.innerHTML = `
            <div style="background:rgba(0,0,0,0.5); padding:20px; border-radius:15px; border:1px solid var(--data-cyan);">
                <h3 style="color:var(--data-cyan); font-size:0.9rem; margin-bottom:20px;">DIGITALE PASSKONTROLLE (SCHIEDSRICHTER-ANSICHT)</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
                    ${players.map(p => `
                        <div style="background:#111; padding:10px; border-radius:8px; display:flex; align-items:center; gap:15px; border-left: 3px solid ${p.status === 'FIT' ? 'var(--neon-green)' : 'red'};">
                            <div style="width:50px; height:50px; background:#222; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                                <i class="fas fa-user-shield" style="color:#555;"></i>
                            </div>
                            <div>
                                <div style="font-weight:bold; font-size:0.85rem;">${p.name}</div>
                                <div style="font-size:0.65rem; color:#888;">ID: 2026-P${p.id} | Nr: ${p.number}</div>
                                <div style="font-size:0.6rem; color:var(--neon-green);">STATUS: SPIELBERECHTIGT</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="tactic-btn" style="margin-top:20px;" onclick="document.getElementById('player-id-section').style.display='none'">X SCHLIESSEN</button>
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
        const coach = window.coachInfo || { verein: "unseren Verein" };
        box.innerHTML = `<span class="thinking">Toni scannt Daten für ${coach.verein}...</span>`;
        
        if (window.aiOnline) {
            window.handleCommand(`Scanne Daten für ${coach.verein} und unseren Gegner. Nenne Stärken und Schwächen.`);
        } else {
            setTimeout(() => {
                box.innerHTML = `
                    <b style="color:var(--accent-gold);">GEGNER-PROFIL (OFFLINE-MODE):</b><br>
                    - Spielt meist über die Flügel<br>
                    - Anfällig für schnelles Kontern durch das Zentrum<br>
                    - Tipp: Die Außenbahnen im 3-4-3 doppelt besetzen!
                `;
            }, 2000);
        }
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
