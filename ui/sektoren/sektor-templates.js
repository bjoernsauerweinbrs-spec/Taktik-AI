/**
 * TONI 2.0 - TEMPLATE & MEDIA HUB (PRO-EDITION)
 * Status: FINALISIERT & ROUTER-SYNC (open-Method Fix)
 */
window.SektorTemplates = {
    activeTab: 'magazine', 

    /**
     * ROUTER-ANSCHLUSS: Damit window.openSection('stadion') funktioniert.
     */
    open: function() {
        this.render();
    },

    /**
     * Haupt-Render-Funktion: Erstellt das Grundgerüst und die Tab-Nav.
     */
    render: function() {
        const content = document.getElementById('active-content');
        if (!content) return;

        content.innerHTML = `
            <style>
                @media print { 
                    .no-print { display: none !important; } 
                    body { background: #fff !important; color: #000 !important; }
                    .magazine-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
                }
                .magazine-container { background: #fff; color: #000; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif; transition: 0.3s; }
                .tab-btn { padding: 10px 20px; border: none; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem; transition: 0.3s; background: rgba(255,255,255,0.05); color: #888; border-radius: 4px; }
                .tab-btn.active { background: var(--neon-green); color: #000; font-weight: bold; box-shadow: 0 0 10px var(--neon-green); }
                .sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
            </style>

            <div class="fadeIn" style="padding:10px 30px 30px 30px; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(57, 255, 20, 0.2); padding-bottom:15px;">
                    <div style="display:flex; gap:10px; background:#000; padding:5px; border-radius:8px; border:1px solid #333;">
                        <button class="tab-btn ${this.activeTab === 'magazine' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('magazine')">STADIONZEITUNG</button>
                        <button class="tab-btn ${this.activeTab === 'stammplatz' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('stammplatz')">MISSION STAMMPLATZ</button>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" onclick="window.print()" style="font-size:0.7rem; padding: 8px 20px;">
                            <i class="fas fa-print"></i> PDF / DRUCKEN
                        </button>
                    </div>
                </div>

                <div id="template-view-container">
                    ${this.activeTab === 'magazine' ? this.renderMagazine() : this.renderStammplatz()}
                </div>
            </div>
        `;
    },

    switchTab: function(tab) {
        this.activeTab = tab;
        this.render();
    },

    /**
     * STADIONZEITUNG: Zieht Daten aus Management & Kabine
     */
    renderMagazine: function() {
        const teamContext = window.currentTeamContext || 'Senioren';
        const players = (window.Database?.players || []).filter(p => p.team === teamContext);
        const sponsors = window.Database?.sponsors || [];
        const mainSponsor = sponsors.find(s => s.isMain) || sponsors[0];
        const coachName = window.coachInfo?.name || "Coach";

        return `
            <div class="magazine-container fadeIn">
                <div class="print-page" style="padding:40px; position:relative; border: 15px solid #000; min-height:280mm; display: flex; flex-direction: column; justify-content: space-between;">
                    
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 8px solid #000; padding-bottom:10px;">
                        <div style="font-family:'Orbitron'; font-weight:900; font-size:2.5rem; line-height:1; color:#000;">MATCHDAY<br>REPORT</div>
                        <div style="text-align:right; color:#000;">
                            <div style="font-weight:900; font-size:1.2rem;">${teamContext.toUpperCase()}</div>
                            <div style="font-size:0.7rem; color:#666; letter-spacing:2px;">SAISON 2026 | AUSGABE #01</div>
                        </div>
                    </div>

                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 0;">
                        <div style="width:100%; height:250px; background:#f9f9f9; display:flex; align-items:center; justify-content:center; border:2px dashed #ccc; position:relative;">
                             ${mainSponsor?.logo ? 
                                `<img src="${mainSponsor.logo}" style="max-height:180px; max-width:80%; object-fit:contain;">` : 
                                `<div style="text-align:center; color:#ccc;"><i class="fas fa-handshake" style="font-size:4rem;"></i><br><p style="font-size:0.7rem;">Partner-Pool Slot frei</p></div>`
                             }
                             <div style="position:absolute; bottom:-15px; background:#000; color:#fff; padding:5px 20px; font-weight:900; font-size:0.8rem; font-family:'Orbitron';">OFFIZIELLER PARTNER</div>
                        </div>
                        <div style="margin-top:40px; text-align:center; color:#000;">
                            <h2 style="font-size:3.5rem; font-weight:900; margin:0; line-height:0.9; font-family:'Orbitron';">MISSION<br>ERFOLG</h2>
                            <p style="font-style:italic; color:#444; margin-top:15px; font-size:1.1rem; border-left: 4px solid var(--neon-green); padding-left: 15px; display: inline-block;">
                                "${coachName}: Heute zählen nur drei Punkte!"
                            </p>
                        </div>
                    </div>

                    <div style="background:#000; color:#fff; padding:25px; display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">
                        <div style="grid-column: 1/-1; border-bottom:1px solid var(--neon-green); margin-bottom:10px; font-weight:900; font-size:0.7rem; letter-spacing:3px; color:var(--neon-green); font-family:'Orbitron';">HEUTIGES AUFGEBOT</div>
                        ${players.length > 0 ? players.slice(0,14).map(p => `
                            <div style="font-size:0.85rem; font-weight:bold; text-transform:uppercase;">
                                • ${p.name} <span style="color:var(--neon-green); float:right; font-family:'Orbitron';">${p.pos || 'ST'}</span>
                            </div>
                        `).join('') : '<div style="grid-column:1/-1; text-align:center; font-size:0.7rem; opacity:0.5;">Kader-Daten werden synchronisiert...</div>'}
                    </div>
                </div>
            </div>
        `;
    },

    renderStammplatz: function() {
        return `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 300px; gap: 30px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:40px; border-radius:15px; text-align:center;">
                    <i class="fas fa-id-badge" style="font-size:3rem; color:var(--accent-gold); margin-bottom:20px;"></i>
                    <h3 style="font-family:'Orbitron'; color:var(--accent-gold);">STICKER-SHEET GENERATOR</h3>
                    <p style="font-size:0.8rem; color:#888; max-width:400px; margin: 10px auto;">Erstellt Sammelbilder für den Kader: <b>${window.currentTeamContext || 'Senioren'}</b>.</p>
                    <button class="pro-btn-gold" onclick="window.SektorTemplates.generateStickers()" style="margin-top:20px; padding: 12px 25px;">STUDIO STARTEN</button>
                    
                    <div id="sticker-sheet-container" class="magazine-container" style="margin-top:40px; display:none; padding:10mm; background:#fff;"></div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:12px; border:1px solid #333;">
                        <h4 style="font-size:0.7rem; color:var(--neon-green); letter-spacing:2px; margin-bottom:10px; font-family:'Orbitron';">ALBUM-SERVICE</h4>
                        <p style="font-size:0.65rem; color:#666; margin-bottom:15px;">Drucke das leere Albumcover für deine Spieler aus.</p>
                        <button class="tactic-btn" style="width:100%; border-color:var(--neon-green); color:var(--neon-green);" onclick="window.SektorTemplates.printAlbum()">ALBUM DRUCKEN</button>
                    </div>
                </div>
            </div>
        `;
    },

    generateStickers: function() {
        const teamContext = window.currentTeamContext || 'Senioren';
        const players = (window.Database?.players || []).filter(p => p.team === teamContext);
        const container = document.getElementById('sticker-sheet-container');
        
        container.style.display = 'block';
        container.innerHTML = `
            <div style="text-align:center; border-bottom:4px solid #000; padding-bottom:10px; margin-bottom:20px; color:#000;">
                <h2 style="margin:0; font-family:'Orbitron'; font-size:1.5rem;">MISSION STAMMPLATZ: ${teamContext.toUpperCase()}</h2>
                <small style="font-weight:bold;">OFFIZIELLES SAMMELBILD-SET | 2026</small>
            </div>
            <div class="sticker-grid">
                ${players.map(p => {
                    const isElite = p.rat >= 85;
                    const borderColor = isElite ? '#ffcc00' : '#000';
                    return `
                        <div style="border:4px solid ${borderColor}; padding:10px; text-align:center; background:#fff; color:#000;">
                            <div style="width:100px; height:100px; background:#f0f0f0; margin:0 auto; border:2px solid ${borderColor}; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja" style="font-size:2.5rem; color:#ddd;"></i>`}
                            </div>
                            <div style="font-weight:900; margin-top:8px; font-size:0.8rem; text-transform:uppercase;">${p.name.split(' ').pop()}</div>
                            <div style="font-size:0.6rem; color:#666; font-weight:bold; letter-spacing:1px;">${p.pos || 'POS'} | RAT: ${p.rat}</div>
                            ${isElite ? `<div style="font-size:0.5rem; color:#ffcc00; font-weight:bold; margin-top:3px;">★ ELITE ★</div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        if(window.ToniVoice) window.ToniVoice.speak("Die Sammelbilder für " + teamContext + " sind fertig zum Druck.");
        container.scrollIntoView({ behavior: 'smooth' });
    },

    printAlbum: function() {
        const content = document.getElementById('active-content');
        this.activeTab = 'album'; 
        content.innerHTML = `
            <div class="magazine-container fadeIn" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:50px; border: 20px double #000; min-height:280mm; color:#000;">
                <h1 style="font-family:'Orbitron'; font-size:4rem; margin-bottom:0;">MISSION</h1>
                <h1 style="font-family:'Orbitron'; font-size:4.5rem; margin-top:0; background:#000; color:#fff; padding:0 20px;">STAMMPLATZ</h1>
                <div style="width:150px; height:150px; border:5px solid #000; margin:40px 0; display:flex; align-items:center; justify-content:center;">
                    <i class="fas fa-trophy" style="font-size:4rem;"></i>
                </div>
                <h2 style="font-size:2rem; text-transform:uppercase; letter-spacing:5px; margin-bottom:10px;">SAMMELALBUM</h2>
                <div style="font-weight:bold; font-size:1.5rem; border-top:2px solid #000; padding-top:10px;">SAISON 2026</div>
                <p style="margin-top:100px; font-family:'Orbitron'; font-size:0.8rem;">UNIT CONTROL POWERED BY TONI 2.0</p>
            </div>
            <div class="no-print" style="text-align:center; margin-top:20px;">
                <button class="pro-btn-gold" onclick="window.print()">JETZT DRUCKEN</button>
                <button class="tactic-btn" onclick="window.SektorTemplates.render()">ZURÜCK</button>
            </div>
        `;
    }
};
