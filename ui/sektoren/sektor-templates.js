/**
 * TONI 2.0 - INTERNATIONAL MATCHDAY MAGAZINE ENGINE
 * Pro-Level DIN A5 Layout (Premier League Standard)
 * Dynamische Seitenverwaltung & Global Data Sync
 */
window.SektorTemplates = {
    magazineData: {
        opponent: "FC Bayern München",
        matchDate: "08. Februar 2026",
        editorial: "Heute verlangen wir von jedem Einzelnen absolute Professionalität. Wir haben den Gegner tiefenanalysiert. Taktische Disziplin und maximale Intensität sind der Schlüssel zum Erfolg.",
        scoutingReport: "Der Gegner agiert mit einer hohen defensiven Kette. Wir forcieren vertikale Bälle in die Halbräume. Defensiv steht die Kompaktheit an erster Stelle.",
        sponsors: [
            { id: 1, name: "Global Logistics", logo: "🌐" },
            { id: 2, name: "Tech Solutions", logo: "💻" }
        ],
        customPages: [] // Hier werden zusätzliche Seiten gespeichert
    },

    render: function() {
        // 1. Synchronisation mit Globaler Club-Konfiguration
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || {
            name: "FC TONI 2.0",
            coach: "Björn",
            stadium: "International Arena",
            logoUrl: "https://via.placeholder.com/100/000/fff?text=LOGO"
        };
        const starters = (JSON.parse(localStorage.getItem('toni_players')) || []).filter(p => p.isStarter);

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                
                <div class="no-print" style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; margin-bottom:40px; border:1px solid var(--data-cyan);">
                    <h3 style="font-size:0.7rem; color:var(--data-cyan); margin-bottom:15px; letter-spacing:2px; font-weight:900;">MATCHDAY PROGRAM EDITOR [PRO]</h3>
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.65rem; background:transparent; border:1px solid #fff;" onclick="SektorTemplates.editMatchInfo()">SPIELTAGS-INFOS</button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.65rem; background:transparent; border:1px solid #fff;" onclick="SektorTemplates.editTexts()">TEXTE ANALYSIEREN</button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.65rem; background:var(--neon-green); color:#000;" onclick="SektorTemplates.addCustomPage()">+ SEITE HINZUFÜGEN</button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.65rem; background:var(--accent-orange); color:#fff;" onclick="SektorTemplates.resetCustomPages()">SEITEN RESET</button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.65rem; background:#fff; color:#000;" onclick="window.print()">
                            <i class="fas fa-print"></i> DRUCKEN (DIN A5)
                        </button>
                    </div>
                </div>

                <div id="magazine-container" style="display: flex; flex-direction: column; gap: 50px; align-items: center;">
                    
                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:15mm; position:relative; border: 1px solid #eee;">
                        <div style="height:100%; border: 2px solid #000; display:flex; flex-direction:column; justify-content:space-between; padding:10mm;">
                            <div style="text-align:center;">
                                <div style="font-weight:900; letter-spacing:5px; font-size:0.8rem; border-bottom:4px solid #000; display:inline-block; padding-bottom:5px; margin-bottom:20px;">OFFICIAL MATCHDAY PROGRAMME</div>
                                <br><img src="${config.logoUrl}" style="width:80px; margin:20px 0;">
                            </div>
                            <div style="text-align:left;">
                                <h1 style="font-size:4rem; line-height:0.8; font-weight:900; margin:0; word-break:break-word;">${config.name.toUpperCase()}</h1>
                                <div style="height:15px; width:100px; background:var(--neon-green); margin:20px 0;"></div>
                                <p style="font-size:1.5rem; font-weight:300; margin:0;">VERSUS</p>
                                <h2 style="font-size:2.5rem; font-weight:900; margin:0;">${this.magazineData.opponent.toUpperCase()}</h2>
                            </div>
                            <div style="border-top:1px solid #000; padding-top:20px; display:flex; justify-content:space-between; font-weight:900; font-size:0.8rem;">
                                <span>${this.magazineData.matchDate}</span>
                                <span>${config.stadium.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:20mm; position:relative; border: 1px solid #eee;">
                        <h3 style="font-size:2rem; font-weight:900; border-bottom:8px solid #000; padding-bottom:10px; margin-bottom:30px;">THE MANAGER</h3>
                        <div style="font-size:1.1rem; line-height:1.6; color:#333; font-weight:400;">
                            <span style="font-size:4rem; float:left; line-height:0.8; margin-right:10px; font-weight:900;">"</span>
                            ${this.magazineData.editorial}
                        </div>
                        <div style="margin-top:40px;">
                            <p style="font-weight:900; font-size:1.2rem;">${config.coach.toUpperCase()}</p>
                            <p style="font-size:0.7rem; color:#888; letter-spacing:2px;">HEAD COACH | ${config.name}</p>
                        </div>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.6rem; font-weight:900; color:#ccc;">02 | MATCHDAY ANALYSIS</div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:20mm; position:relative; border: 1px solid #eee;">
                        <h3 style="font-size:2rem; font-weight:900; border-bottom:8px solid #000; padding-bottom:10px; margin-bottom:30px;">SQUAD LIST</h3>
                        <div style="background:#f4f4f4; padding:15px; margin-bottom:30px; border-left:5px solid var(--neon-green);">
                            <h4 style="font-size:0.7rem; font-weight:900; margin-bottom:5px;">TONI'S TACTICAL NOTE:</h4>
                            <p style="font-size:0.8rem; line-height:1.4;">${this.magazineData.scoutingReport}</p>
                        </div>
                        <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
                            <tr style="border-bottom:2px solid #000; font-weight:900; font-size:0.7rem;">
                                <th style="text-align:left; padding:10px 0;">NO.</th>
                                <th style="text-align:left; padding:10px 0;">PLAYER</th>
                                <th style="text-align:right; padding:10px 0;">POS</th>
                            </tr>
                            ${starters.map(p => `
                                <tr style="border-bottom:1px solid #eee;">
                                    <td style="padding:10px 0; font-weight:900;">${p.number}</td>
                                    <td style="padding:10px 0;">${p.name.toUpperCase()}</td>
                                    <td style="padding:10px 0; text-align:right; font-weight:300;">${p.pos}</td>
                                </tr>
                            `).join('')}
                        </table>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.6rem; font-weight:900; color:#ccc;">03 | OFFICIAL LINE-UP</div>
                    </div>

                    ${this.magazineData.customPages.map((page, index) => `
                        <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:20mm; position:relative; border: 1px solid #eee;">
                            <div class="no-print" style="position:absolute; top:10px; right:10px;">
                                <button onclick="SektorTemplates.removePage(${index})" style="background:red; color:#fff; border:none; border-radius:3px; padding:2px 10px; cursor:pointer;">LÖSCHEN</button>
                            </div>
                            <h3 style="font-size:2rem; font-weight:900; border-bottom:8px solid #000; padding-bottom:10px; margin-bottom:30px;">${page.title.toUpperCase()}</h3>
                            <div style="font-size:1rem; line-height:1.6;">${page.content}</div>
                            <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.6rem; font-weight:900; color:#ccc;">0${index + 4} | CUSTOM CONTENT</div>
                        </div>
                    `).join('')}

                    <div class="mag-page" style="background:#000; color:#fff; width:148mm; height:210mm; padding:20mm; position:relative; text-align:center;">
                        <h3 style="font-size:1.5rem; font-weight:900; letter-spacing:5px; margin-bottom:50px;">OFFICIAL PARTNERS</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            ${this.magazineData.sponsors.map(s => `
                                <div style="border: 1px solid #333; padding:20px; background:#111;">
                                    <div style="font-size:2rem; margin-bottom:10px;">${s.logo}</div>
                                    <div style="font-size:0.7rem; font-weight:900; letter-spacing:1px;">${s.name.toUpperCase()}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="position:absolute; bottom:20mm; left:0; width:100%;">
                            <img src="${config.logoUrl}" style="width:50px; filter: invert(1); margin-bottom:10px;">
                            <p style="font-size:0.5rem; letter-spacing:3px; color:#444;">ENGINEERED BY TONI 2.0 PERFORMANCE SYSTEM</p>
                        </div>
                    </div>

                </div>
            </div>`;
    },

    editMatchInfo: function() {
        const opp = prompt("Gegnerischer Verein:", this.magazineData.opponent);
        const date = prompt("Spieldatum & Uhrzeit:", this.magazineData.matchDate);
        if(opp) this.magazineData.opponent = opp;
        if(date) this.magazineData.matchDate = date;
        this.render();
    },

    editTexts: function() {
        const edi = prompt("Manager Editorial:", this.magazineData.editorial);
        const scout = prompt("Taktische Analyse:", this.magazineData.scoutingReport);
        if(edi) this.magazineData.editorial = edi;
        if(scout) this.magazineData.scoutingReport = scout;
        this.render();
    },

    addCustomPage: function() {
        const title = prompt("Titel der neuen Seite:");
        const content = prompt("Inhalt (Text):");
        if(title && content) {
            this.magazineData.customPages.push({ title, content });
            this.render();
        }
    },

    removePage: function(index) {
        if(confirm("Diese Seite wirklich entfernen?")) {
            this.magazineData.customPages.splice(index, 1);
            this.render();
        }
    },

    resetCustomPages: function() {
        if(confirm("Alle zusätzlichen Seiten löschen?")) {
            this.magazineData.customPages = [];
            this.render();
        }
    }
};
