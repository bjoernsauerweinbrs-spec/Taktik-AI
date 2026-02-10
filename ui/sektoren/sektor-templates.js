/**
 * TONI 2.0 - TEMPLATE & MEDIA HUB (PRO-EDITION)
 * Fokus: Matchday Magazine & Mission Stammplatz (Sticker-Studio).
 */
window.SektorTemplates = {
    activeTab: 'magazine', // Standard-Ansicht

    render: function() {
        const content = document.getElementById('active-content');
        if (!content) return;

        content.innerHTML = `
            <style>
                @media print { .no-print { display: none !important; } }
                .magazine-container { background: #fff; color: #000; width: 210mm; margin: 0 auto; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
                .page-break { page-break-after: always; }
                .tab-btn { padding: 10px 20px; border: none; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem; transition: 0.3s; background: rgba(255,255,255,0.05); color: #666; }
                .tab-btn.active { background: var(--neon-green); color: #000; font-weight: bold; }
            </style>

            <div style="padding:30px; color: #fff; height: 82vh; overflow-y: auto;">
                
                <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <div style="display:flex; gap:10px; background:#000; padding:5px; border-radius:8px; border:1px solid #333;">
                        <button class="tab-btn ${this.activeTab === 'magazine' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('magazine')">MATCHDAY MAGAZINE</button>
                        <button class="tab-btn ${this.activeTab === 'stammplatz' ? 'active' : ''}" onclick="window.SektorTemplates.switchTab('stammplatz')">MISSION STAMMPLATZ</button>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="login-btn" onclick="window.SektorTemplates.render()" style="background: rgba(255,255,255,0.05); color: #fff;">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                        <button class="login-btn" onclick="window.print()" style="background: var(--accent-orange); color: #fff; font-weight:900;">
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
     * TEIL 1: DAS KLASSISCHE MATCHDAY MAGAZINE
     */
    renderMagazine: function() {
        const players = window.Database ? window.Database.players : [];
        const coach = window.BriefcaseUI?.clubData || { name: "Coach", verein: "Pro Club" };
        const starPlayer = players.find(p => p.isNewspaperStar) || players[0] || { name: "Toni Test", rat: 80, pac: 90 };
        const starters = players.filter(p => p.assignment === 'both').slice(0, 11);
        const starSponsor = window.SponsorPool ? window.SponsorPool.find(s => s.id === starPlayer.sponsorId) : null;

        return `
            <div class="magazine-container">
                <div class="print-page page-break" style="height:297mm; padding:40px; position:relative; border: 15px solid #000; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="text-align:left;">
                        <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: 5px; color: #666;">OFFICIAL PROGRAMME</div>
                        <h1 style="font-size: 5rem; font-weight: 900; margin: 10px 0; line-height: 0.85; letter-spacing: -3px; color:#000;">${coach.name.toUpperCase()}</h1>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction:column; align-items: center; justify-content: center; position:relative;">
                         <div style="position:absolute; top:0; left:0; background:#000; color:#fff; padding:10px 20px; font-weight:900; font-size:1.5rem;">TOP STAR</div>
                         ${starPlayer.img ? `<img src="${starPlayer.img}" style="width: 80%; border: 10px solid #000; filter: grayscale(1) contrast(1.2);">` : `<div style="width:300px; height:400px; background:#eee; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user-ninja" style="font-size:10rem; color:#ddd;"></i></div>`}
                         <div style="font-size: 4rem; font-weight: 900; margin-top: -20px; background: #000; color: #fff; padding: 0 30px; text-transform:uppercase;">${starPlayer.name.split(' ').pop()}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 10px solid #000; padding-top: 30px; color:#000;">
                        <div>
                            <div style="font-size: 2rem; font-weight: 900;">${starSponsor ? starSponsor.name.toUpperCase() : 'MAIN PARTNER'}</div>
                            <div style="font-size: 0.8rem; color: #555; font-weight: bold; letter-spacing: 2px;">MATCHDAY REPORT 2026</div>
                        </div>
                        <div style="text-align: center; border: 2px solid #000; padding: 10px;">
                            <div style="font-size: 0.7rem; font-weight: 900;">RATING</div>
                            <div style="font-size: 2rem; font-weight: 900;">${starPlayer.rat}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * TEIL 2: MISSION STAMMPLATZ STUDIO
     */
    renderStammplatz: function() {
        const players = window.Database ? window.Database.players : [];
        const coach = window.BriefcaseUI?.clubData || { name: "Coach", verein: "Pro Club" };

        return `
            <div style="display: grid; grid-template-columns: 1fr 300px; gap: 30px;">
                <div>
                    <div style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:30px; border-radius:15px; text-align:center; margin-bottom:30px;">
                        <h3 style="font-family:'Orbitron'; color:var(--accent-gold); margin-bottom:15px;">STICKER-GENERATOR</h3>
                        <p style="font-size:0.8rem; color:#888;">Hier werden die monatlichen Sammelbilder für dein Team erstellt.</p>
                        <button class="pro-btn-gold" onclick="window.SektorTemplates.printStickers()" style="margin-top:20px;">STICKER-SHEET GENERIEREN</button>
                    </div>

                    <div id="sticker-preview-area" class="magazine-container" style="padding:40px; min-height:297mm; display:none;">
                        </div>
                </div>

                <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:12px; border:1px solid #333; height:fit-content;">
                    <h4 style="font-size:0.7rem; color:var(--accent-gold); letter-spacing:2px; margin-bottom:15px;">INFO</h4>
                    <p style="font-size:0.75rem; color:#aaa; line-height:1.4;">
                        Die Sticker ziehen sich automatisch die Fortschritte aus dem <strong>Analyse-Zentrum</strong>.<br><br>
                        Spieler mit hohem Fleiß-Faktor erhalten einen goldenen Rahmen.
                    </p>
                    <hr style="border:0; border-top:1px solid #333; margin:15px 0;">
                    <button class="tactic-btn" style="width:100%;" onclick="window.SektorTemplates.printAlbum()">LEERES ALBUM DRUCKEN</button>
                </div>
            </div>
        `;
    },

    printStickers: function() {
        const players = window.Database ? window.Database.players : [];
        const area = document.getElementById('sticker-preview-area');
        area.style.display = 'block';
        
        area.innerHTML = `
            <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:30px;">
                <h2 style="margin:0; font-family:'Orbitron';">MISSION STAMMPLATZ: MONATS-STICKER</h2>
                <small>AUSGABE: FEBRUAR 2026 | ${window.BriefcaseUI.clubData.name}</small>
            </div>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px;">
                ${players.map(p => {
                    const isElite = p.rat >= 85;
                    const borderColor = isElite ? '#ffcc00' : '#000';
                    return `
                        <div style="border:3px solid ${borderColor}; padding:15px; text-align:center; background:#fff; position:relative; box-shadow: 2px 2px 0 ${borderColor};">
                            <div style="width:80px; height:80px; background:#eee; margin:0 auto; border-radius:50%; border:2px solid ${borderColor}; overflow:hidden;">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja" style="font-size:2rem; margin-top:20px; color:#ccc;"></i>`}
                            </div>
                            <div style="font-weight:900; margin-top:10px; font-size:0.9rem; text-transform:uppercase;">${p.name.split(' ').pop()}</div>
                            <div style="font-size:0.6rem; font-weight:bold; color:${isElite ? '#ffcc00' : '#666'};">LEVEL: ${isElite ? 'ELITE' : 'TOP TALENT'}</div>
                            <div style="margin-top:8px; border-top:1px solid #eee; padding-top:5px; font-size:0.5rem; font-style:italic;">"Super Einsatz im Training!"</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        if(window.ToniVoice) window.ToniVoice.speak("Die Sticker wurden generiert. Du kannst sie jetzt auf A4 ausdrucken.");
    },

    printAlbum: function() {
        const area = document.getElementById('sticker-preview-area');
        area.style.display = 'block';
        area.innerHTML = `
            <div style="border:10px solid #000; height:260mm; padding:40px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center;">
                <h1 style="font-size:4rem; font-weight:900; margin:0;">MISSION STAMMPLATZ</h1>
                <div style="width:100%; border:2px dashed #ccc; height:300px; display:flex; align-items:center; justify-content:center; color:#ccc; font-size:2rem;">TEAM-FOTO HIER</div>
                <div>
                    <h2 style="font-size:2rem;">MEIN SAMMELALBUM 2026</h2>
                    <p style="font-weight:bold; letter-spacing:3px;">${window.BriefcaseUI.clubData.name.toUpperCase()}</p>
                </div>
                <div style="background:#000; color:#fff; padding:20px; width:100%;">POWERED BY TONI 2.0</div>
            </div>
        `;
        window.print();
    }
};
