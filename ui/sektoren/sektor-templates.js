/**
 * TONI 2.0 - MATCHDAY MAGAZINE ENGINE
 * Professionelles Stadionheft-Template (DIN A5 Layout)
 */
window.SektorTemplates = {
    // Standard-Daten für das Muster-Heft
    magazineData: {
        clubName: "FC TONI 2.0",
        opponent: "FC Bayern München",
        matchDate: "08. Februar 2026",
        stadium: "Ginga Arena",
        coachName: "Björn", // Wird normalerweise aus dem User-Profil gezogen
        logoUrl: "https://via.placeholder.com/100/39FF14/000000?text=T2.0",
        sponsors: [
            { id: 1, name: "Neon Energy Drink", logo: "⚡" },
            { id: 2, name: "Ginga Sports Gear", logo: "⚽" }
        ]
    },

    render: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; margin-bottom:30px; border:1px dashed var(--neon-green);">
                    <h3 style="font-size:0.8rem; color:var(--neon-green); margin-bottom:15px;">EDITOR-MODUS</h3>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.7rem;" onclick="SektorTemplates.editClubInfo()">VEREINSDATEN ÄNDERN</button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.7rem; background:var(--accent-gold);" onclick="SektorTemplates.addSponsor()">SPONSOR HINZUFÜGEN</button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; font-size:0.7rem; background:#fff; color:#000;" onclick="window.print()">ALS PDF DRUCKEN</button>
                    </div>
                </div>

                <div id="magazine-preview" style="background:#fff; color:#000; width:100%; max-width:500px; margin:0 auto; padding:40px; box-shadow:0 0 50px rgba(0,0,0,0.5); min-height:700px; position:relative;">
                    
                    <div style="text-align:center; border: 5px solid #000; padding:20px; position:relative;">
                        <div style="background:#000; color:var(--neon-green); display:inline-block; padding:5px 15px; font-weight:900; position:absolute; top:-15px; left:50%; transform:translateX(-50%);">MATCHDAY</div>
                        <img src="${this.magazineData.logoUrl}" style="width:80px; margin:20px 0;">
                        <h1 style="font-size:2.5rem; margin:10px 0; font-family:'Inter Black', sans-serif;">${this.magazineData.clubName}</h1>
                        <p style="font-weight:bold; letter-spacing:2px;">vs. ${this.magazineData.opponent}</p>
                    </div>

                    <div style="margin-top:40px;">
                        <h3 style="border-bottom:2px solid #000; padding-bottom:5px; font-size:1.1rem;">DAS WORT VOM COACH</h3>
                        <p style="font-size:0.85rem; line-height:1.5; margin-top:10px; font-style:italic;">
                            "Herzlich Willkommen in der ${this.magazineData.stadium}! Heute gegen ${this.magazineData.opponent} zählt nur volle Konzentration. Wir haben die Tiefenanalyse genutzt, um uns perfekt vorzubereiten. Ginga-Style auf dem Platz!"
                        </p>
                        <p style="text-align:right; font-weight:900; margin-top:5px;">– Coach ${this.magazineData.coachName}</p>
                    </div>

                    <div style="margin-top:50px; border-top:1px solid #ddd; padding-top:20px;">
                        <p style="font-size:0.6rem; color:#888; text-align:center; margin-bottom:10px;">UNSERE PARTNER</p>
                        <div style="display:flex; justify-content:center; gap:20px;">
                            ${this.magazineData.sponsors.map(s => `
                                <div style="text-align:center;">
                                    <div style="font-size:1.5rem;">${s.logo}</div>
                                    <div style="font-size:0.5rem; font-weight:bold;">${s.name}</div>
                                    <button class="hidden-print" onclick="SektorTemplates.removeSponsor(${s.id})" style="font-size:0.5rem; color:red; border:none; background:none; cursor:pointer;">Löschen</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="position:absolute; bottom:20px; left:0; width:100%; text-align:center; font-size:0.6rem; color:#aaa;">
                        Erstellt mit TONI 2.0 Performance Engine | ${this.magazineData.matchDate}
                    </div>
                </div>
            </div>`;
    },

    editClubInfo: function() {
        const newName = prompt("Vereinsname ändern:", this.magazineData.clubName);
        const newOpponent = prompt("Gegner ändern:", this.magazineData.opponent);
        if(newName) this.magazineData.clubName = newName;
        if(newOpponent) this.magazineData.opponent = newOpponent;
        this.render();
    },

    addSponsor: function() {
        const sName = prompt("Name des Sponsors:");
        if(sName) {
            this.magazineData.sponsors.push({
                id: Date.now(),
                name: sName,
                logo: "🏢"
            });
            this.render();
        }
    },

    removeSponsor: function(id) {
        this.magazineData.sponsors = this.magazineData.sponsors.filter(s => s.id !== id);
        this.render();
    }
};
