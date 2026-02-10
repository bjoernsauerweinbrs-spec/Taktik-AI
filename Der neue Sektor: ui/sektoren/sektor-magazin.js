/**
 * TONI 2.0 - HIGH-GLOSS STADIONMAGAZIN
 * 6-Seiten Layout (Druckfertig A4)
 * Fokus: Editierbarkeit & Sponsoren-Integration
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
                .mag-page { 
                    width: 210mm; min-height: 297mm; background: #fff; color: #000; 
                    margin: 20px auto; padding: 15mm; box-shadow: 0 0 30px rgba(0,0,0,0.5);
                    position: relative; display: none; overflow: hidden;
                }
                .mag-page.active { display: block; animation: fadeIn 0.5s; }
                .mag-header { border-bottom: 8px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                .mag-title { font-family: 'Orbitron'; font-weight: 900; font-size: 3.5rem; line-height: 0.8; letter-spacing: -2px; }
                .editable { cursor: text; outline: none; transition: 0.2s; }
                .editable:hover { background: rgba(0, 209, 255, 0.05); }
                .ad-space { background: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #999; }
                
                @media print {
                    .no-print { display: none !important; }
                    .mag-page { display: block !important; margin: 0; box-shadow: none; page-break-after: always; }
                }
            </style>

            <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; background: rgba(255,255,255,0.03); padding: 15px 30px; border-bottom: 1px solid #333;">
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.SektorMagazin.changePage(-1)"><i class="fas fa-chevron-left"></i></button>
                    <span style="font-family:'Orbitron'; color:var(--data-cyan); line-height:35px;">SEITE ${this.currentPage} / 6</span>
                    <button class="tactic-btn" onclick="window.SektorMagazin.changePage(1)"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div>
                    <button class="pro-btn-gold" onclick="window.print()"><i class="fas fa-print"></i> MAG-EXPORT (PDF)</button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div id="magazine-viewport" style="height: 75vh; overflow-y: auto; padding-bottom: 100px;">
                <div class="mag-page ${this.currentPage === 1 ? 'active' : ''}" id="page-1">
                    <div style="position:absolute; top:0; left:0; width:100%; height:12px; background:var(--data-cyan);"></div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:20px;">
                        <div class="mag-title">MATCH<br><span style="color:var(--data-cyan);">DAY</span></div>
                        <div style="text-align:right;">
                            <div class="editable" contenteditable="true" style="font-weight:900; font-size:1.2rem;">${window.coachInfo?.verein || 'DEIN VEREIN'}</div>
                            <div class="editable" contenteditable="true" style="font-size:0.7rem; letter-spacing:3px;">AUSGABE #12 | FEBRUAR 2026</div>
                        </div>
                    </div>
                    
                    <div style="width:100%; height:450px; background:#e0e0e0; margin:30px 0; position:relative; overflow:hidden; border:1px solid #000;">
                        <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000" style="width:100%; height:100%; object-fit:cover; filter: grayscale(0.5);">
                        <div style="position:absolute; bottom:0; left:0; background:#000; color:#fff; padding:20px; width:70%;">
                            <h2 class="editable" contenteditable="true" style="font-family:'Orbitron'; font-size:1.8rem; margin:0;">DER GROSSE KADER-CHECK</h2>
                            <p class="editable" contenteditable="true" style="font-size:0.8rem; opacity:0.8;">Wie Coach ${window.coachInfo?.name || 'Toni'} das Team auf Kurs bringt.</p>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
                        <div class="editable" contenteditable="true" style="font-size:0.9rem; border-top:4px solid #000; padding-top:10px;">
                            <strong>HEUTE IM FOKUS:</strong><br>Der Weg zur Meisterschaft beginnt im Kopf. Toni 2.0 analysiert die Biometrie unserer Stars.
                        </div>
                        <div class="ad-space" style="height:100px;">HAUPTSPONSOR LOGO</div>
                    </div>
                </div>

                <div class="mag-page ${this.currentPage === 2 ? 'active' : ''}" id="page-2">
                    <h3 style="font-family:'Orbitron'; border-bottom:2px solid #000; padding-bottom:10px;">EDITORIAL / COACH REPORT</h3>
                    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px; margin-top:30px;">
                        <div>
                            <div style="width:100%; height:200px; background:#eee; border-radius:50%; margin-bottom:20px; overflow:hidden;">
                                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                            <em style="font-size:0.7rem;">Coach ${window.coachInfo?.name}</em>
                        </div>
                        <div class="editable" contenteditable="true" style="font-size:0.95rem; line-height:1.6; text-align:justify;">
                            <p><strong>Liebe Fans, liebe Partner,</strong></p>
                            Willkommen zur neuen Ausgabe unseres Stadionmagazins. Dank der Unterstützung von TONI 2.0 konnten wir in den letzten 14 Tagen die Trainingsintensität auf ein völlig neues Level heben. Die Daten lügen nicht: Wir sind fitter, schneller und taktisch disziplinierter als je zuvor.
                            <br><br>
                            Ich bin stolz auf die Entwicklung unserer Jugendkader. In diesem Magazin werfen wir einen speziellen Blick auf die G-Jugend, die uns mit ihrem Einsatz alle begeistert hat.
                        </div>
                    </div>
                </div>

                <div class="mag-page ${this.currentPage === 6 ? 'active' : ''}" id="page-6">
                    <div style="height:100%; border:10px solid #000; padding:40px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
                        <h1 style="font-family:'Orbitron'; font-size:3rem;">TONI 2.0</h1>
                        <h2 style="letter-spacing:5px; font-size:1rem; margin-top:-10px;">THE FUTURE OF FOOTBALL</h2>
                        <div style="width:80px; height:4px; background:var(--data-cyan); margin:30px 0;"></div>
                        <p style="max-width:400px; font-size:0.9rem; line-height:1.6;">
                            Dieses Magazin wurde erstellt mit der <strong>Toni 2.0 Biometric Engine</strong>. 
                            Verwalten Sie Ihren Verein, analysieren Sie Ihre Spieler und professionalisieren Sie Ihr Sponsoring.
                        </p>
                        <div style="margin-top:50px; display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%;">
                            <div class="ad-space" style="height:150px;">DEINE WERBUNG HIER</div>
                            <div class="ad-space" style="height:150px;">DEINE WERBUNG HIER</div>
                        </div>
                    </div>
                </div>

                ${this.renderPlaceholders()}

            </div>
        `;
    },

    renderPlaceholders() {
        return `
            <div class="mag-page ${this.currentPage === 3 ? 'active' : ''}" id="page-3"><h3 style="font-family:'Orbitron';">SEITE 3: KADER-CHECK</h3><p>Hier werden automatisch die FIFA-Cards deiner 1. Mannschaft gerendert.</p></div>
            <div class="mag-page ${this.currentPage === 4 ? 'active' : ''}" id="page-4"><h3 style="font-family:'Orbitron';">SEITE 4: ACADEMY FOCUS</h3><p>Sticker des Monats und Jugend-Bericht.</p></div>
            <div class="mag-page ${this.currentPage === 5 ? 'active' : ''}" id="page-5"><h3 style="font-family:'Orbitron';">SEITE 5: BUSINESS-TALK</h3><p>Partner-Interviews und Sponsorenvorstellung.</p></div>
        `;
    },

    changePage(delta) {
        this.currentPage += delta;
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > 6) this.currentPage = 6;
        this.render();
    }
};
