/**
 * TONI 2.0 - MATCHDAY PROGRAM ENGINE (STADIONHEFT)
 * Generiert ein professionelles DIN A5 / A4 Print-Layout.
 * Synchronisiert automatisch mit der Startelf (11+5) aus der Kabine.
 */
window.SektorTemplates = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || { name: "Dein Verein", coach: "Björn" };
        
        // Filter: Startelf (11) und Bank (5)
        const starters = players.filter(p => p.isStarter).slice(0, 11);
        const bench = players.filter(p => p.isNominated && !p.isStarter).slice(0, 5);

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out; color: #fff;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0;">MATCHDAY PROGRAM GENERATOR</h2>
                        <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Druckvorlage für den Spieltag</p>
                    </div>
                    <button class="login-btn" onclick="window.print()" style="padding: 12px 30px; background: var(--accent-orange); color: #fff;">
                        <i class="fas fa-print"></i> JETZT DRUCKEN
                    </button>
                </div>

                <div id="stadium-booklet" style="background:#fff; color:#000; padding:40px; border-radius:10px; max-width:800px; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.5);">
                    
                    <div style="text-align:center; border-bottom: 4px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
                        <h1 style="font-size: 3rem; font-weight: 900; margin:0; line-height:1;">${config.name.toUpperCase()}</h1>
                        <div style="font-size: 1.2rem; letter-spacing: 5px; color: #666; font-weight: bold; margin-top:10px;">MATCHDAY REPORT</div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin-bottom: 40px;">
                        <div style="background:#f4f4f4; padding:20px; text-align:center; border: 1px solid #ddd;">
                            <div style="width:100%; height:150px; background:#ddd; margin-bottom:15px; display:flex; align-items:center; justify-content:center;">
                                <i class="fas fa-user-tie" style="font-size:4rem; color:#aaa;"></i>
                            </div>
                            <b style="font-size:0.8rem;">COACH ${config.coach.toUpperCase()}</b>
                        </div>
                        <div>
                            <h3 style="margin-top:0; border-bottom: 2px solid #000; padding-bottom: 5px;">VORWORT DES TRAINERS</h3>
                            <p style="font-size: 0.9rem; line-height: 1.6; font-style: italic;">
                                "Willkommen zum heutigen Spieltag! Wir haben uns in der Trainingswoche intensiv auf die vertikalen Umschaltmomente konzentriert. 
                                Der Kader ist fokussiert und wir werden heute mit maximaler Intensität in die Zweikämpfe gehen. Viel Erfolg!"
                            </p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                        <div>
                            <h3 style="background:#000; color:#fff; padding:8px 15px; font-size: 0.9rem;">STARTELF (XI)</h3>
                            <table style="width:100%; border-collapse: collapse; margin-top:10px;">
                                ${starters.length > 0 
                                    ? starters.map(p => `
                                        <tr style="border-bottom:1px solid #eee;">
                                            <td style="padding:8px; font-weight:900; width:30px;">${p.number}</td>
                                            <td style="padding:8px;">${p.name.toUpperCase()}</td>
                                            <td style="padding:8px; font-size:0.7rem; color:#666; text-align:right;">${p.pos}</td>
                                        </tr>`).join('')
                                    : '<tr><td colspan="3" style="padding:20px; color:#999; text-align:center;">Keine Startelf nominiert</td></tr>'}
                            </table>
                        </div>

                        <div>
                            <h3 style="background:#666; color:#fff; padding:8px 15px; font-size: 0.9rem;">BANK (SUBSTITUTES)</h3>
                            <table style="width:100%; border-collapse: collapse; margin-top:10px;">
                                ${bench.length > 0 
                                    ? bench.map(p => `
                                        <tr style="border-bottom:1px solid #eee;">
                                            <td style="padding:8px; font-weight:900; width:30px;">${p.number}</td>
                                            <td style="padding:8px;">${p.name}</td>
                                            <td style="padding:8px; font-size:0.7rem; color:#666; text-align:right;">${p.pos}</td>
                                        </tr>`).join('')
                                    : '<tr><td colspan="3" style="padding:20px; color:#999; text-align:center;">Bank unbesetzt</td></tr>'}
                            </table>
                            
                            <div style="margin-top:30px; background:#000; color:var(--neon-green); padding:20px; border-radius:5px;">
                                <div style="font-size:0.6rem; font-weight:bold; letter-spacing:2px; margin-bottom:10px;">TONI [PRO] ANALYSIS</div>
                                <div style="font-size:0.8rem; line-height:1.4;">
                                    "Coach, die Daten zeigen: Die rechte Seite mit Alexander-Arnold wird heute entscheidend sein für unsere Flanken-Präzision. 100% Fokus!"
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:50px; text-align:center; font-size:0.7rem; color:#aaa; border-top:1px solid #eee; padding-top:20px;">
                        &copy; 2026 TONI 2.0 - INTERNATIONAL PERFORMANCE CENTER | GENERATED FOR COACH ${config.coach.toUpperCase()}
                    </div>
                </div>
            </div>
        `;
    }
};
