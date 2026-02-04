/**
 * TONI 2.0 - SYSTEM-ZENTRALE & IDENTITY CORE
 * Fokus: Fehlerfreie Eingabe (Tippen), Club-Daten & KI-Schnittstellen.
 */

window.SektorSystem = {
    render: function() {
        const c = JSON.parse(localStorage.getItem('toni_club_config')) || {
            name: "FC TONI 2.0",
            coach: "Björn",
            league: "Amateur-Pro",
            stadium: "Ginga Arena",
            logoUrl: "https://via.placeholder.com/100/39FF14/000000?text=T2.0"
        };
        
        const apiKey = localStorage.getItem('toni_api_key') || "";
        const apiProvider = localStorage.getItem('toni_api_provider') || "llama";

        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out; pointer-events: all !important;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom:1px solid rgba(57, 255, 20, 0.2); padding-bottom:20px;">
                    <div>
                        <h3 style="color:var(--neon-green); margin:0; letter-spacing:2px; text-shadow: 0 0 10px rgba(57,255,20,0.3);">SYSTEM-ZENTRALE</h3>
                        <p style="font-size:0.75rem; color:var(--text-dim); margin:5px 0 0 0;">Globaler Daten-Anker für Stadionheft & Analyse</p>
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
                                <input type="text" id="set-club" value="${c.name}" class="login-input" style="width:100%; pointer-events: auto; cursor:text;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">COACH</label>
                                <input type="text" id="set-coach" value="${c.coach}" class="login-input" style="width:100%; pointer-events: auto; cursor:text;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">LIGA</label>
                                <input type="text" id="set-league" value="${c.league}" class="login-input" style="width:100%; pointer-events: auto; cursor:text;">
                            </div>
                            <div style="margin-bottom:15px; grid-column: span 2;">
                                <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">STADIONNAME</label>
                                <input type="text" id="set-stadium" value="${c.stadium}" class="login-input" style="width:100%; pointer-events: auto; cursor:text;">
                            </div>
                        </div>
                    </div>

                    <div class="fifa-card" style="text-align:left; cursor:default; border-color:var(--neon-green); background:rgba(57,255,20,0.02); pointer-events: auto;">
                        <h4 style="color:var(--neon-green); font-size:0.8rem; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid rgba(57,255,20,0.2); padding-bottom:5px;">KI-CORE (SERVER-ANBINDUNG)</h4>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">PROVIDER</label>
                            <select id="api-provider" class="login-input" style="width:100%; background:#000; pointer-events: auto;">
                                <option value="llama" ${apiProvider==='llama'?'selected':''}>Ollama (Lokal & Offline)</option>
                                <option value="openai" ${apiProvider==='openai'?'selected':''}>OpenAI (Cloud GPT-4)</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">SERVER-ADRESSE / API-KEY</label>
                            <input type="text" id="api-key-input" value="${apiKey}" class="login-input" style="width:100%; pointer-events: auto; cursor:text;" placeholder="z.B. http://localhost:11434">
                        </div>

                        <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; font-size:0.6rem; color:var(--text-dim); line-height:1.4;">
                            <i class="fas fa-info-circle" style="color:var(--neon-green);"></i> 
                            Ollama muss im Hintergrund mit <code>ollama serve</code> laufen. 
                            Björn, stelle sicher, dass die <b>ORIGINS</b> für den Web-Zugriff freigegeben sind.
                        </div>
                    </div>
                </div>

                <button class="login-btn" style="width:100%; margin-top:35px; letter-spacing:3px; background:var(--neon-green); color:#000;" onclick="SektorSystem.saveAll()">
                    SYSTEM-KONFIGURATION ÜBERNEHMEN
                </button>
            </div>
        `;
    },

    saveAll: function() {
        const clubData = {
            name: document.getElementById('set-club').value,
            coach: document.getElementById('set-coach').value,
            league: document.getElementById('set-league').value,
            stadium: document.getElementById('set-stadium').value,
            logoUrl: "https://via.placeholder.com/100/39FF14/000000?text=T2.0"
        };
        
        localStorage.setItem('toni_club_config', JSON.stringify(clubData));
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        
        if(window.ToniTTS) {
            ToniTTS.speak(`Check. Coach ${clubData.coach}, Daten für ${clubData.name} sind jetzt im System.`, "warm");
        }
        
        this.render();
    },

    startOnboarding: function() {
        if(window.ToniTTS) {
            ToniTTS.speak("Identity-Wizard bereit. Bitte fülle die Felder aus, um das Stadionheft zu personalisieren.", "warm");
        }
    }
};
