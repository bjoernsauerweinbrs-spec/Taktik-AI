/**
 * TONI 2.0 - SYSTEM-ZENTRALE & IDENTITY CORE
 * Fokus: Sicherheit (Björn/Nadine), Club-Daten & KI-Schnittstellen.
 */
window.SektorSystem = {
    render: function() {
        const c = JSON.parse(localStorage.getItem('toni_club_config')) || {
            name: "FC TONI 2.0",
            coach: "Björn",
            league: "Amateur-Pro",
            stadium: "Ginga Arena"
        };
        
        const apiKey = localStorage.getItem('toni_api_key') || "";
        const apiProvider = localStorage.getItem('toni_api_provider') || "llama";

        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out; pointer-events: all !important; height: 82vh; overflow-y: auto;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom:1px solid rgba(57, 255, 20, 0.2); padding-bottom:20px;">
                    <div>
                        <h3 style="color:var(--neon-green); margin:0; letter-spacing:2px; text-shadow: 0 0 10px rgba(57,255,20,0.3);">SYSTEM-ZENTRALE</h3>
                        <p style="font-size:0.75rem; color:var(--text-dim); margin:5px 0 0 0;">Globaler Daten-Anker & Sicherheits-Management</p>
                    </div>
                    <button class="tactic-btn" style="border-color:var(--neon-green); color:var(--neon-green);" onclick="SektorSystem.startOnboarding()">
                        <i class="fas fa-magic"></i> IDENTITY-WIZARD
                    </button>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap:30px;">
                    
                    <div class="fifa-card" style="text-align:left; cursor:default; background:rgba(255,255,255,0.02); pointer-events: auto;">
                        <h4 style="color:var(--accent-gold); font-size:0.8rem; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:5px;">CLUB-IDENTITÄT</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                            <div style="margin-bottom:15px; grid-column: span 2;">
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">VEREINSNAME</label>
                                <input type="text" id="set-club" value="${c.name}" class="login-input" style="width:100%;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">COACH</label>
                                <input type="text" id="set-coach" value="${c.coach}" class="login-input" style="width:100%;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">LIGA</label>
                                <input type="text" id="set-league" value="${c.league}" class="login-input" style="width:100%;">
                            </div>
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--status-error); background:rgba(255,50,50,0.02); pointer-events: auto;">
                        <h4 style="color:var(--status-error); font-size:0.8rem; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(255,50,50,0.2); padding-bottom:5px;">AUTHENTIFIZIERUNG</h4>
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">PASSWORT COACH (BJÖRN)</label>
                            <input type="password" id="pass-bjorn" placeholder="Neues Passwort..." class="login-input" style="width:100%;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">PASSWORT NADINE</label>
                            <input type="password" id="pass-nadine" placeholder="Neues Passwort..." class="login-input" style="width:100%;">
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--neon-green); background:rgba(57,255,20,0.02); pointer-events: auto; grid-column: span 2;">
                        <h4 style="color:var(--neon-green); font-size:0.8rem; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(57,255,20,0.2); padding-bottom:5px;">KI-CORE & API GATEWAY</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            <div>
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">PROVIDER</label>
                                <select id="api-provider" class="login-input" style="width:100%; background:#000;">
                                    <option value="llama" ${apiProvider==='llama'?'selected':''}>Ollama (Lokal / MacBook)</option>
                                    <option value="openai" ${apiProvider==='openai'?'selected':''}>OpenAI (Cloud GPT-4)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">API-KEY / ADRESSE</label>
                                <input type="password" id="api-key-input" value="${apiKey}" class="login-input" style="width:100%;" placeholder="sk-... oder http://127.0.0.1:11434">
                            </div>
                        </div>
                        <div style="margin-top:20px; background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; font-size:0.65rem; color:var(--text-dim); line-height:1.5;">
                            <i class="fas fa-terminal" style="color:var(--neon-green);"></i> MacBook: Starte Ollama im Terminal mit <code>OLLAMA_ORIGINS="*" ollama serve</code> um die Verbindung freizugeben.
                        </div>
                    </div>
                </div>

                <button class="login-btn" style="width:100%; margin-top:35px; letter-spacing:3px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSystem.saveAll()">
                    GESAMT-KONFIGURATION & SECURITY SPEICHERN
                </button>
            </div>
        `;
    },

    saveAll: function() {
        // Club-Daten speichern
        const clubData = {
            name: document.getElementById('set-club').value,
            coach: document.getElementById('set-coach').value,
            league: document.getElementById('set-league').value,
            stadium: "Ginga Arena"
        };
        localStorage.setItem('toni_club_config', JSON.stringify(clubData));

        // API-Daten speichern
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);

        // Security speichern
        const pBjorn = document.getElementById('pass-bjorn').value;
        const pNadine = document.getElementById('pass-nadine').value;
        if(pBjorn) localStorage.setItem('toni_pass_bjorn', pBjorn);
        if(pNadine) localStorage.setItem('toni_pass_nadine', pNadine);
        
        if(window.ToniTTS) {
            ToniTTS.speak(`System-Update abgeschlossen. Coach ${clubData.coach}, alle Protokolle sind gesichert.`, "warm");
        }
        
        alert("System-Konfiguration erfolgreich gespeichert.");
        this.render();
    },

    startOnboarding: function() {
        if(window.ToniTTS) {
            ToniTTS.speak("Security-Wizard aktiv. Bitte setze die Passwörter für den geschützten Bereich.", "warm");
        }
    }
};
