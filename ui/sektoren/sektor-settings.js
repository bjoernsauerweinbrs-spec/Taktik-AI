/**
 * TONI 2.0 - SEKTOR SETTINGS (SYSTEM & COACH SETUP)
 * Fokus: KI-Brücke, Smartphone-Sync & Profil-Management
 * Status: CLEAN & SYNCED 2026
 */
window.SektorSettings = {
    timer: null,

    open() {
        console.log("⚙️ System: Konfigurations-Module werden synchronisiert...");
        this.render();
        
        // Status-Timer: Prüft alle 2 Sekunden die KI-Verfügbarkeit
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.updateStatusOnly(), 2000);
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const aiStatus = window.aiOnline ? 'ONLINE' : 'OFFLINE';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3131';
        const savedIP = localStorage.getItem('toni_mac_ip') || '';
        const coach = JSON.parse(localStorage.getItem('toni_coach_data')) || { verein: "Mein Verein", name: "Coach" };

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding-bottom: 50px;">
                
                <div style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid rgba(57, 255, 20, 0.1);">
                    <h3 id="settings-ai-title" style="color:#fff; margin-bottom:25px; font-size: 1rem; font-family:'Orbitron';">
                        <i class="fas fa-brain" style="color:${aiColor}; margin-right: 12px;"></i> 
                        STATUS: <span style="color:${aiColor}">${aiStatus}</span>
                    </h3>

                    <div style="background: rgba(57,255,20,0.05); border-left: 3px solid var(--neon-green); padding: 20px; margin-bottom: 25px; border-radius: 0 10px 10px 0;">
                        <h4 style="color:var(--neon-green); font-size: 0.75rem; margin-bottom: 10px; font-family:'Orbitron';">MACBOOK TERMINAL-FREIGABE</h4>
                        <p style="color:#aaa; font-size: 0.7rem; margin-bottom: 12px; line-height:1.5;">Kopiere diesen Befehl ins Terminal, um Toni für dein Smartphone freizuschalten:</p>
                        <code style="display: block; background: #000; padding: 12px; color: var(--data-cyan); font-size: 0.65rem; border-radius: 5px; border: 1px solid #333; word-break: break-all; font-family:monospace;">
                            OLLAMA_HOST=0.0.0.0 OLLAMA_ORIGINS="*" ollama serve
                        </code>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h4 style="color:#fff; font-size: 0.75rem; margin-bottom: 12px; font-family:'Orbitron';">SMARTPHONE-SYNC (IP-CONNECT)</h4>
                        <input type="text" id="mac-ip-input" value="${savedIP}" placeholder="z.B. 192.168.1.15" 
                            style="width:100%; height: 50px; background:#000; border:1px solid #333; color:var(--data-cyan); text-align: center; font-size: 1.3rem; letter-spacing: 2px; border-radius:8px; outline:none; font-family:monospace;">
                        <button class="pro-btn-gold" onclick="window.SektorSettings.saveIP()" style="width: 100%; margin-top: 12px;">
                            IP-ADRESSE VERSIEGELN
                        </button>
                    </div>

                    <div style="padding: 15px; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px dashed #333;">
                        <span style="font-size:0.6rem; color:#666; font-family:'Orbitron'; text-transform:uppercase;">Mikrofon-Pegel:</span>
                        <div style="height:4px; background:#111; width:100%; margin-top:8px; border-radius:2px; overflow:hidden;">
                            <div id="mic-level-bar" style="width:10%; height:100%; background:var(--neon-green); box-shadow:0 0 10px var(--neon-green);"></div>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid rgba(0, 209, 255, 0.1);">
                    <h3 style="color:#fff; margin-bottom:25px; font-size: 1rem; font-family:'Orbitron';">
                        <i class="fas fa-id-card" style="color:var(--data-cyan); margin-right: 12px;"></i> 
                        COACH-PROFIL
                    </h3>

                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 0.55rem; color: #666; letter-spacing: 1px;">VEREINSNAME (FÜR ZEITUNG)</label>
                        <input type="text" id="coach-verein" value="${coach.verein}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:6px; margin-top:5px; font-family:'Orbitron';">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 0.55rem; color: #666; letter-spacing: 1px;">DEIN TRAINER-NAME</label>
                        <input type="text" id="coach-name" value="${coach.name}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:6px; margin-top:5px; font-family:'Orbitron';">
                    </div>

                    <button class="pro-btn-gold" onclick="window.SektorSettings.saveProfile()" style="width: 100%; background:var(--data-cyan); color:#000;">
                        PROFIL SYNCHRONISIEREN
                    </button>

                    <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #222;">
                        <h4 style="color:#fff; font-size: 0.75rem; margin-bottom: 12px; font-family:'Orbitron';">SYSTEM-LOG</h4>
                        <div id="system-log" style="font-size:0.55rem; color:#444; font-family:monospace; line-height:1.6;">
                            [SYNC] Profile: Active<br>
                            [AI] Ollama-Bridge: Searching...<br>
                            [IP] Last saved: ${savedIP || 'None'}
                        </div>
                    </div>

                    <button class="tactic-btn" onclick="location.reload()" style="margin-top: 30px; width: 100%; border-color: #ff3131; color: #ff3131; font-size:0.6rem;">
                        <i class="fas fa-sync"></i> VOLLSTÄNDIGER SYSTEM-REBOOT
                    </button>
                </div>
            </div>
        `;
    },

    saveIP() {
        const ip = document.getElementById('mac-ip-input').value.trim();
        localStorage.setItem('toni_mac_ip', ip);
        if(window.ToniVoice) window.ToniVoice.speak("IP-Adresse synchronisiert. Brücke wird aufgebaut.");
        location.reload(); 
    },

    saveProfile() {
        const coachData = {
            verein: document.getElementById('coach-verein').value,
            name: document.getElementById('coach-name').value
        };
        localStorage.setItem('toni_coach_data', JSON.stringify(coachData));
        window.coachInfo = coachData;
        
        if(window.ToniVoice) window.ToniVoice.speak("Coach-Profil wurde erfolgreich versiegelt.");
        this.render();
    },

    updateStatusOnly() {
        const title = document.getElementById('settings-ai-title');
        if (!title) return;
        const aiStatus = window.aiOnline ? 'ONLINE' : 'OFFLINE';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3131';
        title.innerHTML = `<i class="fas fa-brain" style="color:${aiColor}; margin-right: 12px;"></i> STATUS: <span style="color:${aiColor}">${aiStatus}</span>`;
    }
};
