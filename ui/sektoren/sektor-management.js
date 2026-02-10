/**
 * TONI 2.0 - SEKTOR MANAGEMENT (ELITE BUSINESS HUB)
 * Status: MASTER-SYNC 2026 (Analyse-Brücke & Kalkulator-Pro)
 */
window.SektorManagement = {
    
    init() {
        if (!window.Database.sponsors) {
            window.Database.sponsors = [
                { name: "Global Sports Tech", type: "Hauptpartner", logo: null, isMain: true, value: 50000 },
                { name: "Regio-Drink", type: "Premium-Partner", logo: null, isMain: false, value: 12000 }
            ];
        }
        // Initialer Sync für andere Sektoren
        this.saveAndSync(false);
    },

    open() {
        this.init();
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";

        this.renderMain();
    },

    /**
     * DASHBOARD: Finanz-Übersicht & KI-Business-Check
     */
    renderMain() {
        const content = document.querySelector('.briefcase-window');
        const sponsors = window.Database.sponsors || [];
        const totalRevenue = sponsors.reduce((acc, s) => acc + (parseInt(s.value) || 0), 0);
        
        // Berechnung des Marktwert-Hebels (basierend auf Kader-Rating)
        const avgRating = this.getAverageRating();
        const marketLeverage = (avgRating / 70).toFixed(2); // Hebel für Verhandlungen

        content.innerHTML = `
            <div class="fadeIn" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--accent-gold); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-gold); letter-spacing: 2px; font-family:'Orbitron';">MANAGEMENT & BUSINESS</h2>
                    <span style="color: var(--text-dim); font-size: 0.75rem; text-transform:uppercase;">${window.coachInfo.verein} | FINANZ-STRATEGIE</span>
                </div>
                <div style="text-align:right;">
                    <div style="color:var(--neon-green); font-family:'Orbitron'; font-size:1.2rem;">${totalRevenue.toLocaleString()} €</div>
                    <div style="color:#444; font-size:0.5rem; letter-spacing:1px;">REVENUE p.A. (MARKT-HEBEL: x${marketLeverage})</div>
                </div>
            </div>

            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
                
                <div class="mgmt-card" style="background: rgba(212, 175, 55, 0.05); padding: 30px; border-radius: 15px; border: 1px solid var(--accent-gold);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; font-family:'Orbitron';">
                        <i class="fas fa-handshake"></i> PARTNER-POOL
                    </div>
                    <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 25px; line-height: 1.5;">Verwalte Partner-Logos für die <b>Stadionzeitung</b>. Aktive Partner: ${sponsors.length}.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showSponsorManager()">POOL ÖFFNEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,209,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid var(--data-cyan);">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; font-family:'Orbitron';">
                        <i class="fas fa-chart-line"></i> DEAL-KALKULATOR
                    </div>
                    <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 25px; line-height: 1.5;">Berechnet Werbe-Preise basierend auf der <b>Live-Performance</b> deines Kaders.</p>
                    <button class="pro-btn-gold" style="width: 100%; border-color: var(--data-cyan); color: var(--data-cyan);" onclick="window.SektorManagement.showFinance()">RECHNER STARTEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(57,255,20,0.05); padding: 30px; border-radius: 15px; border: 1px solid var(--neon-green);">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; font-family:'Orbitron';">
                        <i class="fas fa-microscope"></i> INFRASTRUKTUR
                    </div>
                    <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 25px; line-height: 1.5;">Erweiterung des <b>Analysezentrums</b> und digitale Stadion-Services.</p>
                    <button class="pro-btn-gold" style="width: 100%; border-color: var(--neon-green); color: var(--neon-green);" onclick="window.SektorManagement.showUpgrades()">UPGRADES</button>
                </div>

            </div>

            <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 15px; border: 1px solid #333;">
                <h4 style="color: var(--neon-green); font-size: 0.75rem; font-family:'Orbitron'; margin:0 0 10px 0;"><i class="fas fa-robot"></i> TONI'S BUSINESS-CHECK</h4>
                <p style="font-size: 0.8rem; color: #888; margin:0; line-height:1.6;">
                    ${avgRating > 75 
                        ? `"Coach, durch das hohe Kader-Rating (${avgRating}) ist die Marke ${window.coachInfo.verein} wertvoller geworden. Der Markthebel von ${marketLeverage} erlaubt uns, bei Neuverhandlungen 20% mehr Budget zu fordern."`
                        : `"Wir sollten das Analysezentrum ausbauen, um die Spielerwerte zu steigern. Das verbessert unsere Position im Sponsoring-Markt."`}
                </p>
            </div>

            <div id="mgmt-sub-content" style="margin-top: 40px; padding-bottom: 50px;"></div>
        `;
    },

    getAverageRating() {
        const players = window.Database.players || [];
        if (players.length === 0) return 60;
        const sum = players.reduce((acc, p) => acc + (parseInt(p.rat) || 0), 0);
        return Math.round(sum / players.length);
    },

    showSponsorManager() {
        this.renderSponsorList();
    },

    renderSponsorList() {
        const sub = document.getElementById('mgmt-sub-content');
        const sponsors = window.Database.sponsors || [];

        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 15px; border: 1px solid #444;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <h3 style="color: var(--accent-gold); margin:0; letter-spacing:1px; font-family:'Orbitron';">PARTNER-POOL</h3>
                    <button class="tactic-btn" style="border-color: var(--neon-green); color: var(--neon-green);" onclick="window.SektorManagement.addSponsor()">+ NEUER PARTNER</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
                    ${sponsors.map((s, index) => `
                        <div style="background:#000; padding: 20px; border-radius: 12px; text-align:center; border: 1px solid ${s.isMain ? 'var(--accent-gold)' : '#222'}; position:relative;">
                            ${s.isMain ? `<div style="position:absolute; top:-10px; right:10px; background:var(--accent-gold); color:#000; font-size:0.5rem; padding:2px 6px; border-radius:4px; font-weight:bold;">HAUPTPARTNER</div>` : ''}
                            <div style="width:100%; height:80px; background: rgba(255,255,255,0.03); border-radius: 8px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; border: 1px solid #111;">
                                ${s.logo ? `<img src="${s.logo}" style="max-width:85%; max-height:85%; object-fit:contain;">` : `<i class="fas fa-image" style="opacity:0.1; font-size:2rem;"></i>`}
                            </div>
                            <div style="font-size: 0.9rem; font-weight: bold; color:#fff;">${s.name}</div>
                            <div style="font-size: 0.65rem; color: var(--accent-gold); margin-top:4px;">${(s.value || 0).toLocaleString()} € / Saison</div>
                            
                            <div style="display:flex; gap:5px; margin-top:15px;">
                                <button class="tactic-btn" style="flex:1; padding:5px; font-size:0.6rem;" onclick="document.getElementById('logo-up-${index}').click()">LOGO</button>
                                <button class="tactic-btn" style="flex:1; padding:5px; font-size:0.6rem; ${s.isMain ? 'background:var(--accent-gold); color:#000;' : ''}" onclick="window.SektorManagement.setMainSponsor(${index})">MAIN</button>
                                <button class="tactic-btn" style="padding:5px; font-size:0.6rem; color:var(--status-error);" onclick="window.SektorManagement.deleteSponsor(${index})"><i class="fas fa-trash"></i></button>
                            </div>
                            <input type="file" id="logo-up-${index}" style="display:none" onchange="window.SektorManagement.uploadLogo(event, ${index})">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    },

    showFinance() {
        const sub = document.getElementById('mgmt-sub-content');
        const leverage = (this.getAverageRating() / 70);
        
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 15px; border: 1px solid var(--data-cyan);">
                <h3 style="color: var(--data-cyan); margin-bottom: 20px; letter-spacing:1px; font-family:'Orbitron';">DEAL-KALKULATOR (KI-GESTÜTZT)</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button class="tactic-btn" style="text-align:left; padding:15px;" onclick="window.SektorManagement.calc('heft', ${leverage})">STADIONZEITUNG (A5 ANZEIGE)</button>
                        <button class="tactic-btn" style="text-align:left; padding:15px;" onclick="window.SektorManagement.calc('bande', ${leverage})">WERBEBANDE (3 METER)</button>
                        <button class="tactic-btn" style="text-align:left; padding:15px;" onclick="window.SektorManagement.calc('trikot', ${leverage})">TRIKOT-SPONSORING (BRUST)</button>
                    </div>
                    <div id="calc-result" style="background: rgba(0,0,0,0.5); padding: 25px; border-radius: 12px; border-left: 5px solid var(--data-cyan); display:flex; align-items:center; justify-content:center; text-align:center; min-height:150px;">
                        <div style="color:#555; font-style:italic;">Analysiere Marktdaten...<br>Klicke auf eine Werbefläche.</div>
                    </div>
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    },

    calc(type, leverage) {
        const res = document.getElementById('calc-result');
        let base = 0;
        let label = "";
        
        if(type === 'heft') { base = 250; label = "Stadionzeitung (A5)"; }
        if(type === 'bande') { base = 800; label = "Werbebande (3m)"; }
        if(type === 'trikot') { base = 2500; label = "Trikotbrust"; }

        const finalPrice = Math.round(base * leverage);
        const bonus = Math.round(finalPrice - base);

        res.innerHTML = `
            <div style="color:#fff; text-align:left;">
                <div style="font-family:'Orbitron'; color:var(--data-cyan); margin-bottom:10px;">${label}</div>
                <div style="font-size:1.8rem; font-weight:900;">${finalPrice.toLocaleString()} € <small style="font-size:0.7rem; color:var(--neon-green);">+${bonus}€ PERFORMANCE-BONUS</small></div>
                <p style="font-size:0.7rem; color:#666; margin-top:10px;">Basierend auf einem Kader-Rating von ${this.getAverageRating()}.</p>
            </div>`;
    },

    showUpgrades() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(57,255,20,0.02); padding: 30px; border-radius: 15px; border: 1px solid var(--neon-green);">
                <h3 style="color: var(--neon-green); margin-bottom: 20px; letter-spacing:1px; font-family:'Orbitron';">INFRASTRUKTUR & UPGRADES</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:12px;">
                        <div style="font-weight:bold; color:#fff; margin-bottom:10px;">ANALYSEZENTRUM PRO</div>
                        <p style="font-size:0.7rem; color:#666; margin-bottom:15px;">Schaltet tiefergehende Biometrie-Scans und KI-Prognosen im Analyse-Sektor frei.</p>
                        <button class="tactic-btn" style="border-color:var(--neon-green); color:var(--neon-green); width:100%;" onclick="alert('Upgrade wird im nächsten System-Update installiert.')">JETZT AUSBAUEN</button>
                    </div>
                    <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:12px;">
                        <div style="font-weight:bold; color:#fff; margin-bottom:10px;">DIGITALE STADIONZEITUNG</div>
                        <p style="font-size:0.7rem; color:#666; margin-bottom:15px;">Ermöglicht das Versenden des Matchday-Reports als PDF per WhatsApp/Mail.</p>
                        <button class="tactic-btn" style="border-color:var(--data-cyan); color:var(--data-cyan); width:100%;" onclick="alert('Digital-Service wird konfiguriert.')">SERVICE AKTIVIEREN</button>
                    </div>
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    },

    // --- HELPER FUNCTIONS ---
    setMainSponsor(index) {
        window.Database.sponsors.forEach((s, i) => s.isMain = (i === index));
        this.saveAndSync();
        if(window.ToniVoice) window.ToniVoice.speak("Hauptpartner für das Matchday-Magazin gesetzt.");
    },

    addSponsor() {
        const name = prompt("Name des Unternehmens:");
        if (!name) return;
        const value = prompt("Sponsoring-Summe pro Saison (€):", "1000");
        window.Database.sponsors.push({ 
            name, 
            type: "Partner", 
            logo: null, 
            value: parseInt(value) || 0,
            isMain: window.Database.sponsors.length === 0 
        });
        this.saveAndSync();
    },

    uploadLogo(e, index) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            window.Database.sponsors[index].logo = reader.result;
            this.saveAndSync();
        };
        reader.readAsDataURL(file);
    },

    deleteSponsor(index) {
        if(confirm("Partner wirklich löschen?")) {
            window.Database.sponsors.splice(index, 1);
            this.saveAndSync();
        }
    },

    saveAndSync(rerender = true) {
        if(window.Database.save) window.Database.save();
        const syncData = { sponsors: window.Database.sponsors };
        localStorage.setItem('toni_management_data', JSON.stringify(syncData));
        if(rerender) this.renderSponsorList();
    }
};
