/**
 * TONI 2.0 - SEKTOR SETTINGS (KI-SETUP & CONNECT)
 * Zentrale für die lokale KI-Anbindung (Ollama) und Smartphone-Synchronisation.
 * Inklusive Offline-Guide für Trainer und IP-Konfiguration.
 */
window.SektorSettings = {
    timer: null,

    open() {
        this.render();
        // Status-Timer: Prüft alle 2 Sekunden die Verbindung zur KI
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.updateStatusOnly(), 2000);
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        const aiStatus = window.aiOnline ? 'ONLINE' : 'OFFLINE';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3b30';
        const savedIP = localStorage.getItem('toni_mac_ip') || '';

        let html = `
            <div style="padding: 0 10px; animation: fadeIn 0.5s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">SYSTEM-SETUP & CONNECT</h2>
                        <span style="color: #555; font-size: 0.7rem; letter-spacing: 1px;">TRAINER-ANLEITUNG FÜR DEN SMARTPHONE-EINSATZ</span>
                    </div>
                    <button class="tactic-btn" onclick="clearInterval(window.SektorSettings.timer); window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
                    
                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 id="settings-ai-title" style="color:#fff; margin-bottom:20px; font-size: 1rem;">
                            <i class="fas fa-brain" style="color:${aiColor}; margin-right: 10px;"></i> 
                            STATUS: <span style="color:${aiColor}">${aiStatus}</span>
                        </h3>
                        
                        <div style="background: rgba(57,255,20,0.05); border-left: 3px solid var(--neon-green); padding: 15px; margin-bottom: 20px;">
                            <h4 style="color:var(--neon-green); font-size: 0.8rem; margin-bottom: 5px;">SCHRITT 1: TERMINAL-START (MAC)</h4>
                            <p style="color:#ccc; font-size: 0.7rem; margin-bottom: 10px;">Öffne das Terminal am MacBook und kopiere diesen Befehl, um Toni für das Handy freizugeben:</p>
                            <code style="display: block; background: #000; padding: 10px; color: var(--data-cyan); font-size: 0.65rem; border-radius: 5px; border: 1px solid #222;">
                                OLLAMA_HOST=0.0.0.0 OLLAMA_ORIGINS="*" ollama serve
                            </code>
                        </div>

                        <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #fff; padding: 15px; margin-bottom: 20px;">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 5px;">SCHRITT 2: IDENTIFIKATION</h4>
                            <p style="color:#ccc; font-size: 0.75rem;">Login-Passwort für alle Trainer:</p>
                            <div style="background: #000; padding: 8px; color: #fff; font-family: monospace; font-size: 1rem; text-align:center; margin-top:5px; border-radius:5px; letter-spacing: 3px;">
                                toni2026
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color:#fff; margin-bottom:20px; font-size: 1rem;"><i class="fas fa-wifi"></i> SMARTPHONE-SYNCHRONISATION</h3>
                        
                        <p style="color:#888; font-size: 0.8rem; line-height: 1.6; margin-bottom: 15px;">
                            Damit dein Handy Toni's Gehirn am MacBook findet, musst du im selben WLAN sein und hier die <b>IP-Adresse</b> deines Macs eintragen.
                        </p>

                        <div style="margin-bottom: 20px;">
                            <label style="color:#555; font-size: 0.65rem; text-transform:uppercase; display:block; margin-bottom:5px;">MacBook IP-Adresse:</label>
                            <input type="text" id="mac-ip-input" class="pro-textarea" value="${savedIP}" placeholder="z.B. 192.168.1.15" style="height: 45px; text-align: center; font-size: 1.2rem; letter-spacing: 1px;">
                            <button class="pro-btn-gold" onclick="window.SektorSettings.saveIP()" style="width: 100%; margin-top: 10px;">
                                IP-ADRESSE SPEICHERN
                            </button>
                        </div>

                        <div style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 10px;">ANLEITUNG: IP FINDEN</h4>
                            <ul style="color:#666; font-size: 0.7rem; padding-left: 15px; line-height: 1.5;">
                                <li>Öffne am MacBook die <b>Systemeinstellungen</b>.</li>
                                <li>Gehe auf <b>Netzwerk</b> und klicke auf dein WLAN.</li>
                                <li>Dort steht die IP (z.B. "192.168.1.15").</li>
                                <li>Wichtig: Handy und Mac müssen im gleichen WLAN sein!</li>
                            </ul>
                        </div>

                        <button class="tactic-btn" onclick="location.reload()" style="margin-top: 25px; width: 100%; border-color: #444;">SYSTEM-REBOOT</button>
                    </div>

                </div>
            </div>
        `;
        content.innerHTML = html;
    },

    saveIP() {
        const ipInput = document.getElementById('mac-ip-input');
        if (ipInput) {
            const ip = ipInput.value.trim();
            localStorage.setItem('toni_mac_ip', ip);
            alert("IP-Adresse gespeichert! Toni versucht jetzt die Verbindung zu: " + ip);
            
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
