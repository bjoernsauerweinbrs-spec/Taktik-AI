/**
 * TONI 2.0 - HIGH-GLOSS STADIONMAGAZIN (ELITE EDITION)
 * 6-Seiten Layout (Druckfertig A4)
 * Fokus: Dynamischer Kader-Check, Editierbarkeit & TONI 2.0 Branding
 */
window.SektorMagazin = {
    currentPage: 1,

    open() {
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        content.innerHTML = `
            <style>
                /* Magazin-Basis */
                .mag-page { 
                    width: 210mm; min-height: 297mm; background: #fff; color: #000; 
                    margin: 20px auto; padding: 20mm; box-shadow: 0 0 50px rgba(0,0,0,0.4);
                    position: relative; display: none; overflow: hidden; font-family: 'Inter', sans-serif;
                }
                .mag-page.active { display: block; animation: fadeIn 0.4s ease-out; }
                
                /* Typografie & Branding */
                .mag-h1 { font-family: 'Orbitron'; font-weight: 900; font-size: 4rem; letter-spacing: -3px; line-height: 0.8; margin: 0; }
                .mag-h2 { font-family: 'Orbitron'; font-weight: 800; font-size: 1.8rem; border-left: 6px solid var(--data-cyan); padding-left: 20px; margin-bottom: 25px; }
                .mag-sub { font-family: 'Orbitron'; font-size: 0.7rem; letter-spacing: 4px; color: #666; text-transform: uppercase; }
                
                .editable { cursor: text; outline: none; transition: background 0.2s; }
                .editable:focus { background: rgba(0, 209, 255, 0.05); border-radius: 4px; }

                /* Kader-Komponenten */
                .player-list-item { display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 12px 0; }
                .player-num { font-family: 'Orbitron'; font-weight: 900; font-size: 1.2rem; color: var(--data-cyan); width: 45px; }
                .player-info { flex: 1; }
                .player-name { font-weight: 800; font-size: 1rem; text-transform: uppercase; }
                .player-meta { font-size: 0.7rem; color: #888; margin-top: 2px; }
                .stat-bar-outer { height: 4px; background: #f0f0f0; border-radius: 2px; margin-top: 6px; width: 100%; overflow: hidden; }
                .stat-bar-fill { height: 100%; background: #000; }

                .ad-placeholder { background: #f9f9f9; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #bbb; font-family: 'Orbitron'; font-size: 0.6rem; }

                @media print {
                    .no-print { display: none !important; }
                    body { background: #fff !important; }
                    .mag-page { display: block !important; margin: 0; box-shadow: none; page-break-after: always; }
                }
            </style>

            <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; background: rgba(0,0,0,0.85); padding: 15px 30px; border-bottom: 1px solid #333; position: sticky; top: 0; z-index: 9999;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <button class="tactic-btn" onclick="window.SektorMagazin.changePage(-1)"><i class="fas fa-chevron-left"></i></button>
                    <span style="font-family:'Orbitron'; color:var(--data-cyan); font-size: 0.8rem; letter-spacing: 2px;">SEITE ${this.currentPage} / 6</span>
                    <button class="tactic-btn" onclick="window.SektorMagazin.changePage(1)"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div style="display:flex; gap:12px;">
                    <button class="pro-btn-gold" onclick="window.print()"><i class="fas fa-file-pdf"></i> MAG-EXPORT</button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div id="magazine-viewport">
                ${this.renderActivePage()}
            </div>
        `;
    },

    renderActivePage() {
        switch(this.currentPage) {
            case 1: return this.renderPage1(); // Cover
            case 2: return this.renderPage2(); // Editorial
            case 3: return this.renderPage3(); // Kader-Check (Dynamisch)
            case 4: return this.renderPage4(); // Academy
            case 5: return this.renderPage5(); // Business
            case 6: return this.renderPage6(); // Backcover
            default: return this.renderPage1();
        }
    },

    /** SEITE 1: COVER **/
    renderPage1() {
        return `
            <div class="mag-page active">
                <div style="position:absolute; top:0; left:0; width:100%; height:15px; background:#000;"></div>
                <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                    <h1 class="mag-h1">MATCH<br><span style="color:var(--data-cyan);">DAY</span></h1>
                    <div style="text-align:right;">
                        <div class="editable mag-sub" contenteditable="true" style="font-weight:900; font-size:1.1rem; color:#000; letter-spacing:1px;">${window.coachInfo?.verein || 'DEIN VEREIN'}</div>
                        <div class="editable" contenteditable="true" style="font-size:0.6rem; color:#999; letter-spacing:3px; margin-top:5px;">SAISON 2026 | AUSGABE #12</div>
                    </div>
                </div>

                <div style="margin: 45px 0; height: 520px; background: #eee; border: 1px solid #000; position: relative; overflow: hidden;">
                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000" style="width:100%; height:100%; object-fit:cover;">
                    <div style="position:absolute; bottom:0; left:0; width:100%; background: linear-gradient(transparent, #000); padding: 50px 30px; color:#fff;">
                        <h2 class="editable" contenteditable="true" style="font-family:'Orbitron'; font-size: 2.5rem; margin:0; line-height:1;">MISSION: TITELKAMPF</h2>
                        <p class="editable" contenteditable="true" style="opacity:0.8; max-width: 450px; font-size:0.9rem; margin-top:15px;">
                            Exklusive Einblicke: Wie Coach ${window.coachInfo?.name || 'Toni'} mit biometrischer Präzision und der Toni 2.0 Engine den Erfolg plant.
                        </p>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:50px; border-top: 1px solid #000; padding-top:30px;">
                    <div class="editable" contenteditable="true" style="font-size:0.95rem; line-height:1.6; text-align:justify;">
                        <strong>DER FOKUS:</strong> In dieser Ausgabe analysieren wir die Kader-Tiefe und die neuen Sponsoren-Strukturen. Erfahren Sie, warum Daten die neue Währung im modernen Fußball sind.
                    </div>
                    <div class="ad-placeholder" style="height:120px; border: 1px solid #eee;">[ HAUPTSPONSOR LOGO ]</div>
                </div>
                <div style="position:absolute; bottom:15mm; right:20mm; font-family:'Orbitron'; font-size:0.5rem; color:#ccc;">POWERED BY TONI 2.0 SYSTEMS</div>
            </div>
        `;
    },

    /** SEITE 3: DYNAMISCHER KADER-CHECK **/
    renderPage3() {
        const team = window.currentTeamContext || "Senioren";
        const players = (window.Database?.players || []).filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));

        return `
            <div class="mag-page active">
                <h2 class="mag-h2">UNSER KADER: ${team.toUpperCase()}</h2>
                <p class="editable" contenteditable="true" style="font-size:0.9rem; color:#555; margin-bottom: 40px; line-height:1.6;">
                    Die aktuelle biometrische Verfassung unserer Einheiten. Der Performance-Index basiert auf den Live-Daten der TONI 2.0 Engine vom ${new Date().toLocaleDateString('de-DE')}.
                </p>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px 40px;">
                    ${players.length > 0 ? players.map(p => `
                        <div class="player-list-item">
                            <div class="player-num">${p.number || '0'}</div>
                            <div class="player-info">
                                <div class="player-name">${p.name}</div>
                                <div class="player-meta">${p.pos} | PERFORMANCE RATING: ${p.rat}</div>
                                <div class="stat-bar-outer">
                                    <div class="stat-bar-fill" style="width: ${p.rat}%;"></div>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p style="grid-column: 1/-1; opacity:0.3; text-align:center; padding:50px;">Keine Kaderdaten für diesen Sektor im System gefunden.</p>'}
                </div>

                <div style="margin-top: 60px; background: #f9f9f9; padding: 30px; border-left: 10px solid #000;">
                    <h4 style="font-family:'Orbitron'; font-size:0.7rem; margin-bottom:10px;">ANALYSE-KOMMENTAR</h4>
                    <p class="editable" contenteditable="true" style="font-size:0.85rem; font-style:italic; line-height:1.5; color:#444;">
                        "Die Varianz innerhalb der Gruppe zeigt ein stabiles Wachstumspotenzial. Besonders in den Bereichen PAC und DRI verzeichnen wir durch das neue Academy-Programm signifikante Steigerungen bei den Key-Playern."
                    </p>
                </div>
            </div>
        `;
    },

    /** SEITE 6: BACKCOVER (TONI 2.0 WERBUNG) **/
    renderPage6() {
        return `
            <div class="mag-page active" style="background:#000; color:#fff; border: 20px solid #000;">
                <div style="height:100%; border: 1px solid rgba(255,255,255,0.2); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:50px;">
                    <div style="font-family:'Orbitron'; font-size: 4rem; font-weight:900; letter-spacing:-2px;">TONI 2.0</div>
                    <div class="mag-sub" style="color:var(--data-cyan); margin-top:-10px;">Tactical Online Network Intelligence</div>
                    
                    <div style="width:120px; height:2px; background:var(--data-cyan); margin:40px 0;"></div>
                    
                    <h3 style="font-family:'Orbitron'; font-size: 1.2rem; letter-spacing:2px; margin-bottom:20px;">DIE ZUKUNFT DES FUSSBALLS</h3>
                    
                    <p style="max-width:480px; font-size:0.95rem; line-height:1.8; font-weight:300; opacity:0.8;">
                        Revolutionieren Sie Ihr Coaching. Von der biometrischen Echtzeit-Analyse bis zum automatisierten Matchday-Branding. Toni 2.0 ist das operative Gehirn für moderne Vereine und ambitionierte Manager.
                    </p>

                    <div style="margin-top:70px; display:grid; grid-template-columns: 1fr 1fr; gap:25px; width:100%;">
                        <div class="ad-placeholder" style="height:180px; background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.2);">PLATIN PARTNER</div>
                        <div class="ad-placeholder" style="height:180px; background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.2);">OFFIZIELLE WERBUNG</div>
                    </div>

                    <div style="margin-top:auto; font-size:0.55rem; opacity:0.4; font-family:'Orbitron'; letter-spacing:2px;">
                        © 2026 TONI SYSTEMS | LICENSED FOR ${window.coachInfo?.verein?.toUpperCase() || 'PRO CLUB'}
                    </div>
                </div>
            </div>
        `;
    },

    // Die restlichen Seiten (2, 4, 5) folgen demselben Muster wie oben
    renderPage2() { return `<div class="mag-page active"><h2 class="mag-h2">EDITORIAL</h2><div class="editable" contenteditable="true">Hier dein Vorwort einfügen...</div></div>`; },
    renderPage4() { return `<div class="mag-page active"><h2 class="mag-h2">ACADEMY FOCUS</h2><div class="editable" contenteditable="true">Berichte aus der Jugend...</div></div>`; },
    renderPage5() { return `<div class="mag-page active"><h2 class="mag-h2">BUSINESS & SPONSORS</h2><div class="editable" contenteditable="true">Partnervorstellungen...</div></div>`; },

    changePage(delta) {
        this.currentPage += delta;
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > 6) this.currentPage = 6;
        this.render();
    }
};
