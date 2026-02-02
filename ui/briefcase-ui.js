/**
 * =========================================
 * TONI 2.0 – BRIEFCASE UI (MASTER)
 * Verwaltung von Kader, Bio-Daten & Redaktion
 * =========================================
 */

(function() {
    window.BriefcaseUI = {
        kader: [],

        // Lädt den Kader aus dem Speicher oder nutzt Start-Werte
        initKader() {
            const saved = localStorage.getItem('toni2_kader');
            if (saved) {
                this.kader = JSON.parse(saved);
            } else {
                this.kader = [
                    { id: 1, name: "David Luiz", number: 4, rating: 8, hr: 65, sleep: "7.5h", status: "Bereit", pos: "IV", x: 250, y: 350, team: 'home' },
                    { id: 2, name: "Max Miller", number: 10, rating: 6, hr: 72, sleep: "5.0h", status: "Müde", pos: "OM", x: 450, y: 300, team: 'home' }
                ];
                this.saveKader();
            }
        },

        saveKader() {
            localStorage.setItem('toni2_kader', JSON.stringify(this.kader));
        },

        // Erstellt einen neuen Spieler für die Sporttasche
        addPlayer() {
            const name = document.getElementById('new-player-name').value;
            const num = document.getElementById('new-player-num').value;
            const pos = document.getElementById('new-player-pos').value;

            if(!name || !num) return alert("Bitte Name und Nummer eingeben!");

            const newP = {
                id: Date.now(),
                name: name,
                number: num,
                pos: pos,
                rating: 5,
                hr: 70,
                sleep: "8h",
                status: "Bereit",
                x: 100 + (Math.random() * 300),
                y: 100 + (Math.random() * 300),
                team: 'home'
            };

            this.kader.push(newP);
            this.saveKader();
            this.renderSport(); // Ansicht aktualisieren
        },

        // Sektor: Sporttasche (Kader-Management)
        renderSport() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn">
                    <h2 style="color:var(--accent-orange); margin-bottom:10px;">👟 Sporttasche: Kader & Training</h2>
                    
                    <div style="background:rgba(255,106,0,0.1); padding:20px; border-radius:15px; margin: 20px 0; display:flex; gap:12px; border:1px solid rgba(255,106,0,0.2);">
                        <input id="new-player-name" type="text" placeholder="Name" style="background:#0B1220; color:white; border:1px solid #333; padding:10px; border-radius:8px; flex:2;">
                        <input id="new-player-num" type="number" placeholder="Nr." style="background:#0B1220; color:white; border:1px solid #333; padding:10px; border-radius:8px; flex:1;">
                        <select id="new-player-pos" style="background:#0B1220; color:white; border:1px solid #333; padding:10px; border-radius:8px;">
                            <option>IV</option><option>ZM</option><option>ST</option><option>TW</option><option>AV</option>
                        </select>
                        <button onclick="BriefcaseUI.addPlayer()" style="background:var(--accent-orange); color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">HINZUFÜGEN</button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        ${this.kader.map(p => `
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <strong style="font-size:14px;">#${p.number} ${p.name}</strong><br>
                                    <small style="color:var(--data-cyan);">${p.pos} // Form: ${p.rating}/10</small>
                                </div>
                                <button onclick="BriefcaseUI.toBoard(${p.id})" style="background:var(--success-green); border:none; color:white; padding:8px 15px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:11px;">AUFS FELD</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // Sektor: Medical Hub (Bio-Metriken)
        renderMedical() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn">
                    <h2 style="color:var(--data-cyan); margin-bottom:20px;">⌚ Medical Hub: Bio-Daten</h2>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                        ${this.kader.map(p => `
                            <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; text-align:center; border:1px solid rgba(0,209,255,0.1);">
                                <div style="font-weight:bold; margin-bottom:10px;">${p.name}</div>
                                <div style="font-size:24px; color:var(--data-cyan);">${p.hr} <small style="font-size:10px;">BPM</small></div>
                                <div style="font-size:11px; color:var(--text-muted); margin-top:5px;">Schlaf: ${p.sleep}</div>
                                <div style="font-size:10px; margin-top:10px; color:${p.status === 'Bereit' ? 'var(--success-green)' : 'var(--accent-orange)'};">● ${p.status.toUpperCase()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // Sektor: Geschäftszimmer (Anbindung Stadionzeitung)
        renderOrga() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn" style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                    <div>
                        <h2 style="color:#FFD166; margin-bottom:15px;">🏢 Geschäftszimmer: Redaktion</h2>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:10px;">
                            <div onclick="window.Stadionzeitung.render()" style="background:white; color:#1a1a1a; padding:35px; border-radius:15px; cursor:pointer; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                                <div style="font-size:45px; margin-bottom:15px;">📰</div>
                                <strong style="font-size:16px;">STADIONZEITUNG</strong><br>
                                <small style="font-weight:normal; opacity:0.7;">Matchday-Programm bearbeiten</small>
                            </div>
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:35px; border-radius:15px; text-align:center; opacity:0.5;">
                                <div style="font-size:45px; margin-bottom:15px;">💰</div>
                                <strong style="font-size:16px;">SPONSOREN</strong><br>
                                <small style="font-weight:normal;">Demnächst verfügbar</small>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background:rgba(255,106,0,0.1); border:1px solid var(--accent-orange); padding:25px; border-radius:20px;">
                        <h4 style="color:var(--accent-orange); font-size:13px; letter-spacing:1px; margin-bottom:15px;">TONI REDAKTEUR-MODUS</h4>
                        <p style="font-size:12px; line-height:1.6;">
                            Björn, für die heutige Ausgabe empfehle ich eine Taktik-Analyse basierend auf dem <b>${arena.mode.toUpperCase()}</b> Modus. Ich habe bereits einen Entwurf für dich vorbereitet.
                        </p>
                        <button class="tool-btn" style="width:100%; margin-top:20px; border-color:var(--accent-orange); color:var(--accent-orange);" onclick="Stadionzeitung.addBlock('toni-tip')">VORSCHLAG ÜBERNEHMEN</button>
                    </div>
                </div>
            `;
            // Sicherstellen, dass die Zeitung initialisiert ist
            if (window.Stadionzeitung) window.Stadionzeitung.init();
        },

        // Spieler auf das Board schicken
        toBoard(id) {
            const player = this.kader.find(p => p.id === id);
            if (!arena.players.find(ap => ap.id === id)) {
                arena.players.push({ ...player });
                if (window.toniSpeak) toniSpeak(player.name + " ist jetzt auf dem Feld.");
                toggleBriefcase(); // Koffer schließen für volle Sicht auf das Board
            } else {
                if (window.toniSpeak) toniSpeak("Dieser Spieler ist bereits auf dem Feld.");
            }
        }
    };

    // Integration: Die Setcard im Analysezentrum befüllen
    window.showFullSetcard = function(player) {
        const side = document.getElementById('setcard-content');
        const statusColor = player.status === "Bereit" ? "var(--success-green)" : "var(--accent-orange)";
        
        side.innerHTML = `
            <div class="setcard-ui animate-slideInRight">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="color:var(--accent-orange); margin:0; font-size:22px;">${player.name}</h3>
                    <div style="background:rgba(0,209,255,0.1); color:var(--data-cyan); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:bold;">${player.pos}</div>
                </div>
                
                <div style="font-size:55px; font-weight:bold; color:white; margin:10px 0;">#${player.number}</div>
                
                <div style="margin:20px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:8px; letter-spacing:1px;">
                        <span>FORM-BEWERTUNG</span>
                        <span style="color:var(--data-cyan);">${player.rating}/10</span>
                    </div>
                    <input type="range" min="1" max="10" value="${player.rating}" style="width:100%; accent-color:var(--data-cyan);" oninput="window.BriefcaseUI.updateFormRating(${player.id}, this.value)">
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;">
                    <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:10px; color:var(--text-muted); margin-bottom:4px;">PULS</div>
                        <div style="font-size:16px; font-weight:bold; color:var(--data-cyan);">${player.hr} BPM</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:10px; color:var(--text-muted); margin-bottom:4px;">STATUS</div>
                        <div style="font-size:12px; font-weight:bold; color:${statusColor};">${player.status}</div>
                    </div>
                </div>

                <div style="margin-top:25px; background:rgba(255,106,0,0.05); padding:15px; border-radius:12px; border:1px solid rgba(255,106,0,0.1);">
                    <div style="font-size:11px; color:var(--accent-orange); font-weight:bold; margin-bottom:8px; display:flex; align-items:center; gap:5px;">
                        🥗 TONI'S ERNÄHRUNGSTIPP
                    </div>
                    <div style="font-size:12px; color:white; line-height:1.5;">
                        ${player.status === 'Müde' ? 'Fokus auf Regeneration: Erhöhte Zufuhr von Proteinen und Magnesium nötig.' : 'Leistungs-Peak erreicht: Komplexe Kohlenhydrate (6g/kg) für das Match einplanen.'}
                    </div>
                </div>
            </div>
        `;
    };

    // Hilfsfunktion: Form-Rating vom Board aus anpassen
    window.BriefcaseUI.updateFormRating = function(id, val) {
        const p = arena.players.find(ap => ap.id === id);
        if (p) p.rating = val;
    };

})();
