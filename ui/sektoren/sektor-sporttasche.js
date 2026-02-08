/**
 * TONI 2.0 - SEKTOR KABINE (RESTORED & HIGH CONTRAST)
 * Stand: Heute Mittag (mit besserer Lesbarkeit)
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        content.style.paddingBottom = "180px";
        content.style.overflowY = "auto";
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const mode = window.Database.activeMode || 'training';
        const players = window.Database.players || [];

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--neon-green); padding-bottom: 15px;">
                <h2 style="color:var(--neon-green); margin:0; letter-spacing:2px; text-transform:uppercase;">KABINE: ${window.coachInfo.verein || 'UNSER KADER'}</h2>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="fifa-cards-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                ${players.map(p => {
                    let options = "";
                    let teamColor = p.team === 'B' ? '#ccff00' : 'var(--accent-gold)';
                    
                    if (mode === 'training') {
                        options = `
                            <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Ohne Leibchen</option>
                            <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>Leibchen</option>
                            <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Abwesend</option>
                        `;
                    } else {
                        options = `
                            <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Startelf</option>
                            <option value="match" ${p.assignment === 'match' ? 'selected' : ''}>Ersatzbank</option>
                            <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Nicht im Kader</option>
                        `;
                    }

                    return `
                        <div class="fifa-card" style="background: rgba(0,0,0,0.4); border: 1px solid #333; border-radius: 12px; width: 220px; padding: 15px; position: relative;">
                            <div style="color:#fff; font-weight:900; font-size:1.2rem; position:absolute; top:10px; left:15px;">${p.rat || 80}</div>
                            
                            <div style="text-align:center; margin-top:20px;">
                                <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.05); border-radius: 50%; border: 2px solid ${teamColor}; margin: 0 auto 10px; display:flex; align-items:center; justify-content:center;">
                                    <i class="fas fa-user-ninja" style="color:${teamColor}; font-size:1.5rem;"></i>
                                </div>
                                
                                <div style="font-weight:900; color:#fff; text-transform:uppercase; font-size:0.85rem; letter-spacing:1px;">${p.name}</div>
                                <div style="color:var(--data-cyan); font-size:0.65rem; font-weight:bold; margin-bottom:15px;">${p.pos || 'N/A'}</div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px; font-size: 0.7rem; font-weight:bold;">
                                <div style="color:#888;">PAC <span style="color:#fff;">${p.pac || 70}</span></div>
                                <div style="color:#888;">SHO <span style="color:#fff;">${p.sho || 70}</span></div>
                                <div style="color:#888;">PAS <span style="color:#fff;">${p.pas || 70}</span></div>
                                <div style="color:#888;">DRI <span style="color:#fff;">${p.dri || 70}</span></div>
                                <div style="color:#888;">DEF <span style="color:#fff;">${p.def || 70}</span></div>
                                <div style="color:#888;">PHY <span style="color:#fff;">${p.phy || 70}</span></div>
                            </div>

                            <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.render();" 
                                    style="width:100%; margin-top:12px; background:#111; color:var(--neon-green); border:1px solid #444; padding:6px; border-radius:5px; font-weight:bold; font-size:0.75rem; cursor:pointer;">
                                ${options}
                            </select>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};
