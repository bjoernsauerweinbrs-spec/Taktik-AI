/**
 * TONI 2.0 - SYSTEM & CONNECTIVITY CONTROL
 * Verwaltung von API-Keys, KI-Providern und System-Sicherheit.
 * Bietet Live-Status für Ollama (Lokal) und OpenAI (Cloud).
 */
window.SektorSystem = {
    render: function() {
        const config = JSON.parse(localStorage.getItem('toni_club_config')) || { name: "International Pro Club", coach: "Björn" };
        const apiKey = localStorage.getItem('toni_api_key') || "";
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out; height: 82vh; overflow-y: auto;">
                
                <div style="margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <h2 style="color:var(--data-cyan); letter-spacing:3px; margin:0;">SYSTEM SETUP & AI BRIDGE</h2>
                    <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Konnektivität und globale Trainer-Einstellungen</p>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(0,209,255,0.2);">
                        <h3 style="font-size:0.7rem; color:var(--data-cyan); margin-bottom:20px; letter-spacing:2px;">KI-STATUS MONITOR</h3>
                        
                        <div style="display:flex; flex-direction:column; gap:15px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px;">
                                <span>OLLAMA (Lokal MacBook)</span>
                                <div id="status-ollama" style="color:#666;"><i class="fas fa-circle-notch fa-spin"></i> PRÜFE...</div>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px;">
                                <span>OPENAI (Cloud Gateway)</span>
                                <div id="status-openai" style="color:${apiKey ? 'var(--neon-green)' : 'var(--status-error)'}">
                                    ${apiKey ? 'BEREIT' : 'KEY FEHLT'}
                                </div>
                            </div>
                        </div>
                        <p style="font-size:0.6rem; color:var(--text-dim); margin-top:20px; line-height:1.5;">
                            Toni nutzt standardmäßig Ollama. Sollte der lokale Dienst nicht antworten, schaltet das System automatisch (Silent-Fallback) auf OpenAI um.
                        </p>
                    </div>

                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:15px; border:1px solid rgba(212,175,55,0.2);">
                        <h3 style="font-size:0.7rem; color:var(--accent-gold); margin-bottom:20px; letter-spacing:2px;">CLUB-IDENTITY</h3>
                        
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">CLUB NAME</label>
                            <input type="text" id="sys-club-name" value="${config.name}" class="login-input" style="width:100%;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">COACH NAME</label>
                            <input type="text" id="sys-coach-name" value="${config.coach}" class="login-input" style="width:100%;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-size:0.6rem; color:var(--text-dim); display:block; margin-bottom:5px;">OPENAI API-KEY</label>
                            <input type="password" id="sys-openai-key" value="${apiKey}" placeholder="sk-..." class="login-input" style="width:100%;">
                        </div>
                        <button class="login-btn" onclick="SektorSystem.saveConfig()" style="width:100%; margin-top:10px;">EINSTELLUNGEN SPEICHERN</button>
                    </div>

                </div>

                <div style="margin-top:40px; background:rgba(57,255,20,0.05); padding:30px; border-radius:15px; border-left:5px solid var(--neon-green);">
                    <h4 style="color:var(--neon-green); margin-bottom:10px;">Anleitung: Ollama für Profis freischalten</h4>
                    <p style="font-size:0.8rem; line-height:1.6; color:var(--text-dim);">
                        Um die volle Power deines MacBooks zu nutzen, installiere Ollama. Damit Toni 2.0 darauf zugreifen kann, öffne dein Terminal und starte den Dienst mit: 
                        <br><code style="background:#000; color:#fff; padding:5px 10px; border-radius:4px; display:inline-block; margin-top:10px;">OLLAMA_ORIGINS="*" ollama serve</code>
                    </p>
                </div>
            </div>`;
        
        this.checkOllamaStatus();
    },

    checkOllamaStatus: async function() {
        const el = document.getElementById('status-ollama');
        try {
            const res = await fetch('http://localhost:11434/api/tags');
            if(res.ok) {
                el.innerText = "VERBUNDEN";
                el.style.color = "var(--neon-green)";
            } else { throw new Error(); }
        } catch(e) {
            el.innerText = "OFFLINE";
            el.style.color = "var(--status-error)";
        }
    },

    saveConfig: function() {
        const config = {
            name: document.getElementById('sys-club-name').value,
            coach: document.getElementById('sys-coach-name').value
        };
        localStorage.setItem('toni_club_config', JSON.stringify(config));
        localStorage.setItem('toni_api_key', document.getElementById('sys-openai-key').value);
        
        this.render();
        if(window.ToniTTS) ToniTTS.speak("System-Konfiguration wurde aktualisiert.", "warm");
    }
};
