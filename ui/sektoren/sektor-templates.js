/**
 * TONI 2.0 - INTERNATIONAL MATCHDAY MAGAZINE ENGINE
 * Pro-Level DIN A5 Layout (Matchday Standard)
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
        customPages: []
    },

    render: function() {
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || {
            name: "FC TONI 2.0",
            coach: "Björn",
            stadium: "International Arena",
            logoUrl: "https://via.placeholder.com/100/000/fff?text=LOGO"
        };
        const starters = (JSON.parse(localStorage.getItem('toni_players')) || []).filter(p => p.isStarter);

        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out; height: 85vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; background:rgba(212,175,55,0.1); padding:20px; border-radius:15px; margin-bottom:30px; border:1px solid var(--accent-gold);">
                    <div>
                        <h2 style="color:var(--accent-gold); margin:0; letter-spacing:2px; font-size:1rem;">STADIONZEITUNG EDITOR</h2>
                        <p style="font-size:0.6rem; color:var(--text-dim);">DIN A5 MATCHDAY PROGRAMME GENERATOR</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="tactic-btn" onclick="SektorTemplates.editMatchInfo()">INFO</button>
                        <button class="tactic-btn" onclick="SektorTemplates.editTexts()">TEXTE</button>
                        <button class="login-btn" style="width:auto; padding:10px 20px; background:#fff; color:#000;" onclick="window.print()">
                            <i class="fas fa-print"></i> JETZT DRUCKEN
                        </button>
                    </div>
                </div>

                <div id="magazine-container" style="display: flex; flex-direction: column; gap: 40px; align-items: center; padding-bottom:50px;">
                    
                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:15mm; border: 10px solid #000; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 0 30px rgba(0,0,0,0.5);">
                        <div style="text-align:center;">
                            <div style="font-weight:900; letter-spacing:5px; font-size:0.8rem; border-bottom:4px solid #000; display:inline-block; padding-bottom:5px;">OFFICIAL PROGRAMME</div>
                            <br><img src="${config.logoUrl}" style="width:100px; margin:30px 0;">
                        </div>
                        <div>
                            <h1 style="font-size:3.5rem; line-height:0.8; font-weight:900; margin:0;">${config.name.toUpperCase()}</h1>
                            <div style="height:10px; width:80px; background:var(--neon-green); margin:15px 0;"></div>
                            <p style="font-size:1.2rem; font-weight:300; margin:0;">VERSUS</p>
                            <h2 style="font-size:2.5rem; font-weight:900; margin:0;">${this.magazineData.opponent.toUpperCase()}</h2>
                        </div>
                        <div style="border-top:2px solid #000; padding-top:15px; display:flex; justify-content:space-between; font-weight:900; font-size:0.75rem;">
                            <span>${this.magazineData.matchDate}</span>
                            <span>${config.stadium.toUpperCase()}</span>
                        </div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:20mm; position:relative; box-shadow: 0 0 30px rgba(0,0,0,0.5);">
                        <h3 style="font-size:1.8rem; font-weight:900; border-bottom:6px solid #000; padding-bottom:10px; margin-bottom:25px;">COACH'S COLUMN</h3>
                        <div style="font-size:1rem; line-height:1.6; color:#333; font-style:italic;">
                            <span style="font-size:4rem; float:left; line-height:0.6; margin:10px 10px 0 0; font-weight:900;">"</span>
                            ${this.magazineData.editorial}
                        </div>
                        <div style="margin-top:40px; border-left:4px solid var(--neon-green); padding-left:15px;">
                            <p style="font-weight:900; font-size:1.1rem; margin:0;">${config.coach.toUpperCase()}</p>
                            <p style="font-size:0.6rem; color:#888; letter-spacing:1px;">HEAD COACH | ${config.name}</p>
                        </div>
                        <div style="position:absolute; bottom:10mm; right:15mm; font-size:0.5rem; font-weight:900;">PAGE 02</div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; height:210mm; padding:20mm; position:relative; box-shadow: 0 0 30px rgba(0,0,0,0.5);">
                        <h3 style="font-size:1.8rem; font-weight:900; border-bottom:6px solid #000; padding-bottom:10px; margin-bottom:25px;">TODAY'S SQUAD</h3>
                        <div style="background:#f9f9f9; padding:15px; margin-bottom:25px; border:1px solid #eee;">
                            <h4 style="font-size:0.6rem; font-weight:900; color:var(--neon-green); margin-bottom:5px;">TACTICAL SCOUTING:</h4>
                            <p style="font-size:0.75rem; line-height:1.4;">${this.magazineData.scoutingReport}</p>
                        </div>
                        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                            <tr style="border-bottom:2px solid #000; font-weight:900;">
                                <th style="text-align:left; padding:8px 0;">NO.</th>
                                <th style="text-align:left; padding:8px 0;">PLAYER</th>
                                <th style="text-align:right; padding:8px 0;">POS</th>
                            </tr>
                            ${starters.length > 0 ? starters.map(p => `
                                <tr style="border-bottom:1px solid #eee;">
                                    <td style="padding:8px 0; font-weight:900;">${p.number}</td>
                                    <td style="padding:8px 0;">${p.name.toUpperCase()}</td>
                                    <td style="padding:8px 0; text-align:right;">${p.pos || 'ZM'}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="3" style="padding:20px; text-align:center;">Keine Startelf nominiert</td></tr>'}
                        </table>
                        <div style="position:absolute; bottom:10mm; right:15mm; font-size:0.5rem; font-weight:900;">PAGE 03</div>
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
        const edi = prompt("Grusswort des Trainers:", this.magazineData.editorial);
        const scout = prompt("Taktische Analyse (Toni-Style):", this.magazineData.scoutingReport);
        if(edi) this.magazineData.editorial = edi;
        if(scout) this.magazineData.scoutingReport = scout;
        this.render();
    }
};
