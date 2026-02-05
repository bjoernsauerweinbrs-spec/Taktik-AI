/**
 * TONI 2.0 - MATCHDAY PROGRAM ENGINE (STADIONHEFT)
 * Generiert ein professionelles DIN A5 / A4 Print-Layout.
 * Synchronisiert automatisch mit der Startelf (11+5) aus der Kabine.
 */
window.SektorTemplates = {
    render: function() {
        // Daten aus der zentralen ToniDB beziehen
        const players = window.ToniDB ? window.ToniDB.getPlayers() : (JSON.parse(localStorage.getItem('toni_players')) || []);
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || { name: "International Pro Club", coach: "Björn" };
        
        // Filter: Startelf (XI) und Bank (Bench) basierend auf Kabinen-Status
        const starters = players.filter(p => p.isStarter).slice(0, 11);
        const bench = players.filter(p => p.isNominated && !p.isStarter).slice(0, 5);

        // Dynamische Analyse-Message von Toni generieren
        const keyPlayer = starters.length > 0 ? starters[Math.floor(Math.random() * starters.length)].name : "dem Team";
        const toniAdvice = starters.length >= 11 
            ? `Coach, die Formation steht. Mit ${keyPlayer} haben wir heute die nötige Stabilität im Zentrum. Pressing-Linie halten!`
            : `Coach, der Kader ist noch nicht vollständig nominiert. Bitte prüfe die Kabine für die finale Startelf.`;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0; font-size:1.2rem;">MATCHDAY PROGRAM GENERATOR</h2>
                        <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Druckvorlage für den Spieltag (A4/A5)</p>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="login-btn" onclick="SektorTemplates.render()" style="padding: 12px 20px; background: rgba(255,255,255,0.05); color: #fff;">
                            <i class="fas fa-sync"></i> DATEN REFRESH
                        </button>
                        <button class="login-btn" onclick="window.print()" style="padding: 12px 30px; background: var(--accent-orange); color: #fff; font-weight:900;">
                            <i class="fas fa-print"></i> JETZT DRUCKEN
                        </button>
                    </div>
                </div>

                <div id="stadium-booklet" style="background:#fff; color:#000; padding:50px; border-radius:5px; max-width:800px; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif;">
                    
                    <div style="text-align:center; border-bottom: 5px solid #000; padding-bottom: 25px; margin-bottom: 35px;">
                        <h1 style="font-size: 3.5rem; font-weight: 900; margin:0; line-height:0.9; letter-spacing:-2px;">${config.name.toUpperCase()}</h1>
                        <div style="font-size: 1.1rem; letter-spacing: 6px; color: #444; font-weight: bold; margin-top:15px; text-transform:uppercase;">Official Matchday Report</div>
                        <div style="margin-top:10px; font-size:0.8rem; font-weight:bold; color:var(--accent-orange);">SEASON 2026 | PERFORMANCE CENTER</div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 40px; margin-bottom: 50px;">
                        <div style="background:#000; padding:25px; text-align:center; color:#fff; border-radius:5px;">
                            <div style="width:100%; height:160px; background:#222; margin-bottom:15px; display:flex; align-items:center; justify-content:center; border: 1px solid var(--accent-gold);">
                                <i class="fas fa-user-tie" style="font-size:5rem; color:var(--accent-gold);"></i>
                            </div>
                            <b style="font-size:0.9rem; letter-spacing:1px;">COACH ${config.coach.toUpperCase()}</b>
                            <div style="font-size:0.6rem; color:var(--accent-gold); margin-top:5px; font-weight:bold;">A-LIZENZ TACTICAL DIRECTOR</div>
                        </div>
                        <div>
                            <h3 style="margin-top:0; border-bottom: 3px solid #000; padding-bottom: 8px; font-size:1.2rem; font-weight:900;">VORWORT DES TRAINERS</h3>
                            <p style="font-size: 1rem; line-height: 1.7; font-style: italic; color:#333;">
                                "Willkommen zum heutigen Spieltag! Die Analyse von Toni zeigt, dass wir heute über die Kompaktheit im Mittelfeld kommen müssen. 
                                Wir haben im Training gezielt an den vertikalen Tiefenläufen gearbeitet. Die Jungs sind hungrig auf den Sieg. 
                                Gemeinsam für ${config.name}!"
                            </p>
                            <div style="margin-top:15px; font-weight:bold; font-size:0.9rem;">– Coach ${config.coach}</div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 45px;">
                        <div>
                            <h3 style="background:#000; color:#fff; padding:10px 15px; font-size: 1rem; letter-spacing:2px; font-weight:900; margin-bottom:15px;">STARTING XI (RED TEAM)</h3>
                            <table style="width:100%; border-collapse: collapse;">
                                ${starters.length > 0 
                                    ? starters.map(p => `
                                        <tr style="border-bottom:1px solid #ddd;">
                                            <td style="padding:10px; font-weight:900; font-size:1.1rem; width:40px;">${p.number}</td>
                                            <td style="padding:10px; font-weight:bold;">${p.name.toUpperCase()}</td>
                                            <td style="padding:10px; font-size:0.75rem; color:#555; text-align:right; font-weight:bold;">${p.pos}</td>
                                        </tr>`).join('')
                                    : '<tr><td colspan="3" style="padding:30px; color:#999; text-align:center; font-style:italic; border:1px dashed #ccc;">Keine Startelf in der Kabine nominiert</td></tr>'}
                            </table>
                        </div>

                        <div>
                            <h3 style="background:#666; color:#fff; padding:10px 15px; font-size: 0.9rem; letter-spacing:1px; font-weight:900; margin-bottom:15px;">SUBSTITUTES</h3>
                            <table style="width:100%; border-collapse: collapse; margin-bottom:35px;">
                                ${bench.length > 0 
                                    ? bench.map(p => `
                                        <tr style="border-bottom:1px solid #eee;">
                                            <td style="padding:8px; font-weight:bold; width:30px; font-size:0.9rem;">${p.number}</td>
                                            <td style="padding:8px; font-size:0.9rem;">${p.name}</td>
                                            <td style="padding:8px; font-size:0.65rem; color:#777; text-align:right;">${p.pos}</td>
                                        </tr>`).join('')
                                    : '<tr><td colspan="3" style="padding:15px; color:#aaa; text-align:center; font-size:0.7rem;">Bank aktuell unbesetzt</td></tr>'}
                            </table>
                            
                            <div style="background:#000; color:var(--neon-green); padding:25px; border-radius:5px; border-left:5px solid var(--neon-green);">
                                <div style="font-size:0.65rem; font-weight:900; letter-spacing:3px; margin-bottom:12px; color:#fff;">TONI [PRO] TACTICAL INSIGHT</div>
                                <div style="font-size:0.9rem; line-height:1.5; font-style:italic;">
                                    "${toniAdvice}"
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:60px; text-align:center; font-size:0.75rem; color:#777; border-top:2px solid #000; padding-top:25px; font-weight:bold;">
                        &copy; 2026 TONI 2.0 AI SYSTEM | INTERNATIONAL PERFORMANCE CENTER | LICENSED TO COACH ${config.coach.toUpperCase()}
                    </div>
                </div>
            </div>
        `;
    }
};
