/**
 * TONI 2.0 - SEKTOR MANAGEMENT & BUSINESS
 * Status: ELITE UPDATE (Sync-Fix, Clipping-Schutz & Stadion-Heft Brücke)
 */
window.SektorManagement = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Fix: Platz für Scroll-Inhalte schaffen
        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";

        this.renderMain();
    },

    renderMain() {
        const content = document.querySelector('.briefcase-window');
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--neon-green); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px; font-family:'Orbitron';">BUSINESS-HUB & MANAGEMENT</h2>
                    <span style="color: var(--text-dim); font-size: 0.75rem;">FINANZEN | SPONSORING | ORGANISATION</span>
                </div>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
                
                <div class="mgmt-card" style="background: rgba(0,0,0,0.4); padding: 30px; border-radius: 15px; border: 1px solid var(--accent-gold); transition: 0.3s;">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px;">
                        <i class="fas fa-handshake"></i> PARTNER-VERWALTUNG
                    </div>
                    <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 25px; line-height: 1.5;">Zentrale Datenbank für Logos. Der markierte <b>Hauptpartner</b> wird automatisch auf das Cover der Stadionzeitung gesetzt.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showSponsorManager()">POOL ÖFFNEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.4); padding: 30px; border-radius: 15px; border: 1px solid #333;">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px;">
                        <i class="fas fa-chart-line"></i> DEAL-KALKULATOR
                    </div>
                    <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 25px; line-height: 1.5;">KI-basierte Preisberatung für Werbeflächen basierend auf regionalen Marktwerten 2026.</p>
                    <button class="pro-btn-gold" style="width: 100%; border-color: var(--data-cyan); color: var(--data-cyan);" onclick="window.SektorManagement.showFinance()">RECHNER STARTEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.4); padding: 30px; border-radius: 15px; border: 1px solid #333;">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px;">
                        <i class="fas fa-calendar-check"></i> EVENT-CHECKLISTE
                    </div>
                    <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 25px; line-height: 1.5;">Automatisierter Ablaufplan für Schiedsrichter-Betreuung und Platzabnahme.</p>
                    <button class="pro-btn-gold" style="width: 100%; border-color: var(--neon-green); color: var(--neon-green);" onclick="window.SektorManagement.showEventPlaner()">CHECKLISTEN</button>
                </div>

            </div>
            <div id="mgmt-sub-content" style="margin-top: 40px; padding-bottom: 50px;"></div>
        `;
    },

    showSponsorManager() {
        this.renderSponsorList();
    },

    renderSponsorList() {
        const sub = document.getElementById('mgmt-sub-content');
        if (!window.Database.sponsors) window.Database.sponsors = [];
        const sponsors = window.Database.sponsors;

        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 15px; border: 1px solid #444;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <div>
                        <h3 style="color: var(--accent-gold); margin:0; letter-spacing:1px; font-family:'Orbitron';">AKTIVE PARTNER</h3>
                        <small style="color:#666;">Synchronisation mit dem Stadion-Magazin aktiv</small>
                    </div>
                    <button class="tactic-btn" style="border-color: var(--neon-green); color: var(--neon-green);" onclick="window.SektorManagement.addSponsor()">+ NEUER PARTNER</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
                    ${sponsors.length === 0 ? '<p style="color:#555; grid-column: 1/-1; text-align:center; padding: 20px;">Keine Partner im Pool hinterlegt.</p>' : ''}
                    ${sponsors.map((s, index) => `
                        <div style="background:#000; padding: 20px; border-radius: 12px; text-align:center; border: 1px solid ${s.isMain ? 'var(--accent-gold)' : '#222'}; position:relative;">
                            ${s.isMain ? `<div style="position:absolute; top:-10px; right:10px; background:var(--accent-gold); color:#000; font-size:0.5rem; padding:2px 6px; border-radius:4px; font-weight:bold; z-index:2;">HAUPTSPONSOR</div>` : ''}
                            
                            <div style="width:100%; height:80px; background: rgba(255,255,255,0.03); border-radius: 8px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; border: 1px solid #111;">
                                ${s.logo ? `<img src="${s.logo}" style="max-width:85%; max-height:85%; object-fit:contain;">` : `<i class="fas fa-image" style="opacity:0.1; font-size:2rem;"></i>`}
                            </div>
                            <div style="font-size: 0.9rem; font-weight: bold; color:#fff;">${s.name}</div>
                            <div style="font-size: 0.65rem; color: var(--neon-green); margin-top:4px; font-weight:bold;">${s.type.toUpperCase()}</div>
                            
                            <div style="display:flex; flex-direction:column; gap:8px; margin-top:15px;">
                                <div style="display:flex; gap:5px;">
                                    <button class="tactic-btn" style="flex:1; padding:5px; font-size:0.6rem;" onclick="document.getElementById('logo-up-${index}').click()">LOGO UP</button>
                                    <button class="tactic-btn" style="flex:1; padding:5px; font-size:0.6rem; ${s.isMain ? 'background:var(--accent-gold); color:#000;' : ''}" onclick="window.SektorManagement.setMainSponsor(${index})">MAIN</button>
                                </div>
                                <button class="tactic-btn" style="padding:5px; font-size:0.6rem; color:var(--status-error); border-color:#400;" onclick="window.SektorManagement.deleteSponsor(${index})">
                                    <i class="fas fa-trash"></i> PARTNER LÖSCHEN
                                </button>
                            </div>
                            <input type="file" id="logo-up-${index}" style="display:none" onchange="window.SektorManagement.uploadLogo(event, ${index})">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    },

    setMainSponsor(index) {
        window.Database.sponsors.forEach((s, i) => s.isMain = (i === index));
        this.saveAndSync();
        if(window.ToniVoice) window.ToniVoice.speak("Hauptsponsor für die Stadionzeitung wurde aktualisiert.");
    },

    addSponsor() {
        const name = prompt("Name des Unternehmens:");
        if (!name) return;
        const type = prompt("Kategorie (z.B. Hauptsponsor, Premium-Partner):", "Partner");
        window.Database.sponsors.push({ 
            name, 
            type, 
            logo: null,
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

    saveAndSync() {
        if(window.Database.save) window.Database.save();
        
        // Live-Sync für die Stadionzeitung
        const syncData = { sponsors: window.Database.sponsors };
        localStorage.setItem('toni_management_data', JSON.stringify(syncData));
        
        this.renderSponsorList();
        console.log("Sponsoren-Pool synchronisiert.");
    },

    showFinance() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 15px; border: 1px solid #444;">
                <h3 style="color: var(--data-cyan); margin-bottom: 20px; letter-spacing:1px; font-family:'Orbitron';">MARKTPREIS-RECHNER 2026</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button class="tactic-btn" style="text-align:left; padding:15px;" onclick="window.SektorManagement.calc('heft')">STADIONHEFT (A5 ANZEIGE)</button>
                        <button class="tactic-btn" style="text-align:left; padding:15px;" onclick="window.SektorManagement.calc('bande')">BANDE (PRO METER)</button>
                        <button class="tactic-btn" style="text-align:left; padding:15px;" onclick="window.SektorManagement.calc('trikot')">TRIKOT (BRUST)</button>
                    </div>
                    <div id="calc-result" style="background: rgba(0,0,0,0.5); padding: 25px; border-radius: 12px; border-left: 5px solid var(--data-cyan); display:flex; align-items:center; justify-content:center; text-align:center; min-height:150px;">
                        <span style="color:#555; font-style:italic;">Wähle eine Kategorie...</span>
                    </div>
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    },

    calc(type) {
        const res = document.getElementById('calc-result');
        let text = "";
        if(type === 'heft') text = "<strong>STADIONHEFT:</strong><br><br>Empfehlung: 250€ pro Saison.<br><small>Für die ${window.currentTeamContext || 'Senioren'}.</small>";
        if(type === 'bande') text = "<strong>BANDE:</strong><br><br>Empfehlung: 800€ pro 3 Meter.<br><small>Sichtbarkeit: Hoch.</small>";
        if(type === 'trikot') text = "<strong>TRIKOT:</strong><br><br>Verhandlungsbasis ab 2.500€.<br><small>Elite-Branding.</small>";
        res.innerHTML = `<div style="color:#fff; font-size:1rem; line-height:1.6;">${text}</div>`;
    },

    showEventPlaner() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 15px; border: 1px solid #444;">
                <h3 style="color: var(--neon-green); margin-bottom: 25px; letter-spacing:1px; font-family:'Orbitron';">SPIELTAGS-CHECKLISTE</h3>
                <div style="display:grid; gap:15px;">
                    <label style="display:flex; align-items:center; gap:15px; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; cursor:pointer;">
                        <input type="checkbox" style="width:20px; height:20px; accent-color:var(--neon-green);"> Schiedsrichter-Kabine vorbereitet
                    </label>
                    <label style="display:flex; align-items:center; gap:15px; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; cursor:pointer;">
                        <input type="checkbox" style="width:20px; height:20px; accent-color:var(--neon-green);"> Kassenhäuschen besetzt
                    </label>
                    <label style="display:flex; align-items:center; gap:15px; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; cursor:pointer;">
                        <input type="checkbox" style="width:20px; height:20px; accent-color:var(--neon-green);"> Platzabnahme erfolgt
                    </label>
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    }
};
