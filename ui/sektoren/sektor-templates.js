/**
 * TONI 2.0 - MATCHDAY MAGAZINE ENGINE ULTIMATE
 * 4-Seiten DIN A5 Profi-Layout (Cover, Editorial, Scouting/Kader, Partner)
 */
window.SektorTemplates = {
    magazineData: {
        clubName: "FC TONI 2.0",
        opponent: "FC Bayern München",
        matchDate: "08. Februar 2026",
        stadium: "Ginga Arena",
        coachName: "Björn",
        logoUrl: "https://via.placeholder.com/100/39FF14/000000?text=T2.0",
        editorial: "Heute zählen keine Ausreden. Wir haben den Gegner analysiert und sind bereit, unseren Ginga-Fußball auf den Platz zu bringen. Gemeinsam mit euch Fans im Rücken holen wir die Punkte!",
        scoutingReport: "Der Gegner agiert oft mit hohem Pressing. Wir müssen die Räume in der Tiefe nutzen und defensiv kompakt stehen. Fokus auf schnelles Umschaltspiel!",
        sponsors: [
            { id: 1, name: "Neon Energy", logo: "⚡" },
            { id: 2, name: "Global Logistics", logo: "📦" },
            { id: 3, name: "Björn's Taktik-Store", logo: "👔" }
        ]
    },

    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                
                <div class="no-print" style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; margin-bottom:30px; border:1px solid var(--neon-green);">
                    <h3 style="font-size:0.8rem; color:var(--neon-green); margin-bottom:15px; letter-spacing:2px;">STADIONHEFT PRO-EDITOR</h3>
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem;" onclick="SektorTemplates.editClubInfo()">BASIS-DATEN</button>
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem; background:var(--data-cyan); color:#000;" onclick="SektorTemplates.editTexts()">TEXTE BEARBEITEN</button>
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem; background:var(--accent-gold); color:#000;" onclick="SektorTemplates.addSponsor()">NEUER SPONSOR</button>
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem; background:#fff; color:#000;" onclick="window.print()">
                            <i class="fas fa-print"></i> HEFT DRUCKEN (4 SEITEN)
                        </button>
                    </div>
                </div>

                <div id="magazine-container" style="display: flex; flex-direction: column; gap: 40px; align-items: center;">
                    
                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative;">
                        <div style="border: 10px solid #000; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between; align-items:center;">
                            <div style="text-align:center;">
                                <div style="background:#000; color:var(--neon-green); padding:5px 20px; font-weight:900; letter-spacing:4px;">STADIONKURIER</div>
                                <img src="${this.magazineData.logoUrl}" style="width:130px; margin-top:30px; filter: grayscale(1);">
                            </div>
                            <div style="text-align:center;">
                                <h1 style="font-size:3.8rem; line-height:0.85; font-weight:900; margin:0;">${this.magazineData.clubName}</h1>
                                <div style="font-size:1.5rem; margin:15px 0; font-weight:bold; background:#000; color:#fff; display:inline-block; padding:5px 20px;">GEGEN</div>
                                <h2 style="font-size:2.2rem; text-transform:uppercase;">${this.magazineData.opponent}</h2>
                            </div>
                            <div style="text-align:center; width:100%; border-top:3px solid #000; padding-top:15px;">
                                <p style="font-weight:900; letter-spacing:1px;">${this.magazineData.matchDate.toUpperCase()}</p>
                                <p style="font-size:0.8rem; letter-spacing:2px;">${this.magazineData.stadium.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5);">
                        <h3 style="border-bottom:4px solid #000; padding-bottom:10px; font-size:1.6rem; font-weight:900;">DAS WORT ZUM SPIEL</h3>
                        <div style="margin-top:30px; display:flex; gap:20px; align-items:flex-start;">
                            <div style="width:60px; height:60px; background:#eee; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">👔</div>
                            <div>
                                <p style="font-size:1rem; line-height:1.6; font-style:italic;">"${this.magazineData.editorial}"</p>
                                <p style="margin-top:20px; font-weight:900; color:var(--accent-orange);">COACH ${this.magazineData.coachName.toUpperCase()}</p>
                            </div>
                        </div>
                        <div style="margin-top:50px; padding:20px; background:#f9f9f9; border-left:5px solid var(--neon-green);">
                            <h4 style="font-size:0.8rem; letter-spacing:1px; margin-bottom:10px;">AKTUELLE NEWS</h4>
                            <p style="font-size:0.75rem;">Willkommen zum heutigen Heimspiel! Wir begrüßen alle Fans und unsere Partner in der ${this.magazineData.stadium}.</p>
                        </div>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.6rem; color:#aaa;">Seite 2 | Editorial</div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5);">
                        <h3 style="border-bottom:4px solid #000; padding-bottom:10px; font-size:1.6rem; font-weight:900;">TONI'S TAKTIK-CHECK</h3>
                        <div style="background:#000; color:var(--neon-green); padding:15px; margin:20px 0; font-size:0.85rem; line-height:1.4;">
                            <b style="display:block; margin-bottom:5px; color:#fff;">GEGNER-ANALYSE:</b>
                            ${this.magazineData.scoutingReport}
                        </div>
                        
                        <h4 style="margin-top:30px; font-size:1.1rem; border-bottom:2px solid #eee; padding-bottom:5px;">VORAUSSICHTLICHE AUFSTELLUNG</h4>
                        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; margin-top:15px;">
                            ${players.map(p => `
                                <tr style="border-bottom:1px solid #eee;">
                                    <td style="padding:6px; font-weight:900;">${p.number || '10'}</td>
                                    <td style="padding:6px;">${p.name.toUpperCase()}</td>
                                    <td style="padding:6px; color:#666; font-size:0.7rem;">${p.pos || 'ZM'}</td>
                                    <td style="padding:6px; text-align:right;">${p.status === 'FIT' ? '✓' : '✕'}</td>
                                </tr>
                            `).join('')}
                        </table>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.6rem; color:#aaa;">Seite 3 | Taktik & Kader</div>
                    </div>

                    <div class="mag-page" style="background:#000; color:#fff; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); border: 12px solid var(--neon-green);">
                        <div style="text-align:center; margin-bottom:50px;">
                            <h3 style="color:var(--neon-green); font-size:1.8rem; letter-spacing:6px; font-weight:900;">PARTNER</h3>
                            <p style="font-size:0.6rem; color:var(--accent-gold); letter-spacing:3px;">STOLZE UNTERSTÜTZER DES ${this.magazineData.clubName}</p>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                            ${this.magazineData.sponsors.map(s => `
                                <div style="border: 1px solid rgba(57, 255, 20, 0.4); padding:20px; text-align:center; background:rgba(255,255,255,0.03);">
                                    <div style="font-size:3rem; margin-bottom:10px;">${s.logo}</div>
                                    <div style="font-size:0.85rem; font-weight:900; color:var(--neon-green);">${s.name.toUpperCase()}</div>
                                    <div style="font-size:0.5rem; color:#777; margin-top:5px;">REGIONALER PARTNER</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="position:absolute; bottom:20mm; left:0; width:100%; text-align:center;">
                            <img src="${this.magazineData.logoUrl}" style="width:60px; filter: invert(1) brightness(2); margin-bottom:15px;">
                            <p style="font-size:0.5rem; color:#555; letter-spacing:2px;">POWERED BY TONI 2.0 GINGA ENGINE</p>
                        </div>
                    </div>
                </div>
            </div>`;
    },

    editClubInfo: function() {
        const newClub = prompt("Vereinsname:", this.magazineData.clubName);
        const newOpp = prompt("Gegner:", this.magazineData.opponent);
        const newDate = prompt("Datum:", this.magazineData.matchDate);
        const newStad = prompt("Stadion:", this.magazineData.stadium);
        if(newClub) this.magazineData.clubName = newClub;
        if(newOpp) this.magazineData.opponent = newOpp;
        if(newDate) this.magazineData.matchDate = newDate;
        if(newStad) this.magazineData.stadium = newStad;
        this.render();
    },

    editTexts: function() {
        const newEdi = prompt("Editorial (Wort vom Coach):", this.magazineData.editorial);
        const newScout = prompt("Taktik-Check (Gegner-Analyse):", this.magazineData.scoutingReport);
        if(newEdi) this.magazineData.editorial = newEdi;
        if(newScout) this.magazineData.scoutingReport = newScout;
        this.render();
    },

    addSponsor: function() {
        const name = prompt("Name:");
        const emoji = prompt("Icon (Emoji):", "🏢");
        if(name) {
            this.magazineData.sponsors.push({ id: Date.now(), name: name, logo: emoji });
            this.render();
        }
    }
};
