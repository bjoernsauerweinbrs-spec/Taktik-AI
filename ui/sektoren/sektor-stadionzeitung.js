/**
 * TONI 2.0 - SEKTOR STADIONZEITUNG (ELITE PUB - 4 SEITEN LOGO EDITION)
 * Fokus: Magazin-Layout, A5-Heft, Live-Daten-Sync & Druck-Optimierung
 * Status: ETAPPE 4 - REDAKTION VERSIEGELT
 */
window.SektorStadionzeitung = {
    logoUrl: "https://r.jina.ai/i/442578508f7546688753235b0d01d418",
    
    open() {
        const activeContent = document.getElementById('active-content');
        if (!activeContent) return;
        this.render();
    },

    render() {
        const activeContent = document.getElementById('active-content');
        const team = window.currentTeamContext || "Senioren";
        
        // Live-Daten Abgleich: Wer ist der Star des Tages?
        const players = (window.Database && window.Database.players) 
            ? window.Database.players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team))
            : [];
        
        const topPlayer = players.length > 0 
            ? [...players].sort((a,b) => b.rat - a.rat)[0] 
            : {name: "Musterstar", rat: 99, number: 10};

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
                .mag-container { display: flex; flex-direction: column; gap: 40px; align-items: center; padding-bottom: 50px; }
                .mag-spread { display: flex; width: 297mm; height: 210mm; background: #111; box-shadow: 0 0 50px #000; overflow: hidden; border: 1px solid #333; }
                .mag-page { width: 148.5mm; height: 210mm; background: #0a0a0a; color: #fff; padding: 25px; box-sizing: border-box; position: relative; border-right: 1px solid #222; overflow: hidden; }
                .mag-header { font-family: 'Orbitron'; font-weight: 900; color: #39FF14; border-bottom: 2px solid #39FF14; padding-bottom: 10px; margin-bottom: 20px; font-size: 0.7rem; display: flex; justify-content: space-between; align-items: center; }
                .editable-text:hover { background: rgba(57, 255, 20, 0.1); cursor: text; border-radius: 4px; outline: none; }
                .sponsor-box { border: 1px dashed #444; padding: 15px; text-align: center; background: rgba(255,255,255,0.02); }
                .club-logo-small { height: 35px; filter: drop-shadow(0 0 5px #39FF14); }
                .club-logo-large { width: 120px; filter: drop-shadow(0 0 15px #39FF14); margin-bottom: 20px; }
            </style>

            <div class="fadeIn mag-container">
                <div class="no-print" style="width: 100%; max-width: 1100px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--accent-gold); font-family:'Orbitron'; margin:0;">STADIONZEITUNG: ${team.toUpperCase()}</h2>
                        <span style="color:#666; font-size:0.6rem;">STATUS: MASTER-SYNC AKTIV | DRUCKFORMAT: A4 QUER</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" onclick="window.print()"><i class="fas fa-print"></i> DRUCKEN</button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div id="mag-print-area" class="mag-spread">
                    <div class="mag-page" style="background: #050505; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                        <img src="${this.logoUrl}" class="club-logo-large">
                        <div style="font-family:'Orbitron'; font-size: 1.2rem; color: #fff; letter-spacing: 3px;">FC TONI 2.0</div>
                        <div style="font-size: 0.5rem; color: #39FF14; margin-bottom: 40px;">OFFIZIELLES VEREINSORGAN</div>
                        <div class="sponsor-box" style="width: 80%; border: 1px solid var(--accent-gold); padding: 20px;">
                            <div style="font-family:'Orbitron'; font-size: 1.2rem; color: var(--accent-gold);">TITAN LEASING</div>
                            <div style="font-size: 0.6rem; letter-spacing: 2px; margin-top: 5px;">PREMIUM PARTNER</div>
                        </div>
                        <div style="margin-top: 40px; font-size: 0.5rem; color: #444; font-family: 'Orbitron';">ESTABLISHED 2026 | POWERED BY TONI KI</div>
                    </div>

                    <div class="mag-page" style="background: linear-gradient(180deg, rgba(0,0,0,0) 40%, #000 100%), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'); background-size: cover;">
                        <div class="mag-header" style="border:none;">
                            <img src="${this.logoUrl}" class="club-logo-small">
                            <span style="display:block; text-align:right;">AUSGABE 02/2026</span>
                        </div>
                        <div style="margin-top: 250px;">
                            <div style="background: #39FF14; color:#000; display:inline-block; padding: 5px 15px; font-family:'Orbitron'; font-weight:900; transform: skew(-10deg);">MATCHDAY STAR</div>
                            <h1 class="editable-text" contenteditable="true" style="font-family:'Orbitron'; font-size:2.8rem; margin:10px 0; line-height:0.9; text-shadow: 2px 2px 10px #000;">${topPlayer.name.toUpperCase()}</h1>
                            <p class="editable-text" contenteditable="true" style="font-size:0.8rem; color: #39FF14; font-family:'Orbitron';">DER ELITE-CHECK ZUM HEUTIGEN SPIELTAG</p>
                        </div>
                    </div>
                </div>

                <div class="mag-spread">
                    <div class="mag-page">
                        <div class="mag-header">
                            <img src="${this.logoUrl}" style="height:20px;">
                            <span>02 | INTERN</span>
                        </div>
                        <h2 style="font-family:'Orbitron'; font-size:1.2rem; color:var(--accent-gold);">KADER-NEWS</h2>
                        <div style="margin-top: 20px;">
                            ${players.slice(0, 8).map(p => `
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #222; padding: 8px 0; font-size: 0.7rem;">
                                    <span>#${p.number} ${p.name}</span>
                                    <span style="color:#39FF14">${p.rat} OVR</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="editable-text" contenteditable="true" style="margin-top: 25px; font-size: 0.7rem; line-height: 1.6; color: #aaa;">
                            Klicken zum Bearbeiten: Die aktuelle Formkurve zeigt steil nach oben. Das Team ist bereit für die nächste Herausforderung unter Flutlicht.
                        </div>
                    </div>

                    <div class="mag-page">
                        <div class="mag-header">
                            <span>03 | TAKTIK-HUB</span>
                            <img src="${this.logoUrl}" style="height:20px;">
                        </div>
                        <div style="width: 100%; height: 180px; background: #050505; border: 1px solid #333; position: relative; margin-bottom: 20px; border-radius: 5px;">
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:80%; height:1px; background:rgba(57,255,20,0.2);"></div>
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:60px; height:60px; border:1px solid rgba(57,255,20,0.2); border-radius:50%;"></div>
                            <div style="text-align:center; padding-top: 80px; font-family:'Orbitron'; font-size:0.5rem; color:#39FF14;">FORMATION: MASTER ANALYSIS</div>
                        </div>
                        <h4 style="font-family:'Orbitron'; font-size:0.7rem; margin-bottom:10px;">TRAINER-NOTIZEN</h4>
                        <div class="editable-text" contenteditable="true" style="font-size: 0.65rem; line-height: 1.5; color: #ccc;">
                            Taktische Marschroute: Kompaktes Zentrum und schnelles Spiel über die Außenbahnen. Fokus auf Belastungssteuerung.
                        </div>
                        <div style="position:absolute; bottom:25px; left:25px; right:25px;" class="sponsor-box">
                            <div style="font-size: 0.5rem; font-family:'Orbitron'; color:var(--data-cyan);">NEON ENERGY | PARTNER DES ERFOLGS</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
