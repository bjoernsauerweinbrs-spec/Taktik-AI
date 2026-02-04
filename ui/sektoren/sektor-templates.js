/**
 * TONI 2.0 - MATCHDAY MAGAZINE ENGINE PRO
 * DIN A5 Layout mit Cover, Kader und exklusiver Sponsoren-Rückseite
 */
window.SektorTemplates = {
    magazineData: {
        clubName: "FC TONI 2.0",
        opponent: "FC Bayern München",
        matchDate: "08. Februar 2026",
        stadium: "Ginga Arena",
        coachName: "Björn",
        logoUrl: "https://via.placeholder.com/100/39FF14/000000?text=T2.0",
        sponsors: [
            { id: 1, name: "Neon Energy", logo: "⚡", type: "Premium" },
            { id: 2, name: "Global Logistics", logo: "📦", type: "Gold" },
            { id: 3, name: "Björn's Taktik-Store", logo: "👔", type: "Premium" }
        ]
    },

    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                
                <div class="no-print" style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; margin-bottom:30px; border:1px solid var(--neon-green);">
                    <h3 style="font-size:0.8rem; color:var(--neon-green); margin-bottom:15px; letter-spacing:2px;">MAGAZIN EDITOR</h3>
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem;" onclick="SektorTemplates.editClubInfo()">DATEN ANPASSEN</button>
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem; background:var(--accent-gold); color:#000;" onclick="SektorTemplates.addSponsor()">NEUER SPONSOR</button>
                        <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem; background:#fff; color:#000;" onclick="window.print()">
                            <i class="fas fa-print"></i> HEFT DRUCKEN (DIN A5)
                        </button>
                    </div>
                </div>

                <div id="magazine-container" style="display: flex; flex-direction: column; gap: 40px; align-items: center;">
                    
                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative;">
                        <div style="border: 8px solid #000; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between; align-items:center;">
                            <div style="text-align:center;">
                                <div style="background:#000; color:var(--neon-green); padding:5px 20px; font-weight:900; letter-spacing:3px; margin-bottom:30px;">OFFIZIELLES STADIONMAGAZIN</div>
                                <img src="${this.magazineData.logoUrl}" style="width:120px; filter: grayscale(1);">
                            </div>
                            
                            <div style="text-align:center;">
                                <h1 style="font-size:3.5rem; line-height:0.9; font-weight:900; margin:20px 0;">${this.magazineData.clubName}</h1>
                                <div style="font-size:1.5rem; font-weight:bold; margin:10px 0;">VS.</div>
                                <h2 style="font-size:2rem; text-transform:uppercase; color:#444;">${this.magazineData.opponent}</h2>
                            </div>

                            <div style="text-align:center; width:100%;">
                                <p style="border-top:2px solid #000; border-bottom:2px solid #000; padding:10px 0; font-weight:bold; letter-spacing:1px;">
                                    ${this.magazineData.matchDate.toUpperCase()} | ${this.magazineData.stadium.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative;">
                        <h3 style="border-bottom:4px solid #000; padding-bottom:10px; font-size:1.8rem; font-weight:900;">UNSERE ELF</h3>
                        <p style="font-size:0.9rem; margin:10px 0; font-weight:bold; color:var(--accent-orange);">CHEF-COACH: ${this.magazineData.coachName.toUpperCase()}</p>
                        
                        <div style="margin-top:30px;">
                            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
                                <thead style="background:#f0f0f0;">
                                    <tr>
                                        <th style="padding:10px; text-align:left;">NR</th>
                                        <th style="padding:10px; text-align:left;">NAME</th>
                                        <th style="padding:10px; text-align:left;">POS</th>
                                        <th style="padding:10px; text-align:right;">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${players.map(p => `
                                        <tr style="border-bottom:1px solid #eee;">
                                            <td style="padding:8px; font-weight:bold;">${p.number || '10'}</td>
                                            <td style="padding:8px;">${p.name.toUpperCase()}</td>
                                            <td style="padding:8px; color:#666;">${p.pos || 'ZM'}</td>
                                            <td style="padding:8px; text-align:right; font-size:0.7rem;">${p.status === 'FIT' ? '✓' : '✕'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div style="position:absolute; bottom:15mm; left:20mm; font-size:0.6rem; color:#aaa;">Seite 2 | Kader-Analyse</div>
                    </div>

                    <div class="mag-page" style="background:#000; color:#fff; width:148mm; min-height:210mm; padding:20mm; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative; border: 10px solid var(--neon-green);">
                        <div style="text-align:center; margin-bottom:40px;">
                            <h3 style="color:var(--neon-green); font-size:1.5rem; letter-spacing:5px; font-weight:900;">PARTNER</h3>
                            <div style="height:2px; background:var(--neon-green); width:60px; margin:10px auto;"></div>
                        </div>

                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin-top:20px;">
                            ${this.magazineData.sponsors.map(s => `
                                <div style="border: 1px solid rgba(57, 255, 20, 0.3); padding:20px; text-align:center; background:rgba(255,255,255,0.05);">
                                    <div style="font-size:3rem; margin-bottom:10px;">${s.logo}</div>
                                    <div style="font-size:0.8rem; font-weight:900; letter-spacing:1px; color:var(--neon-green);">${s.name.toUpperCase()}</div>
                                    <div style="font-size:0.5rem; color:var(--accent-gold); margin-top:5px; letter-spacing:2px;">OFFICIAL PARTNER</div>
                                </div>
                            `).join('')}
                        </div>

                        <div style="position:absolute; bottom:20mm; left:0; width:100%; text-align:center;">
                            <p style="font-size:0.7rem; color:var(--text-dim); letter-spacing:2px;">DANKE FÜR DIE UNTERSTÜTZUNG</p>
                            <img src="${this.magazineData.logoUrl}" style="width:50px; margin-top:20px; filter: invert(1) brightness(2);">
                        </div>
                    </div>

                </div>
            </div>`;
    },

    editClubInfo: function() {
        const newClub = prompt("Vereinsname:", this.magazineData.clubName);
        const newOpp = prompt("Gegner:", this.magazineData.opponent);
        const newDate = prompt("Datum & Uhrzeit:", this.magazineData.matchDate);
        const newStadium = prompt("Stadionname:", this.magazineData.stadium);
        if(newClub) this.magazineData.clubName = newClub;
        if(newOpp) this.magazineData.opponent = newOpp;
        if(newDate) this.magazineData.matchDate = newDate;
        if(newStadium) this.magazineData.stadium = newStadium;
        this.render();
    },

    addSponsor: function() {
        const name = prompt("Name der Partnerfirma:");
        const emoji = prompt("Icon/Emoji für Sponsor (z.B. 🏢, 🚗, 🍕):", "🏢");
        if(name) {
            this.magazineData.sponsors.push({ 
                id: Date.now(), 
                name: name, 
                logo: emoji,
                type: "Partner"
            });
            this.render();
        }
    }
};
