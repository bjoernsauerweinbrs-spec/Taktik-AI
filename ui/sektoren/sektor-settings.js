/**
 * TONI 2.0 - SEKTOR SETTINGS (KI-SETUP & CONNECT)
 * Zentrale für die lokale KI-Anbindung (Ollama) und Smartphone-Synchronisation.
 * Fokus: IP-Konfiguration & Trainer-Guide 2026.
 */
window.SektorSettings = {
    timer: null,

    /**
     * Wird vom Router aufgerufen
     */
    open() {
        this.render();
        
        // Status-Timer: Prüft alle 2 Sekunden die Verbindung zur KI
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.updateStatusOnly(), 2000);
    },

    render() {
        // Wir nutzen 'active-content' für die Konsistenz mit dem Router
        const content = document.getElementById('active-content');
        if (!content) return;

        const aiStatus = window.aiOnline ? 'ONLINE' : 'OFFLINE';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3b30';
        const savedIP = localStorage.getItem('toni_mac_ip') || '';

        content.innerHTML = `
            <div class="fadeIn" style="padding: 0 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
                    <div>
                        <h2 style="color:var(--neon-green); font-family:'Orbitron'; letter-spacing: 2px; margin-bottom: 5px; font-size:1.2rem;">SYSTEM-SETUP & CONNECT</h2>
                        <span style="color: #555; font-size: 0.7rem; text-transform:uppercase; letter-spacing: 1px;">Trainer-Anleitung für den Smartphone-Einsatz</span>
                    </div>
                    <button class="tactic-btn" onclick="clearInterval(window.SektorSettings.timer); window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
                    
                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 id="settings-ai-title" style="color:#fff; margin-bottom:25px; font-size: 1rem; font-family:'Orbitron';">
                            <i class="fas fa-brain" style="color:${aiColor}; margin-right: 10px;"></i> 
                            STATUS: <span style="color:${aiColor}">${aiStatus}</span>
                        </h3>
                        
                        <div style="background: rgba(57,255,20,0.05); border-left: 3px solid var(--neon-green); padding: 20px; margin-bottom: 20px; border-radius: 0 10px 10px 0;">
                            <h4 style="color:var(--neon-green); font-size: 0.8rem; margin-bottom: 8px; font-family:'Orbitron';">SCHRITT 1: TERMINAL-START (MAC)</h4>
                            <p style="color:#aaa; font-size: 0.75rem; margin-bottom: 12px; line-height:1.4;">Öffne das Terminal am MacBook und kopiere diesen Befehl, um Toni für das Handy freizugeben:</p>
                            <code style="display: block; background: #000; padding: 12px; color: var(--data-cyan); font-size: 0.7rem; border-radius: 5px; border: 1px solid #222; word-break: break-all; font-family:monospace;">
                                OLLAMA_HOST=0.0.0.0 OLLAMA_ORIGINS="*" ollama serve
                            </code>
                        </div>

                        <div style="background: rgba(255,255,255,0.03); border-left: 3px solid #fff; padding: 20px; border-radius: 0 10px 10px 0;">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 8px; font-family:'Orbitron';">SCHRITT 2: IDENTIFIKATION</h4>
                            <p style="color:#aaa; font-size: 0.75rem; margin-bottom:10px;">Login-Passwort für alle Trainer:</p>
                            <div style="background: #000; padding: 10px; color: #fff; font-family: 'Orbitron'; font-size: 1.1rem; text-align:center; border-radius:5px; letter-spacing: 5px; border: 1px solid #333;">
                                toni2026
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color:#fff; margin-bottom:20px; font-size: 1rem; font-family:'Orbitron';"><i class="fas fa-wifi" style="color:var(--data-cyan); margin-right:10px;"></i> SMARTPHONE-SYNC</h3>
                        
                        <p style="color:#888; font-size: 0.8rem; line-height: 1.6; margin-bottom: 20px;">
                            Damit dein Handy Tonis Gehirn am MacBook findet, musst du im selben WLAN sein und hier die <b>IP-Adresse</b> deines Macs eintragen.
                        </p>

                        <div style="margin-bottom: 25px;">
                            <label style="color:#555; font-size: 0.6rem; text-transform:uppercase; display:block; margin-bottom:8px; letter-spacing:1px;">MacBook IP-Adresse:</label>
                            <input type="text" id="mac-ip-input" value="${savedIP}" placeholder="z.B. 192.168.1.15" 
                                style="width:100%; height: 50px; background:#000; border:1px solid #333; color:var(--data-cyan); text-align: center; font-size: 1.3rem; letter-spacing: 2px; border-radius:10px; outline:none; font-family:monospace;">
                            
                            <button class="pro-btn-gold" onclick="window.SektorSettings.saveIP()" style="width: 100%; margin-top: 15px; height:45px;">
                                IP-ADRESSE SPEICHERN
                            </button>
                        </div>

                        <div style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <h4 style="color:#fff; font-size: 0.75rem; margin-bottom: 12px; font-family:'Orbitron';">ANLEITUNG: IP FINDEN</h4>
                            <ul style="color:#666; font-size: 0.7rem; padding-left: 18px; line-height: 1.6;">
                                <li style="margin-bottom:5px;">Öffne am MacBook die <b>Systemeinstellungen</b>.</li>
                                <li style="margin-bottom:5px;">Gehe auf <b>Netzwerk</b> und klicke auf dein WLAN.</li>
                                <li style="margin-bottom:5px;">Dort steht die IP (z.B. "192.168.1.15").</li>
                                <li style="color:var(--accent-orange);">Wichtig: Handy und Mac müssen im gleichen WLAN sein!</li>
                            </ul>
                        </div>

                        <button class="tactic-btn" onclick="location.reload()" style="margin-top: 25px; width: 100%; border-color: #333; font-size:0.6rem; opacity:0.5;">
                            <i class="fas fa-reboot"></i> SYSTEM-REBOOT (RELOAD ENGINE)
                        </button>
                    </div>

                </div>
            </div>
        `;
    },

    saveIP() {
        const ipInput = document.getElementById('mac-ip-input');
        if (ipInput) {
            const ip = ipInput.value.trim();
            localStorage.setItem('toni_mac_ip', ip);
            
            if(window.ToniVoice) {
                window.ToniVoice.speak("IP Adresse gespeichert. Ich versuche die Verbindung aufzubauen.");
            }
            
            // Manuelle Statusprüfung triggern
            if (window.checkAIStatus) window.checkAIStatus();
            this.render();
        }
    },

    updateStatusOnly() {
        const title = document.getElementById('settings-ai-title');
        if (!title) return;

        const aiStatus = window.aiOnline ? 'ONLINE' : 'OFFLINE';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3b30';

        title.innerHTML = `<i class="fas fa-brain" style="color:${aiColor}; margin-right: 10px;"></i> STATUS: <span style="color:${aiColor}">${aiStatus}</span>`;
    }
};
