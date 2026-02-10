/**
 * TONI 2.0 - TEMPLATE & MEDIA HUB (PRO-EDITION)
 * Fokus: Dynamischer Sponsoren-Sync, Kader-Integration & Print-Optimierung.
 */
window.SektorTemplates = {
    activeTab: 'magazine', 

    render: function() {
        const content = document.getElementById('active-content');
        if (!content) return;

        // Sicherstellen, dass der Container sauber ist
        content.innerHTML = `
            <style>
                @media print { 
                    .no-print { display: none !important; } 
                    body { background: #fff !important; }
                }
                .magazine-container { background: #fff; color: #000; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif; }
                .page-break { page-break-after: always; }
                .tab-btn { padding: 10px 20px; border: none; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem; transition: 0.3s; background: rgba(255,255,255,0.05); color: #666; border-radius: 4px; }
                .tab-btn.active { background: var(--neon-green); color: #000; font-weight: bold; }
                .sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
            </style>

            <div style="padding:10px 30px 30px 30px; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px;">
                    <div style="display:flex; gap:10px; background:#000; padding:5px; border-radius:8px; border:1px solid #333;">
                        <button class="tab-btn ${this.activeTab === 'magazine' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('magazine')">STADIONZEITUNG</button>
                        <button class="tab-btn ${this.activeTab === 'stammplatz' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('stammplatz')">MISSION STAMMPLATZ</button>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="tactic-btn" onclick="window.print()" style="background: var(--accent-gold); color: #000; font-weight:900; border:none;">
                            <i class="fas fa-print"></i> DRUCKEN (A4)
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
        const coachName = window.BriefcaseUI?.clubData?.coach || "Coach Björn";

        return `
            <div class="magazine-container">
                <div class="print-page" style="padding:40px; position:relative; border: 15px solid #000; min-height:280mm; display: flex; flex-direction: column; justify-content: space-between;">
                    
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 8px solid #000; padding-bottom:10px;">
                        <div style="font-family:'Orbitron'; font-weight:900; font-size:2.5rem; line-height:1;">MATCHDAY<br>REPORT</div>
                        <div style="text-align:right;">
                            <div style="font-weight:900; font-size:1.2rem;">${teamContext.toUpperCase()}</div>
                            <div style="font-size:0.7rem; color:#666; letter-spacing:2px;">SAISON 2026 | AUSGABE #01</div>
                        </div>
                    </div>

                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 0;">
                        <div style="width:100%; height:250px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; border:2px dashed #ccc; position:relative;">
                             ${mainSponsor?.logo ? 
                                `<img src="${mainSponsor.logo}" style="max-height:180px; max-width:80%; object-fit:contain;">` : 
                                `<i class="fas fa-handshake" style="font-size:5rem; color:#ddd;"></i><br><p style="color:#ccc;">Hauptsponsor hier einfügen</p>`
                             }
                             <div style="position:absolute; bottom:-15px; background:#000; color:#fff; padding:5px 20px; font-weight:900; font-size:0.8rem;">OFFIZIELLER PARTNER</div>
                        </div>
                        <div style="margin-top:40px; text-align:center;">
                            <h2 style="font-size:3rem; font-weight:900; margin:0; line-height:1;">"MISSION<br>AUFSTIEG"</h2>
                            <p style="font-style:italic; color:#444; margin-top:10px;">Ein Wort von ${coachName}: "Heute zählen nur drei Punkte!"</p>
                        </div>
                    </div>

                    <div style="background:#000; color:#fff; padding:20px; display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">
                        <div style="grid-column: 1/-1; border-bottom:1px solid var(--neon-green); margin-bottom:10px; font-weight:900; font-size:0.7rem; letter-spacing:2px;">DER HEUTIGE KADER</div>
                        ${players.length > 0 ? players.slice(0,14).map(p => `
                            <div style="font-size:0.8rem; font-weight:bold;">• ${p.name.toUpperCase()} <span style="color:var(--neon-green); float:right;">${p.pos || '---'}</span></div>
                        `).join('') : '<div style="grid-column:1/-1; text-align:center; font-size:0.7rem; opacity:0.5;">Keine Spieler für dieses Team gemeldet.</div>'}
                    </div>
                </div>
            </div>
        `;
    },

    renderStammplatz: function() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 300px; gap: 30px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:40px; border-radius:15px; text-align:center;">
                    <i class="fas fa-trophy" style="font-size:3rem; color:var(--accent-gold); margin-bottom:20px;"></i>
                    <h3 style="font-family:'Orbitron'; color:var(--accent-gold);">STICKER-SHEET STUDIO</h3>
                    <p style="font-size:0.8rem; color:#888; max-width:400px; margin: 10px auto;">Generiert Sammelbilder für den aktuellen Kader (${window.currentTeamContext || 'Senioren'}).</p>
                    <button class="pro-btn-gold" onclick="window.SektorTemplates.generateStickers()" style="margin-top:20px;">SHEET JETZT GENERIEREN</button>
                    
                    <div id="sticker-sheet-container" class="magazine-container" style="margin-top:40px; display:none; padding:10mm; background:#fff;"></div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:12px; border:1px solid #333;">
                        <h4 style="font-size:0.7rem; color:var(--neon-green); letter-spacing:2px; margin-bottom:10px;">ALBUM-SERVICE</h4>
                        <button class="tactic-btn" style="width:100%;" onclick="window.SektorTemplates.printAlbum()">COVER DRUCKEN</button>
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
            <div style="text-align:center; border-bottom:4px solid #000; padding-bottom:10px; margin-bottom:20px;">
                <h2 style="margin:0; font-family:'Orbitron'; font-size:1.5rem;">MISSION STAMMPLATZ: ${teamContext.toUpperCase()}</h2>
                <small>OFFIZIELLES SAMMELBILD-SET | FEBRUAR 2026</small>
            </div>
            <div class="sticker-grid">
                ${players.map(p => {
                    const isElite = p.rat >= 85;
                    const borderColor = isElite ? 'var(--accent-gold)' : '#000';
                    return `
                        <div style="border:4px solid ${borderColor}; padding:10px; text-align:center; background:#fff; position:relative;">
                            <div style="width:100px; height:100px; background:#f0f0f0; margin:0 auto; border:2px solid ${borderColor}; overflow:hidden;">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja" style="font-size:2.5rem; margin-top:25px; color:#ddd;"></i>`}
                            </div>
                            <div style="font-weight:900; margin-top:8px; font-size:0.8rem;">${p.name.toUpperCase()}</div>
                            <div style="font-size:0.6rem; color:#666; font-weight:bold;">${p.pos || 'POS'} | RAT: ${p.rat}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        if(window.ToniVoice) window.ToniVoice.speak("Die Sticker für die " + teamContext + " sind fertig zum Druck.");
    },

    printAlbum: function() {
        // Logik für Album-Cover (bereits vorhanden)
    }
};
