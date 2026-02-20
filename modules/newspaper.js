/* ==========================================================
   NEWSPAPER MODUL - TONI 2.0 PRINT ENGINE
   ========================================================== */

const newspaper = {
    open: function() {
        const pages = parseInt(document.getElementById('news-pages').value);
        this.generate(pages);
        document.getElementById('newspaper-overlay').style.display = 'block';
        addMessage("Toni", `Stadionzeitung mit ${pages} Seiten wurde für den Druck optimiert.`);
    },

    close: function() {
        document.getElementById('newspaper-overlay').style.display = 'none';
    },

    generate: function(pageCount) {
        const container = document.getElementById('printable-newspaper');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const mgmtData = JSON.parse(localStorage.getItem('toni_mgmt')) || {};
        
        container.innerHTML = "";

        // Logik für 4, 8, 12 Seiten
        const sheetCount = pageCount / 4;
        
        for (let i = 0; i < sheetCount; i++) {
            const sheet = document.createElement('div');
            sheet.className = "a4-sheet";
            
            // Beispiel für Blatt 1 (Vorderseite: Seite 4 und Seite 1)
            if (i === 0) {
                sheet.innerHTML = `
                    <div class="a5-page">${this.renderSponsors(mgmtData)}</div>
                    <div class="a5-page">${this.renderCover(mgmtData)}</div>
                `;
            } else if (i === 1 && pageCount >= 8) {
                sheet.innerHTML = `
                    <div class="a5-page">${this.renderTactics()}</div>
                    <div class="a5-page">${this.renderPlayer(players[0])}</div>
                `;
            } else {
                sheet.innerHTML = `
                    <div class="a5-page"><h3>Zusammenfassung</h3><p>Toni 2.0 Elite Analyse...</p></div>
                    <div class="a5-page"><h3>Turnier-Plan</h3><p>Muster-Spielplan für Trainer.</p></div>
                `;
            }
            container.appendChild(sheet);
        }
    },

    renderCover: function(data) {
        return `
            <div class="news-header">
                <img src="${data.clubLogo}" style="height:50px;">
                <h1 class="news-title">${data.clubName}</h1>
                <p style="font-size:10px;">AUSGABE: ${new Date().toLocaleDateString()}</p>
            </div>
            <h2 style="font-size:24px; line-height:1.1;">Elite-Update: Toni 2.0 übernimmt das Kommando</h2>
            <img class="news-photo" src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop">
            <p style="font-size:12px; line-height:1.4;">${data.newsDraft.substring(0, 200)}...</p>
            <div style="position:absolute; bottom:15mm; width:calc(100% - 30mm); border-top:1px solid #000; padding-top:5px; font-size:10px;">
                Heute im Stadion: ${data.clubName} vs. Team Alpha
            </div>
        `;
    },

    renderSponsors: function(data) {
        return `
            <h3 style="text-align:center; border-bottom:1px solid #000;">UNSERE PARTNER</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px;">
                <div style="border:1px solid #ccc; padding:10px; text-align:center;">CyberFit<br><small>Elite Wearables</small></div>
                <div style="border:1px solid #ccc; padding:10px; text-align:center;">EliteHydro<br><small>Sport Nutrition</small></div>
                <div style="border:1px solid #ccc; padding:10px; text-align:center;">Sauerwein<br><small>Coaching Pro</small></div>
                <div style="border:1px solid #ccc; padding:10px; text-align:center;">QuestVR<br><small>Cognitive Training</small></div>
            </div>
            <div style="position:absolute; bottom:15mm; text-align:center; width:calc(100% - 30mm); font-size:9px;">
                Impressum: Erstellt mit Toni 2.0 Elite System. Keine Haftung für Druckfehler.
            </div>
        `;
    },

    renderPlayer: function(p) {
        if(!p) return "<h3>Spieler im Fokus</h3><p>Noch kein Spieler angelegt.</p>";
        return `
            <h3 style="border-bottom:2px solid #000;">SPIELER IM FOKUS</h3>
            <div style="display:flex; gap:15px; margin-top:10px;">
                <div style="width:80px; height:80px; background:#eee; border-radius:50%; overflow:hidden;">
                    ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : '👤'}
                </div>
                <div>
                    <h4 style="margin:0;">${p.name}</h4>
                    <p style="font-size:12px;">Position: ${p.pos}<br>Rating: ${p.rating}</p>
                </div>
            </div>
            <p style="font-size:11px; margin-top:15px;">Toni Analyse: ${p.name} zeigt im VR-Training überdurchschnittliche Scan-Werte. Seine Physis (PHY: ${p.stats[5]}) macht ihn zum Schlüsselspieler.</p>
        `;
    },

    renderTactics: function() {
        return `
            <h3 style="border-bottom:2px solid #000;">TAKTIK-CHECK</h3>
            <div style="width:100%; height:150px; background:#15803d; border:2px solid #000; position:relative; margin-top:10px;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); border:1px solid white; width:40px; height:40px; border-radius:50%;"></div>
                <div style="position:absolute; top:0; left:50%; width:1px; height:100%; background:white;"></div>
            </div>
            <p style="font-size:11px; margin-top:10px;">Wir agieren heute in einer kompakten Grundordnung. Toni empfiehlt aggressives Pressing in der gegnerischen Zone.</p>
        `;
    }
};
