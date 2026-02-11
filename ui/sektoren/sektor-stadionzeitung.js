/**
 * TONI 2.0 - SEKTOR STADIONZEITUNG (ELITE PUB - 4 SEITEN EDITION)
 * Fokus: Magazin-Layout, A5-Heft (Doppelbogen), Full-Edit
 * Status: MASTER-SYNC 2026 - FULL 4-PAGE SPREAD COMPLETED
 */
window.SektorStadionzeitung = {
    
    open() {
        const activeContent = document.getElementById('active-content');
        if (!activeContent) return;
        this.render();
    },

    render() {
        const activeContent = document.getElementById('active-content');
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database.players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));
        const topPlayer = players.sort((a,b) => b.rat - a.rat)[0] || {name: "Musterstar", rat: 99};

        activeContent.innerHTML = `
            <style>
                @media print {
                    @page { size: A4 landscape; margin: 0; }
                    body * { visibility: hidden; }
                    #mag-print-area, #mag-print-area * { visibility: visible; }
                    #mag-print-area { position: absolute; left: 0; top: 0; width: 297mm; height: 210mm; background: #fff !important; }
                    .mag-page { border: none !important; }
                    .no-print { display: none !important; }
                }
                .mag-container { display: flex; flex-direction: column; gap: 40px; align-items: center; padding-bottom: 100px; }
                .mag-spread { display: flex; width: 297mm; height: 210mm; background: #111; box-shadow: 0 0 50px #000; overflow: hidden; }
                .mag-page { width: 148.5mm; height: 210mm; background: #0a0a0a; color: #fff; padding: 25px; box-sizing: border-box; position: relative; border-right: 1px solid #222; }
                .mag-header { font-family: 'Orbitron'; font-weight: 900; color: var(--neon-green); border-bottom: 2px solid var(--neon-green); padding-bottom: 10px; margin-bottom: 20px; font-size: 0.7rem; display: flex; justify-content: space-between; }
                .editable-text:hover { background: rgba(57, 255, 20, 0.1); cursor: text; border-radius: 4px; outline: none; }
                .sponsor-box { border: 1px dashed #444; padding: 15px; text-align: center; background: rgba(255,255,255,0.02); }
            </style>

            <div class="fadeIn mag-container">
                
                <div class="no-print" style="width: 100%; max-width: 1100px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--accent-gold); font-family:'Orbitron'; margin:0;">MAGAZIN EDITOR: ${team.toUpperCase()}</h2>
                        <span style="color:#666; font-size:0.6rem;">DRUCK-MODUS: A4 QUER (ERGEBNIS A5 HEFT)</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" onclick="window.print()">STADIONZEITUNG DRUCKEN</button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.backToNav()">ZENTRALE</button>
                    </div>
                </div>

                <div id="mag-print-area" class="mag-spread">
                    
                    <div class="mag-page" style="background: #050505; display: flex; flex-direction: column; justify-content: center;">
                        <div class="mag-header" style="position:absolute; top:25px; left:25px; right:25px; border:none;">BACKPAGE | FC TONI 2.0</div>
                        
                        <div class="sponsor-box" style="height: 70%; display: flex; flex-direction: column; justify-content: center; border: 2px solid var(--accent-gold);">
                            <div style="font-family:'Orbitron'; font-size: 2rem; color: var(--accent-gold);">TITAN<br>LEASING</div>
                            <div style="font-size: 0.8rem; letter-spacing: 4px; margin-top: 20px;">PREMIUM PARTNER</div>
                            <p style="font-size: 0.6rem; color: #666; margin-top: 30px; line-height: 1.6;">
                                Exklusive Fuhrpark-Lösungen für Profis.<br>
                                www.titan-leasing.de/toni20
                            </p>
                        </div>
                        
                        <div style="margin-top: 40px; text-align: center; font-size: 0.5rem; color: #444; font-family: 'Orbitron';">
                            HERAUSGEGEBEN VON KI-COACH TONI 2.0 | SYSTEM-VERSION 2026
                        </div>
                    </div>

                    <div class="mag-page" style="background: linear-gradient(180deg, rgba(0,0,0,0) 40%, #000 100%), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'); background-size: cover;">
                        <div class="mag-header" style="border:none; text-align:right; display:block;">AUSGABE FEB 2026</div>
                        <div style="margin-top: 280px;">
                            <div style="background: var(--neon-green); color:#000; display:inline-block; padding: 5px 15px; font-family:'Orbitron'; font-weight:900; transform: skew(-10deg);">MATCHDAY</div>
                            <h1 class="editable-text" contenteditable="true" style="font-family:'Orbitron'; font-size:2.8rem; margin:10px 0; line-height:0.9;">${topPlayer.name.toUpperCase()}</h1>
                            <p class="editable-text" contenteditable="true" style="font-size:0.8rem; color: var(--neon-green); font-family:'Orbitron';">DIE ELITE-ANALYSE ZUM HEUTIGEN SPIEL</p>
                        </div>
                    </div>
                </div>

                <div class="mag-spread" style="margin-top: 20px;">
                    
                    <div class="mag-page">
                        <div class="mag-header"><span>02</span><span>INTERN</span></div>
                        <h2 style="font-family:'Orbitron'; font-size:1.2rem; color:var(--accent-gold);">KADER-NEWS</h2>
                        <div style="margin-top: 20px;">
                            ${players.slice(0, 8).map(p => `
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #222; padding: 8px 0; font-size: 0.7rem;">
                                    <span>#${p.number} ${p.name}</span>
                                    <span style="color:var(--neon-green)">${p.rat} OVR</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="editable-text" contenteditable="true" style="margin-top: 25px; font-size: 0.7rem; line-height: 1.6; color: #aaa;">
                            Hier klicken für aktuelle Trainingsberichte: Das Team zeigt eine hervorragende Moral. Besonders die Belastungssteuerung im Bereich VO2 Max trägt erste Früchte.
                        </div>
                    </div>

                    <div class="mag-page">
                        <div class="mag-header"><span>03</span><span>TAKTIC-HUB</span></div>
                        <div style="width: 100%; height: 180px; background: #050505; border: 1px solid #333; position: relative; margin-bottom: 20px; border-radius: 5px;">
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:80%; height:1px; background:rgba(57,255,20,0.2);"></div>
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:60px; height:60px; border:1px solid rgba(57,255,20,0.2); border-radius:50%;"></div>
                            <div style="text-align:center; padding-top: 80px; font-family:'Orbitron'; font-size:0.5rem; color:var(--neon-green);">FORMATION: 4-4-2 ACTIVE</div>
                        </div>
                        <h4 style="font-family:'Orbitron'; font-size:0.7rem; margin-bottom:10px;">TRAINER-NOTIZEN</h4>
                        <div class="editable-text" contenteditable="true" style="font-size: 0.65rem; line-height: 1.5; color: #ccc;">
                            Gegen den heutigen Gegner setzen wir auf schnelles Umschaltspiel. Die Flügelspieler müssen bei Ballgewinn sofort tief gehen. Defensiv kompakt stehen und Pressing-Signale beachten.
                        </div>
                        <div style="position:absolute; bottom:25px; left:25px; right:25px;" class="sponsor-box">
                            <div style="font-size: 0.5rem; font-family:'Orbitron'; color:var(--data-cyan);">NEON ENERGY | POWER FÜR 90 MINUTEN</div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }
};
