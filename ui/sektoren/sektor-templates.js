/**
 * TONI 2.0 - MATCHDAY MAGAZINE ENGINE (PRO-EDITION)
 * Fokus: Dynamische Sponsoren-Einbindung & Toni 2.0 Branding.
 */
window.SektorTemplates = {
    render: function() {
        // Daten aus der Database ziehen
        const players = window.Database ? window.Database.players : [];
        const coach = window.coachInfo || { name: "Coach", verein: "Pro Club" };
        
        // Filter für die Zeitung (Logik von 14:00 Uhr)
        const starPlayer = players.find(p => p.isNewspaperStar) || players[0] || { name: "Toni Test", rat: 80, pac: 90 };
        const starters = players.filter(p => p.assignment === 'both').slice(0, 11);
        const bench = players.filter(p => p.assignment === 'match').slice(0, 7);
        
        // Sponsor des Star-Spielers finden
        const starSponsor = window.SponsorPool ? window.SponsorPool.find(s => s.id === starPlayer.sponsorId) : null;
        const boardImg = window.arena ? window.arena.canvas.toDataURL() : "";
 
        document.getElementById('active-content').innerHTML = `
            <style>
                @media print { .no-print { display: none !important; } }
                .magazine-container { background: #fff; color: #000; width: 210mm; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
                .page-break { page-break-after: always; }
            </style>

            <div style="padding:30px; animation: fadeIn 0.4s ease-out; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0; font-size:1.2rem;">MATCHDAY MAGAZINE</h2>
                        <p style="font-size:0.6rem; color:#888; text-transform:uppercase;">Status: Dynamisch generiert für ${coach.verein}</p>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="login-btn" onclick="SektorTemplates.render()" style="background: rgba(255,255,255,0.05); color: #fff;">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                        <button class="login-btn" onclick="window.print()" style="background: var(--accent-orange); color: #fff; font-weight:900;">
                            <i class="fas fa-print"></i> DRUCKEN (A4)
                        </button>
                    </div>
                </div>

                <div class="magazine-container">
                    
                    <div class="print-page page-break" style="height:297mm; padding:40px; position:relative; border: 15px solid #000; display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="text-align:left;">
                            <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: 5px; color: #666;">OFFICIAL PROGRAMME</div>
                            <h1 style="font-size: 5rem; font-weight: 900; margin: 10px 0; line-height: 0.85; letter-spacing: -3px; color:#000;">${coach.verein.toUpperCase()}</h1>
                        </div>

                        <div style="flex: 1; display: flex; flex-direction:column; align-items: center; justify-content: center; position:relative;">
                             <div style="position:absolute; top:0; left:0; background:#000; color:#fff; padding:10px 20px; font-weight:900; font-size:1.5rem;">TOP STAR</div>
                             ${starPlayer.img ? 
                                `<img src="${starPlayer.img}" style="width: 80%; border: 10px solid #000; filter: grayscale(1) contrast(1.2);">` : 
                                `<div style="width:300px; height:400px; background:#eee; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user-ninja" style="font-size:10rem; color:#ddd;"></i></div>`}
                             <div style="font-size: 4rem; font-weight: 900; margin-top: -20px; background: #000; color: #fff; padding: 0 30px; text-transform:uppercase;">${starPlayer.name.split(' ').pop()}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 10px solid #000; padding-top: 30px;">
                            <div>
                                <div style="font-size: 2rem; font-weight: 900; color:#000;">${starSponsor ? starSponsor.name.toUpperCase() : 'MAIN PARTNER'}</div>
                                <div style="font-size: 0.8rem; color: #555; font-weight: bold; letter-spacing: 2px;">MATCHDAY REPORT 2026</div>
                            </div>
                            <div style="text-align: center; border: 2px solid #000; padding: 10px;">
                                <div style="font-size: 0.7rem; font-weight: 900;">RATING</div>
                                <div style="font-size: 2rem; font-weight: 900; color: #000;">${starPlayer.rat}</div>
                            </div>
                        </div>
                    </div>

                    <div class="print-page page-break" style="min-height:297mm; padding:60px; background:#fff;">
                        <h2 style="font-size: 2.5rem; font-weight: 900; border-bottom: 8px solid #000; padding-bottom: 10px; margin-bottom: 40px; color:#000;">SQUAD ANALYSIS</h2>
                        
                        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 50px;">
                            <div>
                                <h3 style="background:#000; color:#fff; padding:12px 20px; font-weight: 900; margin-bottom: 20px;">STARTING XI</h3>
                                ${starters.map(p => `
                                    <div style="display:flex; align-items:center; border-bottom: 1px solid #eee; padding: 10px 0; color:#000;">
                                        <div style="font-size: 1.2rem; font-weight: 900; width: 40px;">${p.number}</div>
                                        <div style="flex: 1; font-weight: 900;">${p.name.toUpperCase()}</div>
                                        <div style="font-size: 0.7rem; font-weight: bold; color: #666;">${p.pos}</div>
                                    </div>
                                `).join('')}
                            </div>

                            <div>
                                <div style="background:#f5f5f5; padding:20px; border:2px solid #000; margin-bottom:30px; color:#000;">
                                    <h4 style="margin:0; font-size:0.7rem; letter-spacing:2px;">OFFICIAL PARTNER</h4>
                                    <div style="font-size:2.5rem; margin:10px 0;">${starSponsor ? starSponsor.logo : '🤝'}</div>
                                    <div style="font-weight:900;">${starSponsor ? starSponsor.name : 'VAKANT'}</div>
                                </div>

                                <div style="background: #000; color: #fff; padding: 25px; border-left: 8px solid var(--neon-green);">
                                    <div style="font-size: 0.6rem; letter-spacing: 3px; color: var(--neon-green); margin-bottom: 10px;">TONI AI ANALYSIS</div>
                                    <div style="font-size: 0.9rem; line-height: 1.4; font-style: italic;">
                                        "Der Fokus liegt heute auf ${starPlayer.name}. Seine Pace von ${starPlayer.pac} wird entscheidend sein."
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 150px; height: 100mm; background: #000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: #fff; padding: 40px;">
                             <div style="color: var(--neon-green); font-size: 3rem; font-weight: 900;">TONI 2.0</div>
                             <div style="letter-spacing: 5px; font-size: 0.8rem; margin-top: 10px;">THE FUTURE OF FOOTBALL MANAGEMENT</div>
                             <div style="margin-top: 30px; font-size: 0.6rem; color: #444;">&copy; 2026 ELITE COACHING SYSTEMS</div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
};
