/**
 * TONI 2.0 - TEMPLATE & MEDIA HUB (PRO-EDITION)
 * Fokus: Panini-Style Sticker-Studio & Stadionzeitung
 * Status: MASTER-SYNC 2026 - FINAL RECOVERY
 */
window.SektorTemplates = {
    activeTab: 'magazine', 

    /**
     * ROUTER-ANSCHLUSS
     */
    open: function() {
        this.render();
    },

    /**
     * Tab-Umschaltung
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
                    .sticker-sheet { border: 1px dashed #ccc !important; }
                }
                .magazine-container { background: #fff; color: #000; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.8); font-family: 'Inter', sans-serif; }
                .tab-btn { padding: 10px 20px; border: none; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; transition: 0.3s; background: rgba(255,255,255,0.05); color: #888; border-radius: 4px; border: 1px solid #333; }
                .tab-btn.active.mag { border-color: var(--data-cyan); color: var(--data-cyan); background: rgba(0, 209, 255, 0.1); }
                .tab-btn.active.stk { border-color: var(--neon-green); color: var(--neon-green); background: rgba(57, 255, 20, 0.1); }
                
                /* PANINI STYLE STICKER CSS */
                .panini-sticker { 
                    width: 55mm; height: 75mm; background: #fff; border: 4px solid #fff; 
                    box-shadow: 0 0 0 1px #ddd, 3px 3px 10px rgba(0,0,0,0.1); 
                    position: relative; overflow: hidden; display: inline-block; margin: 10px;
                    border-radius: 2px;
                }
                .panini-inner { border: 2px solid #00529b; height: calc(100% - 4px); position: relative; padding: 5px; }
                .panini-inner.gold { border-color: #d4af37; background: linear-gradient(135deg, #fff 0%, #fff7e6 100%); }
                .glitter-fx { 
                    position: absolute; top:0; left:0; width:100%; height:100%; 
                    background: url('https://www.transparenttextures.com/patterns/stardust.png'); 
                    opacity: 0.15; pointer-events: none; 
                }
                .sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 20px; justify-items: center; background:#fff; }
            </style>

            <div class="fadeIn" style="padding:10px 30px 30px 30px; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px;">
                    <div style="display:flex; gap:10px; padding:5px; border-radius:8px;">
                        <button class="tab-btn mag ${this.activeTab === 'magazine' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('magazine')">📰 STADIONZEITUNG</button>
                        <button class="tab-btn stk ${this.activeTab === 'stammplatz' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('stammplatz')">🖼️ MISSION STAMMPLATZ</button>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" onclick="window.print()" style="font-size:0.7rem;">
                            <i class="fas fa-print"></i> JETZT DRUCKEN
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
     * STADIONZEITUNG
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
                                "${coach}: Bereit für den nächsten Heimsieg!"
                            </p>
                        </div>
                    </div>

                    <div style="background:#000; color:#fff; padding:30px; display:grid; grid-template-columns: repeat(2, 1fr); gap:15px;">
                        <div style="grid-column: 1/-1; border-bottom:2px solid var
