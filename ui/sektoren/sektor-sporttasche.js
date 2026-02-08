/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (RESTORED TO MIDDAY STAND)
 */
window.SektorSporttasche = {
    open() {
        const windowEl = document.querySelector('.briefcase-window');
        if (!windowEl) return;
        this.render();
    },

    render() {
        const windowEl = document.querySelector('.briefcase-window');
        const mode = window.Database.activeMode || 'training';
        const players = window.Database.players || [];

        windowEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 2px solid var(--neon-green); padding-bottom:10px;">
                <h2 style="margin:0;">MANNSCHAFTSKABINE</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZURÜCK</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                ${players.map(p => {
                    let options = mode === 'training' ? `
                        <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Ohne Leibchen</option>
                        <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>Leibchen</option>
                        <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Abwesend</option>
                    ` : `
                        <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Startelf</option>
                        <option value="match" ${p.assignment === 'match' ? 'selected' : ''}>Ersatzbank</option>
                        <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Nicht im Kader</option>
                    `;

                    return `
                        <div style="background: rgba(255,255,255,0.05); padding: 15px; border: 1px solid #333; border-radius: 8px;">
                            <div style="font-weight:bold; margin-bottom:10px;">#${p.number} ${p.name}</div>
                            <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.arena.syncFromDatabase();" 
                                    style="width:100%; background:#000; color:var(--neon-green); border:1px solid #444; padding:5px;">
                                ${options}
                            </select>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};
