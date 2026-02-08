/**
 * TONI 2.0 - SEKTOR MANAGEMENT & BUSINESS
 * Zentrale für Finanzen, Sponsoring-Datenbank und Event-Checklisten.
 * Synchronisiert Partner-Daten direkt mit dem Stadion-Magazin.
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

            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid #222; transition: 0.3s;">
                    <div style="color: var(--accent-gold); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-handshake"></i> PARTNER-VERWALTUNG
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Datenbank für Logos und Verträge. <b>Live-Sync mit der Stadionzeitung aktiv.</b></p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showSponsorManager()">POOL ÖFFNEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--data-cyan); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-chart-line"></i> DEAL-KALKULATOR
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Toni's Preisberatung für Werbeflächen basierend auf Marktwerten 2026.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showFinance()">RECHNER STARTEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--neon-green); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-calendar-check"></i> EVENT-CHECKLISTE
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Ablaufplan für Schiedsrichter, Catering und Platzabnahme.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showEventPlaner()">CHECKLISTEN</button>
                </div>

            </div>
            <div id="mgmt-sub-content" style="margin-top: 30px;"></div>
        `;
    },

    // --- SPONSOREN MANAGER & PERSISTENZ ---
    showSponsorManager() {
        this.renderSponsorList();
    },

    renderSponsorList() {
        const sub = document.getElementById('mgmt-sub-content');
        // Daten aus Datenbank laden oder neu initialisieren
        if (!window.Database.sponsors) window.Database.sponsors = [];
        const sponsors = window.Database.sponsors;

        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h3 style="color: var(--accent-gold); margin:0;">SPONSOREN-POOL</h3>
                        <small style="color:#555;">Änderungen fließen sofort in das Matchday-Magazin</small>
                    </div>
                    <button class="tactic-btn" onclick="window.SektorManagement.addSponsor()">+ NEUER PARTNER</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px;">
                    ${sponsors.map((s, index) => `
                        <div style="background:#000; padding: 15px; border-radius: 10px; text-align:center; border: 1px solid #222; position:relative;">
                            <div style="position:absolute; top:5px; left:5px; font-size:10px; color:var(--neon-green);">
                                <i class="fas fa-sync" title="Sync aktiv"></i>
                            </div>
                            <div style="width:100%; height:60px; background: rgba(255,255,255,0.03); border-radius: 5px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; border: 1px solid #111;">
                                ${s.logo ? `<img src="${s.logo}" style="max-width:90%; max-height:90%; object-fit:contain;">` : `<i class="fas fa-image" style="opacity:0.1; font-size:1.5rem;"></i>`}
                            </div>
                            <div style="font-size: 0.8rem; font-weight: bold; color:#fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.name}</div>
                            <div style="font-size: 0.6rem; color: var(--neon-green); margin-top:2px;">${s.type.toUpperCase()}</div>
                            
                            <div style="display:flex; gap:5px; justify-content:center; margin-top:12px;">
                                <button class="tactic-btn" style="padding:4px 10px; font-size:0.6rem; background: #222;" onclick="document.getElementById('logo-up-${index}').click()">
                                    <i class="fas fa-upload"></i> LOGO
                                </button>
                                <button class="tactic-btn" style="padding:4px 10px; font-size:0.6rem; color:#ff3b30; border-color:#440000;" onclick="window.SektorManagement.deleteSponsor(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <input type="file" id="logo-up-${index}" style="display:none" onchange="window.SektorManagement.uploadLogo(event, ${index})">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    addSponsor() {
        const name = prompt("Name des Unternehmens:");
        if (!name) return;
        const type = prompt("Kategorie (z.B. Hauptsponsor, Premium-Partner, lokale Gastro):", "Partner");
        window.Database.sponsors.push({ name, type, logo: null });
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
        if(confirm("Partner aus Datenbank entfernen? Er wird auch aus der Stadionzeitung gelöscht.")) {
            window.Database.sponsors.splice(index, 1);
            this.saveAndSync();
        }
    },

    /**
     * Zentrale Speicher-Logik: Datenbank und Stadion-Sync Key
     */
    saveAndSync() {
        // 1. In globaler Datenbank speichern
        window.Database.save();
        
        // 2. Extra-Key für den Sektor Stadion zur einfachen Synchronisation
        const syncData = { sponsors: window.Database.sponsors };
        localStorage.setItem('toni_management_data', JSON.stringify(syncData));
        
        // 3. UI aktualisieren
        this.renderSponsorList();
    },

    // --- FINANZEN & DEAL-RECHNER ---
    showFinance() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <h3 style="color: var(--data-cyan); margin-bottom: 15px;">DEAL-KALKULATOR (MARKTPREISE 2026)</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p style="color: #888; font-size: 0.8rem; margin-bottom: 15px;">Wähle eine Werbefläche für Toni's Kalkulation:</p>
                        <button class="tactic-btn" style="width:100%; margin-bottom:10px; text-align:left;" onclick="window.SektorManagement.calc('heft')">STADIONHEFT (ANZEIGE)</button>
                        <button class="tactic-btn" style="width:100%; margin-bottom:10px; text-align:left;" onclick="window.SektorManagement.calc('bande')">BANDENWERBUNG (3M)</button>
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.SektorManagement.calc('trikot')">TRIKOT-BRANDING (BRUST)</button>
                    </div>
                    <div id="calc-result" style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 10px; border-left: 3px solid var(--data-cyan); display:flex; align-items:center; justify-content:center; text-align:center;">
                        <span style="color:#555; font-style:italic;">Wähle eine Fläche links aus...</span>
                    </div>
                </div>
            </div>
        `;
    },

    calc(type) {
        const res = document.getElementById('calc-result');
        let text = "";
        if(type === 'heft') text = "<strong>STADIONHEFT (A5):</strong><br><br>Empfehlung: 150€ - 300€ pro Saison.<br><small>Toni: 'Coach, wir verkaufen hier Emotionen, nicht nur Pixel. Der Preis ist fair!'</small>";
        if(type === 'bande') text = "<strong>BANDENWERBUNG:</strong><br><br>Empfehlung: 500€ - 1.200€ pro Saison.<br><small>Toni: 'Achte auf die Kameraposition! Je sichtbarer, desto wertvoller der Deal.'</small>";
        if(type === 'trikot') text = "<strong>TRIKOT (BRUST):</strong><br><br>Empfehlung: 1.500€ - 5.000€+.<br><small>Toni: 'Das ist das Heiligtum. Hier lassen wir nur Partner ran, die den Verein wirklich im Herzen tragen!'</small>";
        res.innerHTML = `<div style="color:#fff; font-size:0.9rem;">${text}</div>`;
    },

    // --- EVENT-PLANER ---
    showEventPlaner() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <h3 style="color: var(--neon-green); margin-bottom: 15px;">SPIELTAGS-CHECKLISTE</h3>
                <ul style="list-style: none; color: #ccc; font-size: 0.9rem;">
                    <li style="margin-bottom: 12px; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" style="accent-color: var(--neon-green); width:18px; height:18px;"> Schiedsrichter-Empfang vorbereitet
                    </li>
                    <li style="margin-bottom: 12px; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" style="accent-color: var(--neon-green); width:18px; height:18px;"> Verpflegung Verkaufstand geprüft
                    </li>
                    <li style="margin-bottom: 12px; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" style="accent-color: var(--neon-green); width:18px; height:18px;"> Platzmarkierungen okay
                    </li>
                </ul>
                <div style="margin-top:20px; padding:10px; background:rgba(0,0,0,0.3); border-radius:5px; font-size:0.7rem; color:#888;">
                    <i class="fas fa-info-circle"></i> Toni erinnert dich 2 Stunden vor Anpfiff an die Platzabnahme!
                </div>
            </div>
        `;
    }
};
