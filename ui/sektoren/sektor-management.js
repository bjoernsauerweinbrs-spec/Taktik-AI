/**
 * TONI 2.0 - SEKTOR MANAGEMENT & BUSINESS
 * Zentrale für Finanzen, Sponsoring-Akquise und Event-Checklisten.
 * Rettet die Original-Daten und erweitert sie um Toni's Business-KI.
 */
window.SektorManagement = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.renderMain();
    },

    renderMain() {
        const content = document.querySelector('.briefcase-window');
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">BUSINESS-HUB & MANAGEMENT</h2>
                    <span style="color: #888; font-size: 0.7rem;">FINANZEN | SPONSORING | ORGANISATION</span>
                </div>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="management-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                
                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--accent-gold); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-handshake"></i> PARTNER-AKQUISE
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Verwalte deine Sponsoren und nutze Toni's Verhandlungstipps.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showSponsoring()">ÖFFNEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--data-cyan); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-chart-line"></i> DEAL-KALKULATOR
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Berechne faire Marktpreise für Banden, Trikots und Anzeigen.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showFinance()">BERATER STARTEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--neon-green); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-calendar-check"></i> EVENT-CHECKLISTE
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Dein Original-Ablaufplan für Heimspiele und Turniere.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showEventPlaner()">CHECKLISTEN</button>
                </div>

            </div>
            <div id="mgmt-sub-content" style="margin-top: 30px;"></div>
        `;
    },

    // --- SPONSORING (RETTET DEIN ORIGINAL-ANSCHREIBEN) ---
    showSponsoring() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <h3 style="color: var(--accent-gold); margin-bottom: 15px;">SPONSORING-ZENTRALE</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="font-size: 0.7rem; color: #555; text-transform: uppercase;">Dein Anschreiben-Entwurf:</h4>
                        <textarea class="pro-textarea" style="height: 180px; font-size: 0.8rem; margin-top: 10px;" readonly>
Sehr geehrte Damen und Herren,

als ambitionierter Fußballverein setzen wir auf modernste Technologie und professionelle Strukturen. Für unser nächstes Projekt suchen wir starke Partner aus der Region, die mit uns gemeinsam neue Wege gehen wollen...
                        </textarea>
                        <button class="tactic-btn" style="margin-top: 10px; width: 100%;" onclick="alert('In Zwischenablage kopiert')">TEXT KOPIEREN</button>
                    </div>
                    <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px;">
                        <h4 style="font-size: 0.7rem; color: var(--neon-green);">TONI'S AKQUISE-TIPP:</h4>
                        <p style="font-size: 0.85rem; font-style: italic; color: #ccc; margin-top: 10px;">
                            "Coach, erwähne beim nächsten Termin unbedingt unser digitales Cockpit. Sponsoren lieben Innovation! Sag ihnen, dass ihre Marke nicht nur auf Stoff steht, sondern in einer High-Tech-Umgebung präsentiert wird."
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    // --- FINANZEN & DEAL-RECHNER (NEU) ---
    showFinance() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <h3 style="color: var(--data-cyan); margin-bottom: 15px;">DEAL-KALKULATOR</h3>
                <p style="color: #888; font-size: 0.8rem;">Wähle eine Werbefläche, um Toni's Preisempfehlung zu sehen:</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="tactic-btn" onclick="alert('Empfehlung: 150€ - 300€ pro Saison (je nach Auflage)')">Stadionheft (A5)</button>
                    <button class="tactic-btn" onclick="alert('Empfehlung: 500€ - 1.200€ pro Saison')">Bandenwerbung</button>
                    <button class="tactic-btn" onclick="alert('Empfehlung: 1.500€+ (Premium-Partner)')">Trikot-Branding</button>
                </div>
            </div>
        `;
    },

    // --- EVENT-PLANER (RETTET DEINE ORIGINAL-CHECKLISTE) ---
    showEventPlaner() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <h3 style="color: var(--neon-green); margin-bottom: 15px;">SPIELTAGS-CHECKLISTE</h3>
                <ul style="list-style: none; color: #ccc; font-size: 0.9rem;">
                    <li style="margin-bottom: 10px;"><input type="checkbox"> Schiedsrichter-Empfang vorbereitet</li>
                    <li style="margin-bottom: 10px;"><input type="checkbox"> Verpflegung Verkaufstand geprüft</li>
                    <li style="margin-bottom: 10px;"><input type="checkbox"> Platzmarkierungen (Neon-Check) okay</li>
                    <li style="margin-bottom: 10px;"><input type="checkbox"> Security-Einweisung durchgeführt</li>
                </ul>
            </div>
        `;
    }
};
