/**
 * TONI 2.0 - TEMPLATE & MEDIA HUB (PRO-EDITION)
 * Fokus: Sticker-Studio (Academy) & Stadionzeitung (Media)
 * Status: MASTER-SYNC 2026 - FINAL RECOVERY
 */
window.SektorTemplates = {
    activeTab: 'magazine', 

    /**
     * ROUTER-ANSCHLUSS: Synchronisiert mit window.openSection
     */
    open: function() {
        this.render();
    },

    /**
     * Tab-Umschaltung mit automatischer Re-Initialisierung
     */
    switchTab: function(tab) {
        this.activeTab = tab;
        this.render();
    },

    render: function() {
        const content = document.getElementById('active-content');
        if (!content) return;

        content.innerHTML = `
            <style>
                @media print { 
                    .no-print { display: none !important; } 
                    body { background: #fff !important; color: #000 !important; }
                    .magazine-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; border:none !important; }
                }
                .magazine-container { background: #fff; color: #000; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.8); font-family: 'Inter', sans-serif; }
                .tab-btn { padding: 10px 20px; border: none; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; transition: 0.3s; background: rgba(255,255,255,0.05); color: #888; border-radius: 4px; border: 1px solid #333; }
                .tab-btn.active.mag { border-color: var(--data-cyan); color: var(--data-cyan); background: rgba(0, 209, 255, 0.1); }
                .tab-btn.active.stk { border-color: var(--neon-green); color: var(--neon-green); background: rgba(57, 255, 20, 0.1); }
                .sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px; background: #fff; }
                
                /* Elite Card CSS Simulation */
                .elite-sticker { border: 4px solid #000; padding: 15px; position: relative; background: #fff; clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%); }
                .elite-sticker.gold { border-color: #D4AF37; box-shadow: inset 0 0 15px rgba(212, 175, 55, 0.2); }
            </style>

            <div class="fadeIn" style="padding:10px 30px 30px 30px; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px;">
                    <div style="display:flex; gap:10px; padding:5px; border-radius:8px;">
                        <button class="tab-btn mag ${this.activeTab === 'magazine' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('magazine')">📰 STADIONZEITUNG</button>
                        <button class="tab-btn stk ${this.activeTab === 'stammplatz' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('stammplatz')">🖼️ MISSION STAMMPLATZ</button>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" onclick="window.print()" style="font-size:0.7rem;">
                            <i class="fas fa-file-pdf"></i> EXPORT / DRUCKEN
                        </button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()" style="font-size:0.7rem;">ZENTRALE</button>
                    </div>
                </div>

                <div id="template-view-container">
                    ${this.activeTab === 'magazine' ? this.renderMagazine() : this.renderStammplatz()}
                </div>
            </div>
        `;
    },

    /**
     * STADIONZEITUNG: Das Layout für den Media-Sektor
     */
    renderMagazine: function() {
        const team = window.currentTeamContext || 'ERSTE MANNSCHAFT';
        const players = (window.Database?.players || []).filter(p => p.team === team || p.jugend === team);
        const sponsors = window.Database?.sponsors || [];
        const mainSponsor = sponsors.find(s => s.isMain) || sponsors[0];
        const coach = window.coachInfo?.name || "COACH TONI";

        return `
            <div class="magazine-container fadeIn">
                <div style="padding:40px; border: 12px solid #000; min-height:280mm; display: flex; flex-direction: column;">
                    
                    <div style="display:flex; justify-content:space-between; border-bottom: 10px solid #000; padding-bottom:10px;">
                        <div style="font-family:'Orbitron'; font-weight:900; font-size:3rem; line-height:0.85; color:#000;">MATCHDAY<br><span style="color:var(--data-cyan);">REPORT</span></div>
                        <div style="text-align:right; color:#000; font-family:'Orbitron';">
                            <div style="font-weight:900; font-size:1.4rem;">${team.toUpperCase()}</div>
                            <div style="font-size:0.7rem; color:#666; letter-spacing:3px;">SAISON 2026 | TONI PRO SYNC</div>
                        </div>
                    </div>

                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 0;">
                        <div style="width:100%; height:280px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; border:1px solid #ddd; position:relative;">
                             ${mainSponsor?.logo ? 
                                `<img src="${mainSponsor.logo}" style="max-height:200px; max-width:85%; object-fit:contain;">` : 
                                `<div style="text-align:center; color:#ccc;"><i class="fas fa-handshake" style="font-size:5rem;"></i><br><p style="font-family:'Orbitron'; font-size:0.8rem;">HAUPTPARTNER SLOT</p></div>`
                             }
                             <div style="position:absolute; top:-15px; background:#000; color:#fff; padding:5px 25px; font-weight:900; font-size:0.7rem; font-family:'Orbitron'; letter-spacing:2px;">PRESENTED BY</div>
                        </div>

                        <div style="margin-top:50px; text-align:center; color:#000;">
                            <h2 style="font-size:4rem; font-weight:900; margin:0; line-height:0.8; font-family:'Orbitron';">VORWÄRTS<br>${window.coachInfo.verein?.toUpperCase() || 'TEAM'}</h2>
                            <p style="margin-top:25px; font-size:1.2rem; border-left: 6px solid var(--data-cyan); padding:10px 20px; display: inline-block; font-weight:bold; background:#f9f9f9;">
                                "${coach}: Die Vorbereitung war intensiv. Jetzt zählt der Fokus!"
                            </p>
                        </div>
                    </div>

                    <div style="background:#000; color:#fff; padding:30px; display:grid; grid-template-columns: repeat(2, 1fr); gap:15px;">
                        <div style="grid-column: 1/-1; border-bottom:2px solid var(--data-cyan); margin-bottom:10px; font-weight:900; font-size:0.8rem; letter-spacing:4px; color:var(--data-cyan); font-family:'Orbitron';">DAS HEUTIGE AUFGEBOT</div>
                        ${players.length > 0 ? players.slice(0,16).map(p => `
                            <div style="font-size:0.9rem; font-weight:bold; text-transform:uppercase; font-family:'Inter';">
                                <span style="color:var(--data-cyan); font-family:'Orbitron'; margin-right:10px;">${p.pos || '•'}</span> ${p.name}
                            </div>
                        `).join('') : '<div style="grid-column:1/-1; text-align:center; opacity:0.3;">Kader-Daten nicht verfügbar.</div>'}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * MISSION STAMMPLATZ: Das Layout für den Academy-Sektor
     */
    renderStammplatz: function() {
        return `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 300px; gap: 30px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:40px; border-radius:15px; text-align:center;">
                    <i class="fas fa-bolt" style="font-size:3.5rem; color:var(--neon-green); margin-bottom:25px; filter: drop-shadow(0 0 10px var(--neon-green));"></i>
                    <h3 style="font-family:'Orbitron'; color:var(--neon-green); letter-spacing:2px;">MISSION STAMMPLATZ</h3>
                    <p style="font-size:0.8rem; color:#888; max-width:450px; margin: 15px auto;">Generiere Sammelbilder für die <b>${window.currentTeamContext || 'Academy'}</b>. Jedes Bild basiert auf den Live-Stats der Datenbank.</p>
                    <button class="pro-btn-gold" onclick="window.SektorTemplates.generateStickers()" style="margin-top:20px; border-color:var(--neon-green); color:var(--neon-green);">STICKER-STUDIO STARTEN</button>
                    
                    <div id="sticker-sheet-container" class="magazine-container" style="margin-top:40px; display:none; padding:15mm; background:#fff; border:none;"></div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:rgba(0,209,255,0.05); padding:20px; border-radius:12px; border:1px solid var(--data-cyan);">
                        <h4 style="font-size:0.7rem; color:var(--data-cyan); letter-spacing:2px; margin-bottom:10px; font-family:'Orbitron';">ALBUM-SERVICE</h4>
                        <p style="font-size:0.65rem; color:#888; margin-bottom:15px;">Drucke das Cover für das offizielle Sammelalbum aus.</p>
                        <button class="tactic-btn" style="width:100%; border-color:var(--data-cyan); color:var(--data-cyan);" onclick="window.SektorTemplates.printAlbum()">COVER DRUCKEN</button>
                    </div>
                </div>
            </div>
        `;
    },

    generateStickers: function() {
        const team = window.currentTeamContext || 'Academy';
        const players = (window.Database?.players || []).filter(p => p.team === team || p.jugend === team);
        const container = document.getElementById('sticker-sheet-container');
        
        container.style.display = 'block';
        container.innerHTML = `
            <div style="text-align:center; border-bottom:6px solid #000; padding-bottom:15px; margin-bottom:30px; color:#000;">
                <h2 style="margin:0; font-family:'Orbitron'; font-size:1.8rem; letter-spacing:3px;">MISSION STAMMPLATZ: ${team.toUpperCase()}</h2>
                <div style="font-weight:900; letter-spacing:5px; font-size:0.8rem;">OFFIZIELLES SAMMELBILD-SET 2026</div>
            </div>
            <div class="sticker-grid">
                ${players.map(p => {
                    const isGold = p.rat >= 85;
                    return `
                        <div class="elite-sticker ${isGold ? 'gold' : ''}">
                            <div style="font-family:'Orbitron'; font-weight:900; font-size:1.8rem; position:absolute; top:10px; left:15px;">${p.rat || 80}</div>
                            <div style="position:absolute; top:40px; left:15px; font-size:0.6rem; font-weight:bold; color:#666;">${p.pos || 'ST'}</div>
                            
                            <div style="width:120px; height:120px; background:#f0f0f0; margin:20px auto 10px auto; overflow:hidden; display:flex; align-items:center; justify-content:center; border-bottom:3px solid #000;">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-circle" style="font-size:4rem; color:#ddd;"></i>`}
                            </div>
                            
                            <div style="background:#000; color:#fff; padding:8px; font-weight:900; font-size:0.8rem; text-transform:uppercase; font-family:'Orbitron';">
                                ${p.name.split(' ').pop()}
                            </div>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-top:8px; font-size:0.55rem; font-weight:bold; font-family:'Orbitron';">
                                <div style="border-right:1px solid #eee;">PAC: ${p.pac || 80}</div>
                                <div>SHO: ${p.sho || 75}</div>
                                <div style="border-right:1px solid #eee;">PAS: ${p.pas || 78}</div>
                                <div>DRI: ${p.dri || 82}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        if(window.ToniVoice) window.ToniVoice.speak("Das Sticker-Sheet für die " + team + " wurde im Studio generiert.");
        container.scrollIntoView({ behavior: 'smooth' });
    },

    printAlbum: function() {
        const content = document.getElementById('active-content');
        content.innerHTML = `
            <div class="magazine-container fadeIn" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:50px; border: 30px solid #000; min-height:280mm; color:#000; position:relative;">
                <div style="position:absolute; top:20px; left:20px; font-family:'Orbitron'; font-size:0.8rem; font-weight:bold;">OFFICIAL PRODUCT 2026</div>
                <h1 style="font-family:'Orbitron'; font-size:5rem; margin-bottom:0; letter-spacing:-2px;">MISSION</h1>
                <h1 style="font-family:'Orbitron'; font-size:6rem; margin-top:-20px; background:#000; color:#fff; padding:0 30px;">STAMMPLATZ</h1>
                <div style="width:200px; height:200px; border:8px solid #000; margin:50px 0; display:flex; align-items:center; justify-content:center;">
                    <i class="fas fa-star" style="font-size:6rem;"></i>
                </div>
                <h2 style="font-size:2.5rem; text-transform:uppercase; letter-spacing:10px; font-family:'Orbitron';">SAMMELALBUM</h2>
                <div style="font-weight:900; font-size:2rem; border-top:5px solid #000; padding-top:10px; font-family:'Orbitron';">EDITION: ${window.coachInfo.verein?.toUpperCase() || 'PRO'}</div>
                <p style="margin-top:120px; font-family:'Orbitron'; font-size:0.7rem; color:#666;">POWERED BY TONI 2.0 BIOMETRIC ENGINE</p>
            </div>
            <div class="no-print" style="text-align:center; margin-top:30px; padding-bottom:50px;">
                <button class="pro-btn-gold" onclick="window.print()">ALBUM COVER DRUCKEN</button>
                <button class="tactic-btn" onclick="window.SektorTemplates.render()">ZURÜCK ZUM STUDIO</button>
            </div>
        `;
    }
};
