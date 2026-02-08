/**
 * TONI 2.0 - SEKTOR STADION (DYNAMISCHER MAGAZIN GENERATOR)
 * Feature: Automatische Sponsoren-Synchronisation mit dem Management-Hub.
 * Optimiert für A5-Booklet Druck & Snapshot-Beamer.
 */
window.SektorStadion = {
    // Grundgerüst der Seiten
    dynamicPages: [
        { 
            title: "INSIDE TACTICS: COACH'S CORNER", 
            content: `<div><h4 style="color: var(--neon-green);">DIE TAKTIK-VORSCHAU</h4><p style="font-size: 0.9rem; line-height: 1.6; color: #ccc;">"Wir erwarten heute einen Gegner, der extrem kompakt steht. Der Fokus liegt auf schnellem Umschaltspiel..."</p></div>` 
        },
        { 
            title: "DIE ELITE-ELF DES TAGES", 
            content: `<div class="mag-squad-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;"><div class="mini-fifa-card">SPIELER 1</div><div class="mini-fifa-card">SPIELER 2</div><div class="mini-fifa-card">SPIELER 3</div></div>` 
        },
        { 
            title: "UNSERE PREMIUM-PARTNER", 
            isSponsorPage: true, // Markierung für dynamisches Laden
            content: "" 
        },
        { 
            title: "FAN-NEWS & INFOS", 
            content: `<div><h4 style="color: var(--accent-gold);">STADION-CATERING</h4><p style="font-size: 0.8rem;">Heute exklusiv: Die Stadionwurst "Elite" zum Vorteilspreis.</p></div>` 
        }
    ],

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.syncSponsors(); // Erst Daten abgleichen
        this.render();
    },

    /**
     * Zieht sich die Sponsoren-Daten aus dem Management-Hub (localStorage)
     */
    syncSponsors() {
        const sponsorPage = this.dynamicPages.find(p => p.isSponsorPage);
        if (!sponsorPage) return;

        const rawData = localStorage.getItem('toni_management_data');
        const data = rawData ? JSON.parse(rawData) : { sponsors: [] };

        if (data.sponsors.length === 0) {
            sponsorPage.content = `
                <div style="text-align:center; padding: 20px; border: 1px dashed #ccc;">
                    <p style="color: #888; font-size: 0.8rem;">Noch keine Partner im Management-Hub hinterlegt.</p>
                    <p style="color: var(--neon-green); font-size: 0.7rem; cursor:pointer;" onclick="window.SektorManagement.open()">-> JETZT PARTNER ANLEGEN</p>
                </div>`;
        } else {
            let sponsorHTML = `<div class="mag-sponsor-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">`;
            data.sponsors.forEach(s => {
                sponsorHTML += `
                    <div class="sponsor-box" style="border: 1px solid #eee; padding: 10px; text-align: center;">
                        <div style="font-weight: bold; color: #333; font-size: 0.9rem;">${s.name.toUpperCase()}</div>
                        <div style="color: var(--neon-green); font-size: 0.6rem; letter-spacing: 1px;">${s.type || 'PREMIUM PARTNER'}</div>
                    </div>`;
            });
            sponsorHTML += `</div>`;
            sponsorPage.content = sponsorHTML;
        }
    },

    showPrintTip() {
        alert("TONI TIPP: Coach, für das perfekte Booklet stellst du im Druckdialog deines MacBook '2 Seiten pro Blatt' ein. So druckst du zwei A5-Seiten auf ein A4-Blatt. Einfach falten, tackern, fertig!");
    },

    beamSnapshot(index) {
        if (!window.arena) return alert("Fehler: Arena-System nicht aktiv.");
        const img = window.arena.getSnapshot();
        this.dynamicPages[index].content += `
            <div class="mag-snapshot" style="margin-top:20px; text-align:center;">
                <img src="${img}" style="width:100%; border:1px solid #ddd; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <p style="font-size:0.6rem; color:#888; margin-top:5px;">SNAPSHOT: ARENA BOARD</p>
            </div>`;
        this.render();
    },

    addPage() {
        this.dynamicPages.push({
            title: "NEUE MAGAZIN-SEITE",
            content: "<p>Klicke hier, um neuen Inhalt für deine Fans oder Sponsoren zu erstellen...</p>"
        });
        this.render();
    },

    removePage(index) {
        if (confirm("Möchtest du diese Seite wirklich aus der Stadion-Zeitung entfernen?")) {
            this.dynamicPages.splice(index, 1);
            this.render();
        }
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        
        let html = `
            <div class="magazine-editor-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">STADION-ZEITUNG: PRO-EDITOR</h2>
                    <div style="background: rgba(57, 255, 20, 0.1); border: 1px solid var(--neon-green); padding: 8px 15px; border-radius: 8px; margin-top: 10px; cursor:pointer; display: inline-block;" onclick="window.SektorStadion.showPrintTip()">
                        <span style="color:var(--neon-green); font-size: 0.75rem; font-weight: bold;">
                            <i class="fas fa-lightbulb"></i> TONI'S TIPP: A5 BOOKLET-DRUCK (KLICKEN)
                        </span>
                    </div>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button class="tactic-btn" style="border-color: var(--neon-green);" onclick="window.SektorStadion.addPage()">
                        <i class="fas fa-plus"></i> SEITE
                    </button>
                    <button class="pro-btn-gold" style="box-shadow: 0 0 15px var(--accent-gold);" onclick="window.print()">
                        <i class="fas fa-file-pdf"></i> PRINT
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="magazine-viewport" style="display: flex; flex-direction: column; gap: 50px; align-items: center; padding-bottom: 100px;">
                
                <div class="mag-page" id="mag-p-cover">
                    <div class="mag-content cover-layout">
                        <div class="mag-club-logo" contenteditable="true">
                            <i class="fas fa-shield-halved" style="font-size: 4rem; color: var(--accent-gold);"></i>
                            <p>DEIN VEREIN</p>
                        </div>
                        <div class="mag-title-box">
                            <h1 contenteditable="true">MATCHDAY</h1>
                            <h3 contenteditable="true">OFFIZIELLES ARENA-MAGAZIN</h3>
                        </div>
                        <div class="mag-main-feature">
                            <h2 contenteditable="true">DER KAMPF UM DIE SPITZE</h2>
                            <p contenteditable="true">ANSTOSS: HEUTE | ELITE-COCKPIT POWERED</p>
                        </div>
                    </div>
                </div>

                ${this.dynamicPages.map((page, index) => `
                    <div class="mag-page" style="position: relative;">
                        <div style="position: absolute; right: 10px; top: 10px; display: flex; gap: 5px;" class="ignore-print">
                            <button class="tactic-btn" style="padding: 5px 10px; font-size: 0.6rem; background: var(--data-cyan); border:none; color:#000;" 
                                    onclick="window.SektorStadion.beamSnapshot(${index})" title="Taktik vom Board hier einfügen">
                                <i class="fas fa-camera"></i> BEAM
                            </button>
                            <button onclick="window.SektorStadion.removePage(${index})" 
                                    style="background: #ff3b30; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.6rem;"
                                    title="Seite löschen">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>

                        <div class="mag-content">
                            <div class="mag-section-title" contenteditable="true">${page.title}</div>
                            <div style="margin-top: 20px; color: #333;" contenteditable="true">
                                ${page.content}
                            </div>
                        </div>
                    </div>
                `).join('')}

                <div class="mag-page mag-back-cover">
                    <div class="mag-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                        <div class="toni-ad-container">
                            <i class="fas fa-microchip" style="font-size: 5rem; color: var(--neon-green); margin-bottom: 20px;"></i>
                            <h1 style="color: #fff; letter-spacing: 10px; margin: 0;">TONI 2.0</h1>
                            <p style="color: var(--accent-gold); font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">The AI Revolution</p>
                            <div style="margin: 40px auto; width: 60%; height: 2px; background: linear-gradient(90deg, transparent, var(--neon-green), transparent);"></div>
                            <p style="font-size: 1.2rem; color: #fff; font-style: italic;">"Weil Taktik kein Zufall ist."</p>
                        </div>
                    </div>
                </div>

            </div>
        `;
        content.innerHTML = html;
    }
};
