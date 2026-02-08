/**
 * TONI 2.0 - SEKTOR STADION (MATCHDAY MAGAGZIN GENERATOR)
 * Erstellt ein hochprofessionelles, editierbares 6-Seiten Hochglanz-Magazin.
 * Design: Elite-Sports-Layout | Rückseite: Fixierte Toni 2.0 Ad.
 */
window.SektorStadion = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        content.innerHTML = `
            <div class="magazine-editor-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">STADION-ZEITUNG: PRO-EDITOR</h2>
                    <span style="color: #888; font-size: 0.7rem; letter-spacing: 1px;">MODUS: LIVE-EDITING (IN TEXTE KLICKEN ZUM ÄNDERN)</span>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button class="pro-btn-gold" style="box-shadow: 0 0 15px var(--accent-gold);" onclick="window.print()">
                        <i class="fas fa-file-pdf"></i> MAGAGZIN DRUCKEN / EXPORT
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="magazine-viewport" style="display: flex; flex-direction: column; gap: 50px; align-items: center; padding-bottom: 100px;">
                
                <div class="mag-page" id="mag-p1">
                    <div class="mag-content cover-layout">
                        <div class="mag-club-logo" contenteditable="true">
                            <i class="fas fa-shield-halved" style="font-size: 4rem; color: var(--accent-gold);"></i>
                            <p>DEIN LOGO</p>
                        </div>
                        <div class="mag-title-box">
                            <h1 contenteditable="true">MATCHDAY</h1>
                            <h3 contenteditable="true">OFFIZIELLES ARENA-MAGAZIN</h3>
                        </div>
                        <div class="mag-main-feature">
                            <h2 contenteditable="true">DER KAMPF UM DIE SPITZE</h2>
                            <p contenteditable="true">FC FANTASIA vs. SC KICKERS | ANSTOSS 15:30</p>
                        </div>
                    </div>
                </div>

                <div class="mag-page" id="mag-p2">
                    <div class="mag-content">
                        <div class="mag-section-title">INSIDE TACTICS: COACH'S CORNER</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                            <div>
                                <h4 contenteditable="true" style="color: var(--neon-green);">DIE TAKTIK-VORSCHAU</h4>
                                <p contenteditable="true" style="font-size: 0.9rem; line-height: 1.6; color: #ccc;">
                                    "Wir erwarten heute einen Gegner, der extrem kompakt steht. Die asymmetrische Grundordnung im Spielaufbau wird entscheidend sein, um die erste Pressinglinie zu überspielen..."
                                </p>
                            </div>
                            <div style="background: rgba(57, 255, 20, 0.05); padding: 15px; border-radius: 10px; border-left: 3px solid var(--neon-green);">
                                <h4 contenteditable="true">KEY-FACTS</h4>
                                <ul style="font-size: 0.8rem; color: #aaa; padding-left: 20px;">
                                    <li contenteditable="true">Hohes Gegenpressing gefordert</li>
                                    <li contenteditable="true">Fokus auf zweite Bälle</li>
                                    <li contenteditable="true">Tempo-Umschaltspiel</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mag-page" id="mag-p3">
                    <div class="mag-content">
                        <div class="mag-section-title">DIE ELITE-ELF DES TAGES</div>
                        <div class="mag-squad-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
                            <div class="mini-fifa-card" contenteditable="true">SPIELER 1 (ST)</div>
                            <div class="mini-fifa-card" contenteditable="true">SPIELER 2 (ZM)</div>
                            <div class="mini-fifa-card" contenteditable="true">SPIELER 3 (IV)</div>
                            </div>
                    </div>
                </div>

                <div class="mag-page" id="mag-p4">
                    <div class="mag-content">
                        <div class="mag-section-title">UNSERE PREMIUM-PARTNER</div>
                        <div class="mag-sponsor-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 40px;">
                            <div class="sponsor-box" contenteditable="true">HAUPTSPONSOR LOGO / TEXT</div>
                            <div class="sponsor-box" contenteditable="true">STADION-PARTNER</div>
                            <div class="sponsor-box" contenteditable="true">Ausrüster</div>
                            <div class="sponsor-box" contenteditable="true">Business-Club</div>
                        </div>
                    </div>
                </div>

                <div class="mag-page" id="mag-p5">
                    <div class="mag-content">
                        <div class="mag-section-title">FAN-NEWS & INFOS</div>
                        <div style="padding: 20px; border: 1px dashed #444; margin-top: 20px;">
                            <h4 contenteditable="true">STADION-CATERING</h4>
                            <p contenteditable="true" style="font-size: 0.8rem;">Heute exklusiv: Die Stadionwurst "Elite" zum Vorteilspreis.</p>
                        </div>
                        <div style="margin-top: 30px;">
                            <h4 contenteditable="true">NÄCHSTES AUSWÄRTSSPIEL</h4>
                            <p contenteditable="true">Busfahrt nach Fantasia-City | Jetzt anmelden!</p>
                        </div>
                    </div>
                </div>

                <div class="mag-page mag-back-cover" id="mag-p6">
                    <div class="mag-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                        <div class="toni-ad-container">
                            <i class="fas fa-microchip" style="font-size: 5rem; color: var(--neon-green); margin-bottom: 20px;"></i>
                            <h1 style="color: #fff; letter-spacing: 10px; margin: 0;">TONI 2.0</h1>
                            <p style="color: var(--accent-gold); font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">The AI Revolution in Football</p>
                            
                            <div style="margin: 40px auto; width: 60%; height: 2px; background: linear-gradient(90deg, transparent, var(--neon-green), transparent);"></div>
                            
                            <p style="font-size: 1.2rem; color: #fff; font-style: italic; margin-bottom: 40px;">
                                "Weil Taktik kein Zufall ist."
                            </p>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; padding: 0 40px;">
                                <div style="font-size: 0.7rem; color: #888;">
                                    <i class="fas fa-check" style="color: var(--neon-green);"></i> NAGELSMANN ANALYTICS
                                </div>
                                <div style="font-size: 0.7rem; color: #888;">
                                    <i class="fas fa-check" style="color: var(--neon-green);"></i> KLOPP MOTIVATION ENGINE
                                </div>
                                <div style="font-size: 0.7rem; color: #888;">
                                    <i class="fas fa-check" style="color: var(--neon-green);"></i> LIVE VITAL-DATA SCAN
                                </div>
                                <div style="font-size: 0.7rem; color: #888;">
                                    <i class="fas fa-check" style="color: var(--neon-green);"></i> SMART EQUIPMENT LOGIC
                                </div>
                            </div>
                            
                            <div style="margin-top: 60px;">
                                <p style="font-size: 0.6rem; color: #444; letter-spacing: 2px;">WWW.TONI-FOOTBALL-AI.COM</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }
};
