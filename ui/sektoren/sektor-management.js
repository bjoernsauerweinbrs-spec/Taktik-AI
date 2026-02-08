/**
 * TONI 2.0 - SEKTOR MANAGEMENT & BUSINESS
 * Zentrale für Finanzen, Sponsoring-Datenbank und Event-Checklisten.
 * Integriert die Sponsoren-Verwaltung für das Stadion-Booklet.
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

            <div class="management-grid">
                
                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--accent-gold); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-handshake"></i> PARTNER-VERWALTUNG
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Datenbank für Logos und Verträge. Wird mit der Stadionzeitung synchronisiert.</p>
                    <button class="pro-btn-gold" style="width: 100%;" onclick="window.SektorManagement.showSponsorManager()">POOL ÖFFNEN</button>
                </div>

                <div class="mgmt-card" style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid #222;">
                    <div style="color: var(--data-cyan); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-chart-line"></i> DEAL-KALKULATOR
                    </div>
                    <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Toni's Preisberatung für Werbeflächen basierend auf Marktwerten.</p>
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

    // --- NEU: SPONSOREN MANAGER (FÜR DATENBANK) ---
    showSponsorManager() {
        const sub = document.getElementById('mgmt-sub-content');
        if(!window.Database.sponsors) window.Database.sponsors = [];
        this.renderSponsorList();
    },

    renderSponsorList() {
        const sub = document.getElementById('mgmt-sub-content');
        const sponsors = window.Database.sponsors || [];

        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3 style="color: var(--accent-gold);">SPONSOREN-POOL</h3>
                    <button class="tactic-btn" onclick="window.SektorManagement.addSponsor()">+ NEUER PARTNER</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px;">
                    ${sponsors.map((s, index) => `
                        <div style="background:#000; padding: 15px; border-radius: 10px; text-align:center; border: 1px solid #222;">
                            <div style="width:100%; height:60px; background: rgba(255,255,255,0.03); border-radius: 5px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                                ${s.logo ? `<img src="${s.logo}" style="max-width:90%; max-height:90%; object-fit:contain;">` : `<i class="fas fa-image" style="opacity:0.2;"></i>`}
                            </div>
                            <div style="font-size: 0.8rem; font-weight: bold; color:#fff;">${s.name}</div>
                            <div style="font-size: 0.6rem; color: var(--neon-green); margin-top:2px;">${s.type}</div>
                            <div style="display:flex; gap:5px; justify-content:center; margin-top:10px;">
                                <button class="tactic-btn" style="padding:2px 8px; font-size:0.6rem;" onclick="document.getElementById('logo-up-${index}').click()">LOGO</button>
                                <button class="tactic-btn" style="padding:2px 8px; font-size:0.6rem; color:#ff3b30;" onclick="window.SektorManagement.deleteSponsor(${index})">X</button>
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
        const type = prompt("Kategorie (z.B. Hauptsponsor, Banden-Partner, Ärmel-Sponsor):", "Partner");
        window.Database.sponsors.push({ name, type, logo: null });
        window.Database.save();
        this.renderSponsorList();
    },

    uploadLogo(e, index) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            window.Database.sponsors[index].logo = reader.result;
            window.Database.save();
            this.renderSponsorList();
        };
        reader.readAsDataURL(file);
    },

    deleteSponsor(index) {
        if(confirm("Partner aus Datenbank entfernen?")) {
            window.Database.sponsors.splice(index, 1);
            window.Database.save();
            this.renderSponsorList();
        }
    },

    // --- FINANZEN & DEAL-RECHNER (UPGRADE) ---
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
        if(type === 'heft') text = "<strong>STADIONHEFT (A5):</strong><br><br>Empfehlung: 150€ - 300€ pro Saison.<br><small>Toni: 'Coach, verkauf es als Premium-Platzierung neben der Taktik-Analyse!'</small>";
        if(type === 'bande') text = "<strong>BANDENWERBUNG:</strong><br><br>Empfehlung: 500€ - 1.200€ pro Saison.<br><small>Toni: 'Achte auf die Kameraposition! Je sichtbarer, desto teurer der Deal.'</small>";
        if(type === 'trikot') text = "<strong>TRIKOT (BRUST):</strong><br><br>Empfehlung: 1.500€ - 5.000€+.<br><small>Toni: 'Das ist das Herzstück. Hier verhandeln wir nur mit Partnern, die langfristig brennen!'</small>";
        res.innerHTML = `<div style="color:#fff; font-size:0.9rem;">${text}</div>`;
    },

    // --- EVENT-PLANER (ORIGINAL CHECKLISTE) ---
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
                        <input type="checkbox" style="accent-color: var(--neon-green); width:18px; height:18px;"> Platzmarkierungen (Neon-Check) okay
                    </li>
                    <li style="margin-bottom: 12px; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" style="accent-color: var(--neon-green); width:18px; height:18px;"> Security-Einweisung durchgeführt
                    </li>
                </ul>
            </div>
        `;
    }
};
