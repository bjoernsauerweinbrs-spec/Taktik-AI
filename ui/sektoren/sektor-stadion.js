/**
 * TONI 2.0 - SEKTOR STADION (DYNAMISCHER MAGAZIN GENERATOR)
 * Version: 3.2 (Layout-Fix & Elite Sync)
 */
window.SektorStadion = {
    dynamicPages: [
        { 
            title: "INSIDE TACTICS: COACH'S CORNER", 
            content: `<div><h4 style="color: var(--neon-green);">DIE TAKTIK-VORSCHAU</h4><p style="font-size: 0.9rem; line-height: 1.6; color: #333;">"Wir erwarten heute einen Gegner, der extrem kompakt steht. Der Fokus liegt auf schnellem Umschaltspiel..."</p></div>` 
        },
        { 
            title: "DIE ELITE-ELF DES TAGES", 
            content: `<div class="mag-squad-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"><div style="border:1px solid #ddd; padding:5px; text-align:center; font-size:0.7rem;">SPIELER 1</div><div style="border:1px solid #ddd; padding:5px; text-align:center; font-size:0.7rem;">SPIELER 2</div><div style="border:1px solid #ddd; padding:5px; text-align:center; font-size:0.7rem;">SPIELER 3</div></div>` 
        },
        { 
            title: "UNSERE PREMIUM-PARTNER", 
            isSponsorPage: true,
            content: "" 
        }
    ],

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        
        // Layout-Reset für Stadion-Modus
        content.style.paddingBottom = "150px";
        content.style.background = "var(--panel-dark)";
        
        this.syncSponsors();
        this.render();
    },

    syncSponsors() {
        const sponsorPage = this.dynamicPages.find(p => p.isSponsorPage);
        if (!sponsorPage) return;

        const rawData = localStorage.getItem('toni_management_data');
        const data = rawData ? JSON.parse(rawData) : { sponsors: [] };

        if (!data.sponsors || data.sponsors.length === 0) {
            sponsorPage.content = `<p style="color: #888; text-align:center; border: 1px dashed #ccc; padding:20px;">Keine Partner im Management-Hub gefunden.</p>`;
        } else {
            let sponsorHTML = `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">`;
            data.sponsors.forEach(s => {
                sponsorHTML += `
                    <div style="border: 1px solid #eee; padding: 10px; text-align: center; border-radius:5px;">
                        <div style="font-weight: bold; color: #333; font-size: 0.8rem;">${s.name.toUpperCase()}</div>
                        <div style="color: var(--neon-green); font-size: 0.5rem;">${s.type || 'PARTNER'}</div>
                    </div>`;
            });
            sponsorHTML += `</div>`;
            sponsorPage.content = sponsorHTML;
        }
    },

    beamSnapshot(index) {
        if (!window.arena) return;
        const img = window.arena.getSnapshot();
        this.dynamicPages[index].content += `
            <div style="margin-top:15px; text-align:center; border: 1px solid #eee; padding:5px; background:#f9f9f9;">
                <img src="${img}" style="width:100%; display:block;">
                <p style="font-size:0.5rem; color:#999; margin-top:3px;">LIVE ARENA SNAPSHOT</p>
            </div>`;
        this.render();
        window.ToniVoice.speak("Taktik-Snapshot wurde in das Magazin übertragen.");
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        
        content.innerHTML = `
            <div class="magazine-editor-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--accent-gold); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--accent-gold); letter-spacing: 2px;">THE ELITE | MATCHDAY-PROGRAMM</h2>
                    <span style="color: var(--text-dim); font-size: 0.7rem;">PRO-EDITOR AKTIV</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="pro-btn-gold" style="padding: 10px 20px;" onclick="window.print()"><i class="fas fa-print"></i> PRINT</button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="magazine-viewport" style="display: flex; flex-direction: column; gap: 40px; align-items: center; width: 100%;">
                
                <div class="mag-page" style="width: 420px; height: 594px; background: #fff; color: #000; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="text-align:center; border: 5px solid #000; padding: 20px; height: 100%; display:flex; flex-direction:column; justify-content:space-between;">
                        <h1 style="font-size: 3rem; font-weight: 900; margin: 0;">MATCHDAY</h1>
                        <div style="flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                            <i class="fas fa-shield-halved" style="font-size: 6rem; color: #222; margin-bottom: 20px;"></i>
                            <h2 style="border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; width: 80%; text-transform:uppercase;">
                                ${window.coachInfo.verein || 'DEIN VEREIN'}
                            </h2>
                        </div>
                        <p style="font-weight: bold; letter-spacing: 2px;">OFFICIAL PROGRAMME 2026</p>
                    </div>
                </div>

                ${this.dynamicPages.map((page, index) => `
                    <div class="mag-page" style="width: 420px; height: 594px; background: #fff; color: #000; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden;">
                        <div class="ignore-print" style="position: absolute; right: 10px; top: 10px;">
                            <button class="tactic-btn" style="font-size: 0.6rem; padding: 5px 10px; background: var(--data-cyan); color:#000; border:none;" 
                                    onclick="window.SektorStadion.beamSnapshot(${index})">
                                <i class="fas fa-camera"></i> BOARD BEAM
                            </button>
                        </div>
                        <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; font-size: 1rem;">${page.title}</h3>
                        <div style="font-family: 'Times New Roman', serif;" contenteditable="true">
                            ${page.content}
                        </div>
                    </div>
                `).join('')}

                <div class="mag-page" style="width: 420px; height: 594px; background: #000; color: #fff; padding: 40px; border-radius: 4px; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <div>
                        <i class="fas fa-microchip" style="font-size: 5rem; color: var(--neon-green); margin-bottom: 20px;"></i>
                        <h1 style="letter-spacing: 8px;">TONI 2.0</h1>
                        <p style="color: var(--accent-gold); font-size: 0.8rem; letter-spacing: 3px;">POWERED BY ELITE AI</p>
                    </div>
                </div>

            </div>
        `;
    }
};
