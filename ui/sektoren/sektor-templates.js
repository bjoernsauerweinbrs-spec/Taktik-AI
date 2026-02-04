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
                    
                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative; overflow:hidden;">
                        <div style="border: 10px solid #000; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between; align-items:center;">
                            <div style="text-align:center;">
                                <div style="background:#000; color:var(--neon-green); padding:5px 25px; font-weight:900; letter-spacing:4px; font-size:1.2rem;">STADIONKURIER</div>
                                <img src="${this.magazineData.logoUrl}" style="width:130px; margin-top:30px; filter: grayscale(1);">
                            </div>
                            <div style="text-align:center;">
                                <h1 style="font-size:3.5rem; line-height:0.85; font-weight:900; margin:0; text-transform:uppercase;">${this.magazineData.clubName}</h1>
                                <div style="font-size:1.5rem; margin:15px 0; font-weight:bold; background:#000; color:#fff; display:inline-block; padding:5px 25px;">HEIMSPIEL GEGEN</div>
                                <h2 style="font-size:2.5rem; text-transform:uppercase; color:#333;">${this.magazineData.opponent}</h2>
                            </div>
                            <div style="text-align:center; width:100%; border-top:4px solid #000; padding-top:20px;">
                                <p style="font-weight:900; letter-spacing:1px; font-size:1.1rem;">${this.magazineData.matchDate.toUpperCase()}</p>
                                <p style="font-size:0.9rem; letter-spacing:3px; color:#555;">${this.magazineData.stadium.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative;">
                        <h3 style="border-bottom:5px solid #000; padding-bottom:10px; font-size:1.8rem; font-weight:900; letter-spacing:-1px;">VORWORT DES TRAINERS</h3>
                        <div style="margin-top:35px; display:flex; gap:25px; align-items:flex-start;">
                            <div style="width:70px; height:70px; background:#000; color:var(--neon-green); border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">⚽</div>
                            <div>
                                <p style="font-size:1.05rem; line-height:1.7; font-style:italic; color:#222;">"${this.magazineData.editorial}"</p>
                                <p style="margin-top:25px; font-weight:900; font-size:1.2rem; color:var(--accent-orange); text-transform:uppercase;">Coach ${this.magazineData.coachName}</p>
                            </div>
                        </div>
                        <div style="margin-top:50px; padding:25px; background:#f4f4f4; border-left:8px solid var(--neon-green);">
                            <h4 style="font-size:0.9rem; letter-spacing:2px; margin-bottom:12px; font-weight:900;">SPIELTAGS-UPDATE</h4>
                            <p style="font-size:0.85rem; line-height:1.5;">Wir begrüßen alle Gäste aus ${this.magazineData.opponent} und freuen uns auf ein faires, hochintensives Spiel in der ${this.magazineData.stadium}. Bleibt motiviert!</p>
                        </div>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.7rem; color:#888; font-weight:bold;">SEITE 2 | FC TONI 2.0 MEDIA</div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative;">
                        <h3 style="border-bottom:5px solid #000; padding-bottom:10px; font-size:1.8rem; font-weight:900; letter-spacing:-1px;">TONI'S TAKTIK-CHECK</h3>
                        <div style="background:#000; color:var(--neon-green); padding:20px; margin:25px 0; font-size:0.95rem; line-height:1.5; border-radius:5px;">
                            <b style="display:block; margin-bottom:8px; color:#fff; font-size:0.7rem; letter-spacing:2px;">ANALYSE-BERICHT:</b>
                            ${this.magazineData.scoutingReport}
                        </div>
                        
                        <h4 style="margin-top:35px; font-size:1.2rem; border-bottom:3px solid #eee; padding-bottom:8px; font-weight:900;">VORAUSSICHTLICHE AUFSTELLUNG</h4>
                        <table style="width:100%; border-collapse:collapse; font-size:0.95rem; margin-top:15px;">
                            <thead>
                                <tr style="background:#f0f0f0; border-bottom:2px solid #000;">
                                    <th style="padding:10px; text-align:left;">NR</th>
                                    <th style="padding:10px; text-align:left;">NAME</th>
                                    <th style="padding:10px; text-align:left;">POS</th>
                                    <th style="padding:10px; text-align:right;">STAT</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${players.map(p => `
                                    <tr style="border-bottom:1px solid #eee;">
                                        <td style="padding:8px; font-weight:900;">${p.number || '10'}</td>
                                        <td style="padding:8px; font-weight:bold;">${p.name.toUpperCase()}</td>
                                        <td style="padding:8px; color:#555; font-size:0.8rem;">${p.pos || 'ZM'}</td>
                                        <td style="padding:8px; text-align:right;">${p.status === 'FIT' ? '✓' : '✕'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.7rem; color:#888; font-weight:bold;">SEITE 3 | TAKTIK-DOSSIER</div>
                    </div>

                    <div class="mag-page" style="background:#000; color:#fff; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); border: 15px solid var(--neon-green); position:relative;">
                        <div style="text-align:center; margin-bottom:60px;">
                            <h3 style="color:var(--neon-green); font-size:2.2rem; letter-spacing:8px; font-weight:900;">PARTNER</h3>
                            <p style="font-size:0.7rem; color:var(--accent-gold); letter-spacing:4px; font-weight:bold; margin-top:10px;">GEMEINSAM ZUM ERFOLG</p>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                            ${this.magazineData.sponsors.map(s => `
                                <div style="border: 2px solid rgba(57, 255, 20, 0.4); padding:25px; text-align:center; background:rgba(255,255,255,0.05); border-radius:10px;">
                                    <div style="font-size:3.5rem; margin-bottom:15px;">${s.logo}</div>
                                    <div style="font-size:0.9rem; font-weight:900; color:var(--neon-green); letter-spacing:1px;">${s.name.toUpperCase()}</div>
                                    <div style="font-size:0.5rem; color:#aaa; margin-top:8px; letter-spacing:2px;">OFFIZIELLER PARTNER</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="position:absolute; bottom:25mm; left:0; width:100%; text-align:center;">
                            <img src="${this.magazineData.logoUrl}" style="width:70px; filter: invert(1) brightness(2); margin-bottom:20px;">
                            <p style="font-size:0.6rem; color:#666; letter-spacing:3px;">POWERED BY TONI 2.0 PERFORMANCE ENGINE</p>
                        </div>
                    </div>
                </div>
            </div>`;
    },

    editClubInfo: function() {
        const newClub = prompt("Vereinsname:", this.magazineData.clubName);
        const newOpp = prompt("Gegner:", this.magazineData.opponent);
        const newDate = prompt("Spieldatum:", this.magazineData.matchDate);
        const newStad = prompt("Stadion:", this.magazineData.stadium);
        if(newClub) this.magazineData.clubName = newClub;
        if(newOpp) this.magazineData.opponent = newOpp;
        if(newDate) this.magazineData.matchDate = newDate;
        if(newStad) this.magazineData.stadium = newStad;
        this.render();
    },

    editTexts: function() {
        const newEdi = prompt("Vorwort des Trainers:", this.magazineData.editorial);
        const newScout = prompt("Toni's Scouting-Analyse:", this.magazineData.scoutingReport);
        if(newEdi) this.magazineData.editorial = newEdi;
        if(newScout) this.magazineData.scoutingReport = newScout;
        this.render();
    },

    addSponsor: function() {
        const name = prompt("Name der Firma:");
        const emoji = prompt("Sponsoren-Icon (Emoji):", "🏢");
        if(name) {
            this.magazineData.sponsors.push({ id: Date.now(), name: name, logo: emoji });
            this.render();
        }
    }
};
