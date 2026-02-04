/**
 * TONI 2.0 - SEKTOR SYSTEM & ONBOARDING
 * Verwaltung von Club-Daten, KI-Providern und der Trainer-Identität.
 */

window.SektorSystem = {
    render: function() {
        const c = BriefcaseUI.clubData;
        const apiKey = localStorage.getItem('toni_api_key') || "";
        const apiProvider = localStorage.getItem('toni_api_provider') || "llama";

        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:var(--panel-dark); border-radius:15px; border:1px solid rgba(255,106,0,0.2);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid #222; padding-bottom:15px;">
                    <div>
                        <h3 style="color:var(--accent-orange); margin:0;">SYSTEM-ZENTRALE</h3>
                        <p style="font-size:0.7rem; color:var(--text-dim); margin:5px 0 0 0;">Status: Toni Core v2.0 aktiv</p>
                    </div>
                    <button class="tactic-btn" style="width:auto; padding:8px 15px;" onclick="SektorSystem.startOnboarding()">
                        <i class="fas fa-comment-dots"></i> ONBOARDING STARTEN
                    </button>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                    <div>
                        <h4 style="color:var(--text-main); font-size:0.8rem; margin-bottom:15px; letter-spacing:1px;">CLUB-KONFIGURATION</h4>
                        <label style="font-size:0.6rem; color:var(--text-dim);">VEREIN / TEAM</label>
                        <input type="text" id="set-club" value="${c.name}" class="login-input" style="width:100%; text-align:left; margin-bottom:15px;">
                        
                        <label style="font-size:0.6rem; color:var(--text-dim);">COACH NAME</label>
                        <input type="text" id="set-coach" value="${c.coach}" class="login-input" style="width:100%; text-align:left; margin-bottom:15px;">
                        
                        <label style="font-size:0.6rem; color:var(--text-dim);">LIGA / NIVEAU</label>
                        <input type="text" id="set-league" value="${c.league}" class="login-input" style="text-align:left; width:100%;">
                    </div>

                    <div>
                        <h4 style="color:var(--text-main); font-size:0.8rem; margin-bottom:15px; letter-spacing:1px;">KI-ENGINE (OLLAMA / OPENAI)</h4>
                        <label style="font-size:0.6rem; color:var(--text-dim);">KI-PROVIDER WÄHLEN</label>
                        <select id="api-provider" class="login-input" style="width:100%; text-align:left; background:#000; margin-bottom:15px;">
                            <option value="llama" ${apiProvider==='llama'?'selected':''}>Local: Gemma 3 (Ollama)</option>
                            <option value="openai" ${apiProvider==='openai'?'selected':''}>Cloud: GPT-4 (OpenAI)</option>
                        </select>
                        
                        <label style="font-size:0.6rem; color:var(--text-dim);">API-KEY / SERVER-ADRESSE</label>
                        <input type="password" id="api-key-input" value="${apiKey}" class="login-input" style="width:100%; text-align:left; margin-bottom:10px;" placeholder="sk-...">
                        
                        <div style="background:rgba(0,209,255,0.05); padding:10px; border-radius:5px; border:1px solid rgba(0,209,255,0.2);">
                            <p style="font-size:0.6rem; color:var(--data-cyan); margin:0;">
                                <i class="fas fa-info-circle"></i> Hinweis: Für Ollama muss der lokale Server unter 127.0.0.1:11434 erreichbar sein.
                            </p>
                        </div>
                    </div>
                </div>

                <button class="login-btn" style="width:100%; margin-top:30px; letter-spacing:2px;" onclick="SektorSystem.saveAll()">
                    KONFIGURATION ÜBERNEHMEN
                </button>
            </div>
        `;
    },

    saveAll: function() {
        const clubData = {
            name: document.getElementById('set-club').value,
            coach: document.getElementById('set-coach').value,
            league: document.getElementById('set-league').value,
            logo: BriefcaseUI.clubData.logo
        };
        
        localStorage.setItem('toni_club_config', JSON.stringify(clubData));
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        
        BriefcaseUI.clubData = clubData; // In-Memory Update

        if(window.ToniTTS) {
            ToniTTS.speak(`Konfiguration für ${clubData.name} wurde im Kernsystem gesichert. Ich bin bereit, Coach ${clubData.coach}.`, "deep");
        }
        this.render();
    },

    startOnboarding: function() {
        BriefcaseUI.toggle(); // Tasche schließen für Fokus auf Chat
        if(window.ToniTTS) {
            ToniTTS.speak("Hallo Coach! Ich bin Toni. Damit ich meine Analysen perfekt auf dein Team abstimmen kann: Wie heißt dein Verein, in welcher Liga spielt ihr und wie darf ich dich nennen?", "warm");
        }
        // Focus auf Chat Input
        const chatInput = document.getElementById('chat-input');
        if(chatInput) chatInput.focus();
    }
};
