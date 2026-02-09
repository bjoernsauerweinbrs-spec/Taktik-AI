/**
 * TONI 2.0 - SEKTOR STADIONZEITUNG
 * Fokus: Automatisches Layout & Toni 2.0 Branding
 */
window.SektorStadionzeitung = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const starPlayer = window.Database.players.find(p => p.isNewspaperStar) || window.Database.players[0];
        const sponsor = window.SponsorPool.find(s => s.id === starPlayer.sponsorId);

        content.innerHTML = `
            <div style="padding: 20px; color: #fff; font-family: 'Inter', sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="color:var(--neon-green); margin:0;">STADIONZEITUNG GEN</h2>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div id="magazine-preview" style="display: flex; gap: 30px; overflow-x: auto; padding-bottom: 20px;">
                    
                    <div style="min-width: 300px; height: 420px; background: #000; border: 4px solid var(--neon-green); position: relative; overflow: hidden;">
                        <div style="background: var(--neon-green); color: #000; padding: 10px; font-weight: 900; text-align: center; font-size: 1.2rem;">MATCHDAY MAG</div>
                        <div style="text-align: center; margin-top: 20px;">
                            ${starPlayer.img ? `<img src="${starPlayer.img}" style="width:180px; height:180px; object-fit:cover; border-radius:10px; border:2px solid #fff;">` : '<i class="fas fa-user-ninja" style="font-size:5rem; color:#333;"></i>'}
                        </div>
                        <div style="padding: 20px; text-align: center;">
                            <h1 style="margin:0; font-size:1.8rem; text-transform:uppercase;">${starPlayer.name}</h1>
                            <p style="color:var(--neon-green); font-weight:bold;">DER STAR DES TAGES</p>
                            <div style="font-size: 0.8rem; color: #888;">PAC: ${starPlayer.pac} | SHO: ${starPlayer.sho} | RAT: ${starPlayer.rat}</div>
                        </div>
                        <div style="position:absolute; bottom:10px; width:100%; text-align:center; font-size:0.6rem; color:#555;">AUSGABE: ${new Date().toLocaleDateString()}</div>
                    </div>

                    <div style="min-width: 300px; height: 420px; background: #111; border: 1px solid #333; padding: 20px;">
                        <h3 style="border-bottom: 1px solid var(--neon-green); padding-bottom: 5px;">PLAYER SPONSOR</h3>
                        <div style="background: #000; padding: 15px; border-radius: 8px; text-align: center; margin-top: 10px;">
                            <div style="font-size: 2rem;">${sponsor ? sponsor.logo : '🤝'}</div>
                            <div style="font-weight: bold; margin-top: 5px;">${sponsor ? sponsor.name : 'Kein Sponsor'}</div>
                        </div>
                        <h3 style="border-bottom: 1px solid var(--neon-green); padding-bottom: 5px; margin-top: 30px;">TRAINER-NOTE</h3>
                        <p style="font-size: 0.8rem; font-style: italic; color: #ccc;">
                            "${starPlayer.name} zeigt aktuell überragende Leistungen im Training. Besonders seine Physis von ${starPlayer.phy} wird heute den Unterschied machen."
                        </p>
                    </div>

                    <div style="min-width: 300px; height: 420px; background: linear-gradient(135deg, #000 0%, #051205 100%); border: 4px solid var(--data-cyan); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px;">
                        <div style="color: var(--data-cyan); font-size: 2.5rem; font-weight: 900; margin-bottom: 10px;">TONI 2.0</div>
                        <div style="background: var(--data-cyan); color: #000; padding: 5px 15px; font-weight: bold; margin-bottom: 20px;">THE FUTURE OF COACHING</div>
                        <p style="font-size: 0.7rem; color: #fff;">Analysiere. Trainiere. Gewinne.</p>
                        <div style="margin-top: 40px; border: 1px solid rgba(0,255,255,0.3); padding: 10px; font-size: 0.5rem; color: #444;">
                            ADVERTISEMENT | POWERED BY ARTIFICIAL INTELLIGENCE
                        </div>
                    </div>

                </div>

                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="tactic-btn" onclick="alert('PDF wird generiert...')">ZEITUNG EXPORTIEREN</button>
                    <button class="tactic-btn" style="background:#333;" onclick="window.SektorStadionzeitung.render()">VORSCHAU AKTUALISIEREN</button>
                </div>
            </div>
        `;
    }
};
