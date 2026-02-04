/**
 * TONI 2.0 - GINGA PERFORMANCE LAB (DEEP ANALYSIS)
 * Zwei-Spalten-Layout mit Spieler-Entwicklung & Pro-Metriken.
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 320px 1fr; gap: 30px; height: 80vh; animation: fadeIn 0.4s ease-out;">
                
                <div style="background: rgba(0,0,0,0.3); border-right: 1px solid rgba(57,255,20,0.1); overflow-y: auto; padding-right: 15px;">
                    <h3 style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 20px;">KADER-SELEKTION</h3>
                    
                    <div id="squad-list-container">
                        ${this.renderSquadList(players)}
                    </div>
                </div>

                <div id="player-detail-console" style="background: rgba(13, 20, 33, 0.5); border-radius: 15px; padding: 30px; border: 1px solid rgba(212,175,55,0.1);">
                    ${this.renderEmptyState()}
                </div>

            </div>`;
    },

    renderSquadList: function(players) {
        if (players.length === 0) return `<p style="color:var(--text-dim); font-size:0.8rem;">Keine Profis im System.</p>`;

        // Sortierung: Startelf (11) dann Bank (Rest)
        const sorted = [...players].sort((a,b) => (b.isStarter === a.isStarter) ? 0 : a.isStarter ? -1 : 1);

        return sorted.map(p => {
            const isSelected = p.id === this.selectedPlayerId;
            const photo = p.photoUrl || 'https://via.placeholder.com/40/39FF14/000000?text=P';
            
            return `
                <div onclick="SektorAnalyse.selectPlayer('${p.id}')" 
                     style="display:flex; align-items:center; gap:15px; padding:12px; margin-bottom:8px; cursor:pointer; border-radius:8px; 
                            background: ${isSelected ? 'rgba(57, 255, 20, 0.1)' : 'rgba(255,255,255,0.03)'}; 
                            border: 1px solid ${isSelected ? 'var(--neon-green)' : 'transparent'};
                            transition: 0.3s;">
                    <img src="${photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border: 1px solid var(--accent-gold);">
                    <div style="flex:1;">
                        <div style="font-size:0.85rem; font-weight:900; color:#fff;">${p.name.toUpperCase()}</div>
                        <div style="font-size:0.6rem; color:var(--text-dim);">${p.pos || 'ZM'} | NR: ${p.number || '0'}</div>
                    </div>
                    ${p.isStarter ? '<i class="fas fa-star" style="color:var(--accent-gold); font-size:0.7rem;"></i>' : ''}
                </div>
            `;
        }).join('');
    },

    selectPlayer: function(id) {
        this.selectedPlayerId = id;
        this.render(); // Re-render für Liste (Selection-Style)
        this.updateDetailView(id);
    },

    updateDetailView: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id === id);
        const console = document.getElementById('player-detail-console');
        if (!p || !console) return;

        const skills = p.skills || { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 };
        const vitals = p.vitals || { pulse: 72, spo2: 98 };

        console.innerHTML = `
            <div style="animation: fadeIn 0.3s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                    <div style="display:flex; align-items:center; gap:20px;">
                        <img src="${p.photoUrl || ''}" style="width:80px; height:80px; border-radius:15px; border:2px solid var(--neon-green); object-fit:cover;">
                        <div>
                            <h2 style="color:#fff; margin:0; letter-spacing:2px;">${p.name.toUpperCase()}</h2>
                            <p style="color:var(--neon-green); font-size:0.7rem; font-weight:900;">GINGA PRO LEVEL: ${p.rating || 80}</p>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <span style="background:rgba(57,255,20,0.1); color:var(--neon-green); padding:5px 15px; border-radius:20px; font-size:0.6rem; font-weight:900;">
                            ${p.status === 'FIT' ? 'EINSATZBEREIT' : 'REHA-MODUS'}
                        </span>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:30px;">
                    <button class="tactic-btn" style="border-color:var(--neon-green); color:var(--neon-green)">STATUS-RADAR</button>
                    <button class="tactic-btn">VITAL-HISTORIE</button>
                    <button class="tactic-btn">SCOUTING-REPORT</button>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    
                    <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:10px;">
                        <h4 style="font-size:0.6rem; color:var(--accent-gold); margin-bottom:15px;">SKILL-MATRIX</h4>
                        ${this.renderSkillMatrix(skills)}
                    </div>

                    <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:10px;">
                        <h4 style="font-size:0.6rem; color:var(--data-cyan); margin-bottom:15px;">VITAL-LOG (AKTUELL)</h4>
                        <div style="display:flex; justify-content:space-around; align-items:center; height:100px;">
                            <div style="text-align:center;">
                                <div style="font-size:1.8rem; font-weight:900; color:#fff;">${vitals.pulse}</div>
                                <div style="font-size:0.5rem; color:var(--text-dim);">PULS (BPM)</div>
                            </div>
                            <div style="width:1px; height:40px; background:rgba(255,255,255,0.1);"></div>
                            <div style="text-align:center;">
                                <div style="font-size:1.8rem; font-weight:900; color:var(--data-cyan);">${vitals.spo2}%</div>
                                <div style="font-size:0.5rem; color:var(--text-dim);">SAUERSTOFF (SpO2)</div>
                            </div>
                        </div>
                    </div>

                    <div style="grid-column: span 2; background:rgba(57,255,20,0.03); border:1px solid rgba(57,255,20,0.1); padding:20px; border-radius:10px;">
                        <h4 style="font-size:0.6rem; color:var(--neon-green); margin-bottom:10px;">TONIS COACHING-ANALYSE</h4>
                        <p style="font-size:0.85rem; line-height:1.6; color:#fff; font-style:italic;">
                            "${this.generateScoutingReport(p)}"
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    renderSkillMatrix: function(skills) {
        const labels = { spr: 'SPEED', aus: 'AUSDAUER', tec: 'TECHNIK', pas: 'PASS', phy: 'PHYSIS' };
        return Object.keys(skills).map(key => `
            <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; font-size:0.6rem; margin-bottom:4px;">
                    <span>${labels[key]}</span>
                    <span>${skills[key]}%</span>
                </div>
                <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                    <div style="width:${skills[key]}%; height:100%; background:var(--neon-green); box-shadow: 0 0 10px var(--neon-green);"></div>
                </div>
            </div>
        `).join('');
    },

    generateScoutingReport: function(p) {
        const skills = p.skills || { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 };
        if (skills.tec > 85) return `${p.name} ist ein Ginga-Elite-Techniker. Unter hohem Gegnerdruck findet er Lösungen, die statistisch kaum möglich sind. Unverzichtbar für unser Aufbauspiel.`;
        if (skills.spr > 85) return `${p.name} bringt die nötige Vmax für unsere Umschaltmomente mit. Wenn er tief geht, ist er für die gegnerische Kette kaum zu halten.`;
        if (p.status !== 'FIT') return `Achtung Coach: ${p.name} ist physisch aktuell nicht voll belastbar. Wir sollten ihn für die Schlussphase als Joker einplanen.`;
        return `${p.name} zeigt eine solide Balance. Er ist der klassische Teamspieler, der die Kompaktheit im Mittelfeld garantiert.`;
    },

    renderEmptyState: function() {
        return `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--text-dim); text-align:center;">
                <i class="fas fa-user-chart" style="font-size:3rem; margin-bottom:20px; opacity:0.2;"></i>
                <p>Wähle links einen Spieler aus,<br>um die Ginga-Deep-Analysis zu starten.</p>
            </div>
        `;
    }
};
