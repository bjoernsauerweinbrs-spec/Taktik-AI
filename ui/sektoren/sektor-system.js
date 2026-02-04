/**
 * TONI 2.0 - SEKTOR SYSTEM & ONBOARDING
 * Verwaltung von Club-Daten, KI-Providern (Ollama/OpenAI) und der Trainer-Identität.
 */

window.SektorSystem = {
    render: function() {
        // Daten-Sync: Lade aus LocalStorage oder nutze Fallbacks aus BriefcaseUI
        const c = JSON.parse(localStorage.getItem('toni_club_config')) || {
            name: "FC TONI 2.0",
            coach: "Björn",
            league: "Pro-Level"
        };
        
        const apiKey = localStorage.getItem('toni_api_key') || "";
        const apiProvider = localStorage.getItem('toni_api_provider') || "llama";

        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom:1px solid rgba(57, 255, 20, 0.2); padding-bottom:20px;">
                    <div>
                        <h3 style="color:var(--neon-green); margin:0; letter-spacing:2px; text-shadow: 0 0 10px rgba(57,255,20,0.3);">SYSTEM-ZENTRALE</h3>
                        <p style="font-size:0.75rem; color:var(--text-dim); margin:5px 0 0 0;">Status: Toni Core v2.0 Deep-Ginga aktiv</p>
                    </div>
                    <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.7rem; background:transparent; border:1px solid var(--neon-green); color:var(--neon-green);" onclick="SektorSystem.startOnboarding()">
                        <i class="fas fa-comment-dots"></i> ONBOARDING STARTEN
                    </button>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:30px;">
                    
                    <div class="fifa-card" style="text-align:left; cursor:default;">
                        <h4 style="color:var(--accent-gold); font-size:0.8rem; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:5px;">CLUB-KONFIGURATION</h4>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">VEREIN / TEAM</label>
                            <input type="text" id="set-club" value="${c.name}" class="login-input" style="width:100%; text-align:left;">
                        </div>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">COACH NAME</label>
                            <input type="text" id="set-coach" value="${c.coach}" class="login-input" style="width:100%; text-align:left;">
                        </div>
                        
                        <div>
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">LIGA / NIVEAU</label>
                            <input type="text" id="set-league" value="${c.league}" class="login-input" style="width:100%; text-align:left;">
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--neon-green);">
                        <h4 style="color:var(--neon-green); font-size:0.8rem; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(57,255,20,0.2); padding-bottom:5px;">KI-ENGINE (OLLAMA / OPENAI)</h4>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">KI-PROVIDER WÄHLEN</label>
                            <select id="api-provider" class="login-input" style="width:100%; text-align:left; background:#000;">
                                <option value="llama" ${apiProvider==='llama'?'selected':''}>Local: Ollama (Gemma/Llama)</option>
                                <option value="openai" ${apiProvider==='openai'?'selected':''}>Cloud: OpenAI (GPT-4)</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">API-KEY / SERVER-ADRESSE</label>
                            <input type="password" id="api-key-input" value="${apiKey}" class="login-input" style="width:100%; text-align:left;" placeholder="http://localhost:11434 oder sk-...">
                        </div>
                        
                        <div style="background:rgba(0,209,255,0.05); padding:12px; border-radius:8px; border:1px solid rgba(0,209,255,0.2);">
                            <p style="font-size:0.65rem; color:var(--data-cyan); margin:0; line-height:1.4;">
                                <i class="fas fa-info-circle"></i> <b>Hinweis:</b> Für Ollama muss der Server lokal unter 127.0.0.1:11434 laufen. Trainer-Niveau wird automatisch adaptiert.
                            </p>
                        </div>
                    </div>
                </div>

                <button class="login-btn" style="width:100%; margin-top:35px; letter-spacing:3px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSystem.saveAll()">
                    KONFIGURATION ÜBERNEHMEN
                </button>
            </div>
        `;
    },

    saveAll: function() {
        const clubData = {
            name: document.getElementById('set-club').value,
            coach: document.getElementById('set-coach').value,
            league: document.getElementById('set-league').value
        };
        
        localStorage.setItem('toni_club_config', JSON.stringify(clubData));
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        
        // Sync zu BriefcaseUI (falls vorhanden)
        if(window.BriefcaseUI) window.BriefcaseUI.clubData = clubData;

        if(window.ToniTTS) {
            ToniTTS.speak(`System-Update abgeschlossen. Coach ${clubData.coach}, der ${clubData.name} ist jetzt voll in das Kernsystem integriert.`, "deep");
        }
        
        this.render();
    },

    startOnboarding: function() {
        if(window.BriefcaseUI) BriefcaseUI.toggle(); // Schließt die Tasche
        
        if(window.ToniTTS) {
            ToniTTS.speak("Hallo Coach! Ich bin Toni. Damit ich meine Analysen perfekt auf dein Team abstimmen kann: Wie heißt dein Verein, in welcher Liga spielt ihr und wie darf ich dich nennen?", "warm");
        }
        
        const chatInput = document.getElementById('chat-input');
        if(chatInput) {
            chatInput.focus();
            chatInput.placeholder = "Verein, Liga, Name eingeben...";
        }
    }
};
