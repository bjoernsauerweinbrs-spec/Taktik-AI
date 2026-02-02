/**
 * =========================================
 * TONI 2.0 – BRIEFCASE UI (FINISH)
 * Die zentrale Schaltstelle für Björn's Tactical OS
 * =========================================
 */

(function() {
    window.BriefcaseUI = {
        // Der zentrale Kader-Speicher (Synchronisiert mit Sporttasche & Board)
        kader: [
            { id: 1, name: "David Luiz", number: 4, rating: 8, hr: 65, sleep: "7.5h", status: "Bereit", pos: "IV", x: 250, y: 350, team: 'home' },
            { id: 2, name: "Max Miller", number: 10, rating: 6, hr: 72, sleep: "5.0h", status: "Müde", pos: "OM", x: 450, y: 300, team: 'home' },
            { id: 3, name: "Thiago", number: 3, rating: 7, hr: 68, sleep: "6.8h", status: "Bereit", pos: "LV", x: 150, y: 300, team: 'home' }
        ],

        // --- SEKTOR 1: SPORTTASCHE ---
        renderSport() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn">
                    <h2 style="color:var(--accent-orange); margin-bottom:10px;">👟 Sporttasche: Kader-Management</h2>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:25px;">Klicke auf "AUFS FELD", um die taktische Aufstellung zu bearbeiten.</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        ${this.kader.map(p => `
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,106,0,0.2); padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="font-weight:bold; font-size:14px;">#${p.number} ${p.name}</div>
                                    <div style="font-size:10px; color:var(--data-cyan);">${p.pos} // Form: ${p.rating}/10</div>
                                </div>
                                <button onclick="window.BriefcaseUI.toBoard(${p.id})" style="background:var(--success-green); border:none; color:white; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:10px;">AUFS FELD</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // --- SEKTOR 2: MEDICAL HUB ---
        renderMedical() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn">
                    <h2 style="color:var(--data-cyan); margin-bottom:10px;">⌚ Medical Hub: Biometrie & Erholung</h2>
                    <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); padding:15px; border-radius:12px; margin-bottom:20px;">
                        <span style="font-size:11px;">📡 STATUS: Live-Verbindung zu Garmin/Apple Health aktiv.</span>
                    </div>
                    
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px;">
                        ${this.kader.map(p => `
                            <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; text-align:center;">
                                <div style="font-size:12px; font-weight:bold; margin-bottom:10px;">${p.name}</div>
                                <div style="font-size:18px; color:var(--data-cyan);">${p.hr} <small style="font-size:9px;">BPM</small></div>
                                <div style="font-size:10px; color:var(--text-muted);">Schlaf: ${p.sleep}</div>
                                <div style="margin-top:10px; font-size:9px; color:${p.status === 'Bereit' ? 'var(--success-green)' : 'var(--accent-orange)'};">
                                    ● ${p.status.toUpperCase()}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // --- SEKTOR 3: GESCHÄFTSZIMMER ---
        renderOrga() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn" style="display:grid; grid-template-columns: 1fr 280px; gap:30px;">
                    <div>
                        <h2 style="color:#FFD166; margin-bottom:10px;">🏢 Geschäftszimmer: Media & Sponsoring</h2>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:30px;">Verwalte die Stadionzeitung und Partner-Assets.</p>
                        
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div onclick="window.Stadionzeitung.render()" style="background:white; color:#1a1a1a; padding:25px; border-radius:12px; cursor:pointer; text-align:center; font-weight:bold;">
                                <div style="font-size:30px; margin-bottom:10px;">📰</div>
                                STADIONZEITUNG<br><small style="font-weight:normal;">Editor öffnen</small>
                            </div>
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:25px; border-radius:12px; text-align:center;">
                                <div style="font-size:30px; margin-bottom:10px;">💰</div>
                                SPONSOREN<br><small style="font-weight:normal;">Assets verwalten</small>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background:rgba(255,106,0,0.1); border:1px solid var(--accent-orange); padding:20px; border-radius:15px;">
                        <h4 style="color:var(--accent-orange); font-size:12px; letter-spacing:1px;">TONI'S STRATEGIE-INPUT</h4>
                        <p style="font-size:11px; margin-top:15px; line-height:1.5;">
                            Björn, ich habe die Bio-Werte analysiert. Für die heutige Stadionzeitung empfehle ich ein Special über <b>${this.kader[0].name}</b> – seine Fitness-Werte sind auf Weltklasse-Niveau!
                        </p>
                        <button class="tool-btn" style="margin-top:20px; width:100%;" onclick="Stadionzeitung.addBlock('tactics')">TIPP ÜBERNEHMEN</button>
                    </div>
                </div>
            `;
            // Initialisiert den Zeitungs-Modus, falls noch nicht geschehen
            if(window.Stadionzeitung) window.Stadionzeitung.init();
        },

        // --- HILFSFUNKTIONEN ---
        toBoard(id) {
            const player = this.kader.find(p => p.id === id);
            if (!arena.players.find(ap => ap.id === id)) {
                arena.players.push({ ...player });
                if (window.toniSpeak) toniSpeak(player.name + " wurde auf das Spielfeld geschickt.");
                toggleBriefcase(); // Schließt die Aktentasche
            } else {
                if (window.toniSpeak) toniSpeak("Der Spieler ist bereits auf dem Feld.");
            }
        }
    };

    // --- INTEGRATION: SETCARD UPDATE ---
    // Diese Funktion wird von arena.js aufgerufen, wenn ein Spieler angeklickt wird.
    window.showFullSetcard = function(player) {
        const side = document.getElementById('setcard-content');
        const statusColor = player.status === "Bereit" ? "#28C76F" : "#FF6A00";
        
        side.innerHTML = `
            <div class="setcard-ui">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 style="color:var(--accent-orange); margin:0;">${player.name}</h3>
                    <div style="background:rgba(0,209,255,0.1); color:var(--data-cyan); padding:4px 8px; border-radius:5px; font-size:10px; font-weight:bold;">${player.pos}</div>
                </div>
                
                <div style="font-size:45px; font-weight:bold; color:white; line-height:1;">#${player.number}</div>
                
                <div style="margin:20px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:8px;">
                        <span>TAKTIK-RATING</span>
                        <span style="color:var(--data-cyan);">${player.rating}/10</span>
                    </div>
                    <input type="range" min="1" max="10" value="${player.rating}" style="width:100%; accent-color:var(--data-cyan);" oninput="window.updateForm(${player.id}, this.value)">
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px;">
                    <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; text-align:center;">
                        <div style="font-size:9px; color:var(--text-muted);">PULS</div>
                        <div style="font-size:14px; font-weight:bold; color:var(--data-cyan);">${player.hr}</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; text-align:center;">
                        <div style="font-size:9px; color:var(--text-muted);">STATUS</div>
                        <div style="font-size:10px; font-weight:bold; color:${statusColor};">${player.status}</div>
                    </div>
                </div>

                <div style="margin-top:20px; background:rgba(255,106,0,0.05); padding:12px; border-radius:8px; border:1px solid rgba(255,106,0,0.1);">
                    <div style="font-size:10px; color:var(--accent-orange); font-weight:bold; margin-bottom:5px;">🥗 TONI'S ERNÄHRUNGSTIPP</div>
                    <div style="font-size:11px; color:white; line-height:1.4;">
                        ${player.status === 'Müde' ? 'Erhöhte Magnesium-Zufuhr und 500kcal Überschuss heute.' : 'Carb-Loading Phase aktiv (6g/kg Körpergewicht).'}
                    </div>
                </div>
            </div>
        `;
    };

    window.updateForm = function(id, val) {
        const p = arena.players.find(ap => ap.id === id);
        if (p) p.rating = val;
    };

})();
