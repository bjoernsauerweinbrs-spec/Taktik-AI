/**
 * TONI 2.0 - MATCHDAY MAGAZINE ENGINE (PRO-EDITION)
 * Generiert ein mehrseitiges Profi-Layout für A4-Druck.
 * Inklusive Front-Cover, taktischer Analyse und Kaderliste.
 */
window.SektorTemplates = {
    render: function() {
        const players = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || { name: "International Pro Club", coach: "Björn" };
        const starters = players.filter(p => p.isStarter).slice(0, 11);
        const bench = players.filter(p => p.isNominated && !p.isStarter).slice(0, 7);
        const boardImg = window.arena ? window.arena.getSnapshot() : "";

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0; font-size:1.2rem;">MATCHDAY MAGAZINE PRO</h2>
                        <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Professionelles Stadionheft & Taktik-Report</p>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="login-btn" onclick="SektorTemplates.render()" style="padding: 12px 20px; background: rgba(255,255,255,0.05); color: #fff;">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                        <button class="login-btn" onclick="window.print()" style="padding: 12px 30px; background: var(--accent-orange); color: #fff; font-weight:900;">
                            <i class="fas fa-print"></i> JETZT DRUCKEN (A4)
                        </button>
                    </div>
                </div>

                <div id="stadium-booklet" style="color:#000; max-width:900px; margin: 0 auto; font-family: 'Inter', sans-serif;">
                    
                    <div class="print-page" style="background:#fff; height:1100px; padding:60px; position:relative; border: 15px solid #000; margin-bottom: 50px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="text-align:left;">
                            <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: 5px; color: #666;">OFFICIAL PROGRAMME</div>
                            <h1 style="font-size: 6rem; font-weight: 900; margin: 10px 0; line-height: 0.85; letter-spacing: -4px;">${config.name.toUpperCase()}</h1>
                            <div style="height: 10px; width: 200px; background: var(--accent-orange); margin-top: 20px;"></div>
                        </div>

                        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 0;">
                             ${boardImg ? `<img src="${boardImg}" style="width: 100%; border: 5px solid #000; box-shadow: 20px 20px 0 #eee;">` : '<div style="width:100%; height:300px; background:#f0f0f0; border:2px dashed #ccc;">BOARD SNAPSHOT</div>'}
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 10px solid #000; padding-top: 30px;">
                            <div>
                                <div style="font-size: 2.5rem; font-weight: 900; line-height: 1;">MATCHDAY</div>
                                <div style="font-size: 1.2rem; color: #555; font-weight: bold; letter-spacing: 2px;">PERFORMANCE REPORT 2026</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1rem; font-weight: 900;">HEAD COACH</div>
                                <div style="font-size: 1.5rem; font-weight: 900; color: var(--accent-orange);">${config.coach.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>

                    <div class="print-page" style="background:#fff; min-height:1100px; padding:60px; border: 1px solid #eee;">
                        <h2 style="font-size: 2.5rem; font-weight: 900; border-bottom: 8px solid #000; padding-bottom: 10px; margin-bottom: 40px; letter-spacing: -1px;">SQUAD & ANALYSIS</h2>
                        
                        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 50px;">
                            <div>
                                <h3 style="background:#000; color:#fff; padding:12px 20px; font-size: 1.1rem; letter-spacing:2px; font-weight: 900; margin-bottom: 20px;">STARTING XI</h3>
                                <div style="display: flex; flex-direction: column; gap: 5px;">
                                    ${starters.map(p => `
                                        <div style="display:flex; align-items:center; border-bottom: 1px solid #eee; padding: 12px 5px;">
                                            <div style="font-size: 1.5rem; font-weight: 900; width: 50px;">${p.number}</div>
                                            <div style="flex: 1; font-weight: 900; font-size: 1.1rem;">${p.name.toUpperCase()}</div>
                                            <div style="font-size: 0.8rem; font-weight: bold; color: #666; background: #f5f5f5; padding: 4px 10px; border-radius: 4px;">${p.pos}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <h3 style="background:#f5f5f5; color:#000; padding:12px 20px; font-size: 0.9rem; letter-spacing:1px; font-weight: 900; border: 1px solid #000; margin-bottom: 20px;">SUBSTITUTES</h3>
                                <div style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 40px;">
                                    ${bench.map(p => `
                                        <div style="display:flex; justify-content:space-between; padding: 8px 5px; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem;">
                                            <span><b>${p.number}</b> ${p.name}</span>
                                            <span style="color:#888;">${p.pos}</span>
                                        </div>
                                    `).join('')}
                                </div>

                                <div style="background: var(--bg-deep); color: #fff; padding: 30px; border-radius: 10px; position: relative; border-left: 8px solid var(--neon-green);">
                                    <div style="font-size: 0.7rem; font-weight: 900; letter-spacing: 3px; color: var(--neon-green); margin-bottom: 15px;">TONI AI ANALYSIS</div>
                                    <div style="font-size: 1rem; line-height: 1.6; font-style: italic; font-weight: 300;">
                                        "Coach ${config.coach}, die heutige Struktur ist auf maximale vertikale Dynamik ausgelegt. Das Board-Layout zeigt unsere Pressing-Fallen. Fokus auf die Umschaltmomente!"
                                    </div>
                                    <div style="margin-top: 20px; text-align: right; font-weight: 900; font-size: 0.8rem; color: var(--neon-green);">– TACTICAL AI SYSTEM</div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 100px; border-top: 2px solid #000; padding-top: 30px; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; font-weight: 900; color: #999;">
                            <span>TONI 2.0 PERFORMANCE LAB</span>
                            <span>LICENSED TO ${config.coach.toUpperCase()}</span>
                            <span>&copy; 2026 INTERNATIONAL PRO CLUB</span>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
};
