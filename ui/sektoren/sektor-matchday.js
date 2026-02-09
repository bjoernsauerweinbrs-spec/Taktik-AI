/**
 * TONI 2.0 - SEKTOR MATCHDAY (STABILISIERTE ELITE-EDITION)
 * Fokus: Taktik-Setup (4-4-2 vs 3-4-3) & Motivations-Zentrale
 */
window.SektorMatchday = {
    isGrassrootsMode: true, 

    speechDatabase: [
        "Ich will heute keine taktischen Roboter sehen! Ich will, dass ihr diesen Platz liebt. Jagt dem Ball hinterher, als wäre er das Letzte, was es heute zu essen gibt! VOLLGAS-FUSSBALL!",
        "Struktur ist die Basis, aber Leidenschaft gewinnt Schlachten. Sobald sie unsere rote Zone betreten, schnappt die Falle zu. Maximale Kompaktzeit, Jungs. Wir kontrollieren den Raum!",
        "Mentalitätsmonster-Modus an! Wir lassen sie im Aufbau kommen, aber im Umschaltspiel sind wir tödlich. Zeigt ihnen, dass wir heute jeden Grashalm in diesem Stadion kontrollieren!",
        "Präzision in jedem Pass, Feuer in jedem Zweikampf. Wir sind physisch und mental bei 100%. Jetzt transformieren wir das Training in absolute Dominanz. Geht raus und holt euch das!",
        "Gegenpressing ist der beste Spielmacher der Welt! Jagt sie, bis sie vergessen, wie man Fußball spielt!",
        "Männer, taktisch haben wir sie analysiert, aber am Ende entscheidet das Herz. Werft alles rein für den Verein!"
    ],

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Schutz gegen Abschneiden
        content.style.paddingBottom = "120px";
        content.style.overflowY = "auto";

        this.render();

        // REPARATUR: Sicherer Aufruf der Arena-Formationen
        if (window.arena) {
            // Wir setzen den Modus auf 'match', damit die Arena weiß, was zu tun ist
            if(window.Database) window.Database.activeMode = 'match';
            
            // TONI Team A -> 4-4-2 | TRAINER Team B -> 3-4-3
            this.applyMatchFormations();
            
            const initialText = "Matchday-Setup geladen. Toni im 4-4-2 gegen deine Auswahl im 3-4-3.";
            if(window.ToniVoice) window.ToniVoice.speak(initialText);
        }
    },

    applyMatchFormations() {
        if(!window.arena || !window.arena.formations) return;
        
        const w = window.arena.canvas.width;
        const h = window.arena.canvas.height - window.arena.benchHeight;
        
        // Holen der Formationen aus der arena.js
        const f442 = window.arena.formations['4-4-2'];
        const f343 = window.arena.formations['3-4-3'];

        // Spieler zuordnen (A = Toni, B = Trainer)
        const players = window.Database ? window.Database.players : [];
        
        // Team A (Toni) -> 4-4-2
        const teamA = players.filter(p => p.team === 'A');
        teamA.forEach((p, i) => {
            if(f442[i]) {
                p.targetX = f442[i].x * w;
                p.targetY = f442[i].y * h;
            }
        });

        // Team B (Trainer) -> 3-4-3
        const teamB = players.filter(p => p.team === 'B');
        teamB.forEach((p, i) => {
            if(f343[i]) {
                p.targetX = f343[i].x * w;
                p.targetY = f343[i].y * h;
            }
        });

        window.arena.isAnimating = true;
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const plan = (window.Database && window.Database.matchPlan) ? window.Database.matchPlan : { opponentInfo: "Toni scannt..." };
        const coach = window.coachInfo || { name: "Coach", verein: "Dein Verein" };
        const startSpeech = this.speechDatabase[Math.floor(Math.random() * this.speechDatabase.length)];

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--accent-orange); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-orange); letter-spacing: 2px; font-family:'Orbitron';">MATCHDAY HUB: ${coach.verein?.toUpperCase() || 'ARENA'}</h2>
                    <span style="color: #888; font-size: 0.7rem; letter-spacing: 1px;">STRATEGIE-MAPPE | SAISON 2026</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.SektorMatchday.showPlayerIDs()" style="border-color: var(--data-cyan); color: var(--data-cyan);">
                        <i class="fas fa-id-card"></i> PÄSSE
                    </button>
                    <button class="tactic-btn" onclick="window.SektorMatchday.toggleMode()">
                        ${this.isGrassrootsMode ? 'KREISLIGA' : 'PROFI'}
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.toggle()">ARENA</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                <div style="display:flex; flex-direction:column; gap:15px;">
                    <div style="background: rgba(255,106,0,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,106,0,0.2);">
                        <h3 style="color:var(--accent-orange); font-size: 0.8rem; margin-bottom:10px;"><i class="fas fa-search"></i> GEGNER-ANALYSE</h3>
                        <div id="opponent-info-box" style="font-size: 0.8rem; color: #ccc; line-height: 1.5; border-left: 2px solid var(--accent-orange); padding-left: 10px;">
                            ${plan.opponentInfo || "System-Check: Gegner spielt 4-4-2. Wir kontern mit schnellen Flügelwechseln."}
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 12px; border: 1px solid #333;">
                        <h3 style="color:#fff; font-size: 0.8rem; margin-bottom:10px;"><i class="fas fa-chess-board"></i> FORMATIONEN</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div style="background:rgba(57,255,20,0.05); padding:10px; border-radius:8px; border:1px solid var(--neon-green); text-align:center;">
                                <small style="color:var(--neon-green);">TRAINER</small><br><strong>3-4-3</strong>
                            </div>
                            <div style="background:rgba(212,175,55,0.05); padding:10px; border-radius:8px; border:1px solid var(--accent-gold); text-align:center;">
                                <small style="color:var(--accent-gold);">TONI (KI)</small><br><strong>4-4-2</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:15px;">
                    <div style="background: #000; padding: 20px; border-radius: 12px; border: 1px solid var(--neon-green); box-shadow: 0 0 15px rgba(57,255,20,0.1);">
                        <h3 style="color:var(--neon-green); font-size: 0.8rem; margin-bottom:10px;"><i class="fas fa-microphone"></i> KABINENANSPRACHE</h3>
                        <p id="toni-motivation-speech" style="font-style:italic; font-size: 0.9rem; color:#fff; line-height:1.4;">
                            "${startSpeech}"
                        </p>
                        <button class="pro-btn-gold" style="margin-top:15px; width:100%;" onclick="window.SektorMatchday.getNewSpeech()">NEUE ANSPRACHE</button>
                    </div>

                    <div style="display: ${this.isGrassrootsMode ? 'block' : 'none'}; background: rgba(255,255,255,0.02); padding: 20px; border-radius: 12px; border: 1px solid #333;">
                        <h3 style="color:var(--data-cyan); font-size: 0.7rem; margin-bottom:10px;"><i class="fas fa-tasks"></i> CHECKLISTE</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:0.75rem; color:#888;">
                            <label><input type="checkbox"> Trikots</label>
                            <label><input type="checkbox"> Wasser</label>
                            <label><input type="checkbox"> Pässe</label>
                            <label><input type="checkbox"> Sanikoffer</label>
                        </div>
                    </div>
                </div>
            </div>

            <div id="player-id-section" style="margin-top:30px; display:none;"></div>
        `;
    },

    showPlayerIDs() {
        const section = document.getElementById('player-id-section');
        const players = window.Database ? window.Database.players : [];
        section.style.display = 'block';
        section.innerHTML = `
            <div style="background:rgba(13,20,33,0.95); padding:20px; border-radius:15px; border:1px solid var(--data-cyan);">
                <h3 style="color:var(--data-cyan); font-size:0.9rem; margin-bottom:15px;">DIGITALE PASSKONTROLLE</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
                    ${players.map(p => `
                        <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; align-items:center; gap:10px; border:1px solid #333;">
                            <i class="fas fa-id-badge" style="color:var(--neon-green)"></i>
                            <div style="font-size:0.8rem; color:#fff;">${p.name}</div>
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

    getNewSpeech() {
        const random = this.speechDatabase[Math.floor(Math.random() * this.speechDatabase.length)];
        const el = document.getElementById('toni-motivation-speech');
        if(el) el.innerText = `"${random}"`;
        if(window.ToniVoice) window.ToniVoice.speak(random);
    }
};
