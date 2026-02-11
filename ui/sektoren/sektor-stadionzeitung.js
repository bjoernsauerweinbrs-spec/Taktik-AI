/**
 * TONI 2.0 - SEKTOR STADIONZEITUNG (ELITE PUB)
 * Fokus: Magazin-Layout (Eintracht-Style), A5-Heft-Druck, Full-Edit
 * Status: MASTER-SYNC 2026 - INITIAL RELEASE
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
        const topPlayer = window.Database.players.sort((a,b) => b.rat - a.rat)[0] || {name: "Musterstar", rat: 99};

        activeContent.innerHTML = `
            <style>
                @media print {
                    body * { visibility: hidden; }
                    #mag-print-area, #mag-print-area * { visibility: visible; }
                    #mag-print-area { position: absolute; left: 0; top: 0; width: 297mm; height: 210mm; background: #fff !important; color: #000 !important; }
                    .no-print { display: none !important; }
                }
                .mag-page { width: 148.5mm; height: 210mm; background: #0a0a0a; color: #fff; padding: 20px; box-sizing: border-box; position: relative; border-right: 1px solid #222; overflow: hidden; }
                .mag-header { font-family: 'Orbitron'; font-weight: 900; color: var(--neon-green); border-bottom: 2px solid var(--neon-green); padding-bottom: 10px; margin-bottom: 20px; font-size: 0.8rem; }
                .editable-text:hover { background: rgba(57, 255, 20, 0.1); cursor: text; border-radius: 4px; }
            </style>

            <div class="fadeIn" style="padding-bottom: 50px;">
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--accent-gold); font-family:'Orbitron'; margin:0;">STADIONZEITUNG EDITOR</h2>
                        <span style="color:#666; font-size:0.6rem;">A5 HEFT-MODUS (A4 QUERDRUCK)</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" onclick="window.print()">JETZT DRUCKEN (A4)</button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div id="mag-print-area" style="display: flex; width: 100%; max-width: 1200px; margin: 0 auto; box-shadow: 0 0 50px #000; background: #111;">
                    
                    <div class="mag-page" style="background: linear-gradient(180deg, rgba(0,0,0,0) 50%, #000 100%), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'); background-size: cover;">
                        <div class="mag-header" style="border:none; text-align:right;">AUSGABE 02/2026 | FC TONI 2.0</div>
                        
                        <div style="margin-top: 250px;">
                            <div style="background: var(--neon-green); color:#000; display:inline-block; padding: 5px 15px; font-family:'Orbitron'; font-weight:900; font-size:1.2rem; transform: skew(-10deg);">MATCHDAY</div>
                            <h1 class="editable-text" contenteditable="true" style="font-family:'Orbitron'; font-size:3rem; margin:10px 0; line-height:0.9; text-shadow: 2px 2px 10px #000;">${topPlayer.name.toUpperCase()}<br>IM FOKUS</h1>
                            <p class="editable-text" contenteditable="true" style="font-size:0.9rem; max-width:80%; line-height:1.4;">Warum unser Kapitän heute den Unterschied macht und wie wir das 4-4-2 System perfektionieren.</p>
                        </div>

                        <div style="position:absolute; bottom:30px; left:20px; right:20px; display:flex; justify-content:space-between; align-items:center; opacity:0.7;">
                            <div style="border:1px solid #fff; padding:5px; font-family:'Orbitron'; font-size:0.5rem;">[LOGO] NEON ENERGY</div>
                            <div style="border:1px solid #fff; padding:5px; font-family:'Orbitron'; font-size:0.5rem;">[LOGO] TITAN LEASING</div>
                        </div>
                    </div>

                    <div class="mag-page">
                        <div class="mag-header">DER KADER | ANALYSE</div>
                        
                        <h3 class="editable-text" contenteditable="true" style="font-family:'Orbitron'; font-size:1rem; color:var(--accent-gold);">STARTELF HEUTE</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:30px;">
                            ${window.Database.players.filter(p => p.onField).slice(0, 10).map(p => `
                                <div style="font-size:0.7rem; border-bottom:1px solid #222; padding:5px; display:flex; justify-content:space-between;">
                                    <span>${p.number}. ${p.name}</span>
                                    <span style="color:var(--neon-green)">${p.rat}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--neon-green);">
                            <h4 style="margin:0; font-size:0.7rem; font-family:'Orbitron';">TONIS KI-TIPP</h4>
                            <p class="editable-text" contenteditable="true" style="font-size:0.65rem; color:#aaa; line-height:1.4; margin-top:10px;">
                                "Die Biometrie-Daten zeigen eine 98%ige Fitness-Rate. Wir sollten über die Flügel agieren, da der Gegner dort Lücken im Umschaltspiel lässt."
                            </p>
                        </div>

                        <div style="margin-top: 40px; height: 120px; border: 1px dashed #444; display:flex; align-items:center; justify-content:center; flex-direction:column; text-align:center; background:rgba(255,255,255,0.02);">
                            <div style="font-family:'Orbitron'; font-size:0.8rem; color:#fff;">CYBER-INSURANCE 2026</div>
                            <div style="font-size:0.5rem; color:#666; text-transform:uppercase; margin-top:5px;">Sicher am Ball. Sicher im Leben.</div>
                            <div style="font-size:0.4rem; color:var(--neon-green); margin-top:10px;">OFFIZIELLER PARTNER DES FC TONI 2.0</div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
};
