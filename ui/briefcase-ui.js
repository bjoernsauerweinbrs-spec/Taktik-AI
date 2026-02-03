window.BriefcaseUI = {
    // ... (init, toggle, backToNav bleiben wie im Ist-Zustand gesichert)

    openFIFAcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        // Falls Werte fehlen, Standard setzen
        const pac = p.pace || 50;
        const sho = p.shooting || 50;
        const pas = p.passing || 50;
        const gin = p.ginga || 50;
        const def = p.defense || 50;
        const sta = p.stamina || 50;

        document.getElementById('active-content').innerHTML = `
            <div class="fifa-card-layout" style="display: flex; gap: 40px; background: #0a0a0a; padding: 30px; border-radius: 20px; border: 1px solid #333;">
                
                <div class="card-visual" style="width: 260px; height: 380px; background: linear-gradient(145deg, #d4af37, #b8860b); border-radius: 15px; padding: 20px; color: #111; position: relative; box-shadow: 0 0 20px rgba(212,175,55,0.3); font-family: 'DIN Condensed', sans-serif;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div id="card-rating" style="font-size: 4.5rem; font-weight: 900; line-height: 1;">${p.rating || 80}</div>
                        <div id="card-pos" style="font-size: 1.5rem; font-weight: bold; margin-top: -5px; text-transform: uppercase;">${p.pos || 'IV'}</div>
                        
                        <div style="width: 140px; height: 140px; background: rgba(0,0,0,0.1); border-radius: 50%; margin: 15px 0; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="font-size: 5rem; color: rgba(0,0,0,0.2);"></i>
                        </div>
                        
                        <div id="card-name" style="font-size: 1.8rem; font-weight: 900; text-transform: uppercase; border-bottom: 2px solid rgba(0,0,0,0.1); width: 100%; text-align: center; padding-bottom: 5px;">${p.name}</div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; width: 100%; margin-top: 15px; font-size: 1.2rem; font-weight: bold; line-height: 1.2;">
                            <div style="padding-left: 20px;">
                                <div id="v-pac">${pac} PAC</div>
                                <div id="v-sho">${sho} SHO</div>
                                <div id="v-pas">${pas} PAS</div>
                            </div>
                            <div style="border-left: 2px solid rgba(0,0,0,0.1); padding-left: 20px;">
                                <div id="v-gin">${gin} GIN</div>
                                <div id="v-def">${def} DEF</div>
                                <div id="v-sta">${sta} STA</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 15px;">
                    <h2 style="color:var(--accent-orange); margin:0;">ATTRIBUT-EDITOR</h2>
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label>GESCHWINDIGKEIT (PAC)</label><input type="range" id="r-pac" min="10" max="99" value="${pac}" oninput="BriefcaseUI.liveSync('${id}')">
                            <label>SCHIESSEN (SHO)</label><input type="range" id="r-sho" min="10" max="99" value="${sho}" oninput="BriefcaseUI.liveSync('${id}')">
                            <label>PASSEN (PAS)</label><input type="range" id="r-pas" min="10" max="99" value="${pas}" oninput="BriefcaseUI.liveSync('${id}')">
                        </div>
                        <div>
                            <label>GINGA / TECHNIK (GIN)</label><input type="range" id="r-gin" min="10" max="99" value="${gin}" oninput="BriefcaseUI.liveSync('${id}')">
                            <label>DEFENSIVE (DEF)</label><input type="range" id="r-def" min="10" max="99" value="${def}" oninput="BriefcaseUI.liveSync('${id}')">
                            <label>AUSDAUER (STA)</label><input type="range" id="r-sta" min="10" max="99" value="${sta}" oninput="BriefcaseUI.liveSync('${id}')">
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,59,48,0.1); padding: 15px; border-radius: 10px; border: 1px solid #ff3b30; display: flex; justify-content: space-between; align-items: center;">
                        <b>❤️ LIVE PULS ÜBERWACHUNG</b>
                        <input type="number" id="r-pulse" value="${p.pulse || 70}" style="width:80px; background:#000; color:#fff; border:1px solid #444; text-align:center; font-size: 1.2rem;" onchange="BriefcaseUI.liveSync('${id}')">
                    </div>

                    <button class="login-btn" style="height: 60px; background: var(--accent-orange); color:#000; font-size: 1.2rem;" onclick="BriefcaseUI.renderSporttasche()">FERTIG & SPEICHERN</button>
                </div>
            </div>
        `;
    },

    liveSync(id) {
        // Werte aus den Reglern lesen
        const pac = document.getElementById('r-pac').value;
        const sho = document.getElementById('r-sho').value;
        const pas = document.getElementById('r-pas').value;
        const gin = document.getElementById('r-gin').value;
        const def = document.getElementById('r-def').value;
        const sta = document.getElementById('r-sta').value;
        const pulse = document.getElementById('r-pulse').value;

        // Visualisierung auf der Karte links aktualisieren
        document.getElementById('v-pac').innerText = pac + " PAC";
        document.getElementById('v-sho').innerText = sho + " SHO";
        document.getElementById('v-pas').innerText = pas + " PAS";
        document.getElementById('v-gin').innerText = gin + " GIN";
        document.getElementById('v-def').innerText = def + " DEF";
        document.getElementById('v-sta').innerText = sta + " STA";

        // Rating berechnen (Durchschnitt)
        const rating = Math.round((parseInt(pac) + parseInt(sho) + parseInt(pas) + parseInt(gin) + parseInt(def) + parseInt(sta)) / 6);
        document.getElementById('card-rating').innerText = rating;

        // In Datenbank speichern
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            players[i].pace = pac; players[i].shooting = sho; players[i].passing = pas;
            players[i].ginga = gin; players[i].defense = def; players[i].stamina = sta;
            players[i].pulse = pulse; players[i].rating = rating;
            localStorage.setItem('toni_players', JSON.stringify(players));
            
            // Puls-Check für Toni
            if(pulse > 160 && window.ToniAI) {
                window.ToniAI.addChatMessage("Toni", `Coach Björn! Puls-Alarm bei ${players[i].name}!`, "bot-msg");
            }
        }
    },
    // ... restliche Funktionen bleiben erhalten
};
