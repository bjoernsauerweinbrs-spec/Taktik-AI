/**
 * TONI 2.0 - SEKTOR SETTINGS (KI-SETUP)
 * Zentrale für die lokale KI-Anbindung (Ollama) mit Live-Status-Update.
 * Optimiert für plattformübergreifende Befehle (Mac & Windows) & Phi-3 Turbo.
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

        let html = `
            <div style="padding: 0 10px; animation: fadeIn 0.5s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">SYSTEM-SETUP & KI-ZENTRALE</h2>
                        <span style="color: #555; font-size: 0.7rem; letter-spacing: 1px;">KONFIGURATION DEINES EXPERTEN-BERATERS</span>
                    </div>
                    <button class="tactic-btn" onclick="clearInterval(window.SektorSettings.timer); window.BriefcaseUI.renderMainGrid()">ZURÜCK ZUR ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    
                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 id="settings-ai-title" style="color:#fff; margin-bottom:20px; font-size: 1rem;">
                            <i class="fas fa-brain" style="color:${aiColor}; margin-right: 10px;"></i> 
                            STATUS: <span style="color:${aiColor}">${aiStatus}</span>
                        </h3>
                        
                        <p style="color:#ccc; font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px;">
                            <strong>Toni 2.0</strong> ist deine persönliche Taktik-Zentrale. Er kombiniert die analytische Tiefe von 
                            <span style="color:var(--data-cyan);">Julian Nagelsmann</span> mit der leidenschaftlichen Motivation von 
                            <span style="color:var(--accent-gold);">Jürgen Klopp</span>.
                        </p>

                        <div style="background: rgba(57,255,20,0.05); border-left: 3px solid var(--neon-green); padding: 15px; margin-bottom: 20px;">
                            <h4 style="color:var(--neon-green); font-size: 0.8rem; margin-bottom: 5px;">SCHRITT 1: KI-KERN LADEN</h4>
                            <p style="color:#ccc; font-size: 0.75rem;">Ollama muss auf deinem MacBook oder PC gestartet sein.</p>
                            <a href="https://ollama.com/download" target="_blank" class="pro-btn-gold" style="display: inline-block; margin-top: 10px; text-decoration: none; text-align: center; width: auto; padding: 8px 20px;">
                                <i class="fas fa-download"></i> OLLAMA DOWNLOAD
                            </a>
                        </div>

                        <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #fff; padding: 15px;">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 5px;">SCHRITT 2: TURBO-MODUS STARTEN</h4>
                            <p style="color:#ccc; font-size: 0.75rem;">Terminal öffnen und das Phi-3 Modell laden:</p>
                            <code style="display: block; background: #000; padding: 10px; margin-top: 10px; color: var(--neon-green); font-size: 0.7rem; border-radius: 5px;">
                                ollama run phi3
                            </code>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color:#fff; margin-bottom:20px; font-size: 1rem;"><i class="fas fa-terminal"></i> BROWSER-FREIGABE (CORS)</h3>
                        
                        <p style="color:#888; font-size: 0.85rem; line-height: 1.6; margin-bottom: 15px;">
                            Damit Toni live mit deinem Cockpit kommunizieren darf, muss der Zugriff erlaubt sein:
                        </p>

                        <p style="color:#aaa; font-size: 0.6rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Für MacBook (Einmaliger Befehl):</p>
                        <textarea readonly style="width: 100%; background: #000; color: var(--data-cyan); border: 1px solid #333; padding: 8px; font-family: monospace; font-size: 0.65rem; height: 50px; border-radius: 5px; resize: none; margin-bottom: 10px;">
OLLAMA_ORIGINS="*" ollama serve</textarea>

                        <p style="color:#aaa; font-size: 0.6rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Für Windows (PowerShell):</p>
                        <textarea readonly style="width: 100%; background: #000; color: #777; border: 1px solid #333; padding: 8px; font-family: monospace; font-size: 0.65rem; height: 50px; border-radius: 5px; resize: none;">
$env:OLLAMA_ORIGINS="*"; ollama serve</textarea>
                        
                        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 10px;">SYSTEM-INFO</h4>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span style="color:#666; font-size: 0.7rem;">Modell:</span>
                                <span style="color:var(--neon-green); font-size: 0.7rem;">Phi-3 Turbo (3.8B)</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color:#666; font-size: 0.7rem;">Audio-Status:</span>
                                <span style="color:#fff; font-size: 0.7rem;">VOICE-ENGINE BEREIT</span>
                            </div>
                        </div>

                        <button class="pro-btn-gold" onclick="location.reload()" style="margin-top: 20px; width: 100%;">SYSTEM-REFRESH</button>
                    </div>

                </div>
            </div>
        `;
        content.innerHTML = html;
    },

    updateStatusOnly() {
        const title = document.getElementById('settings-ai-title');
        const latency = document.getElementById('settings-latency');
        if (!title) return;

        const aiStatus = window.aiOnline ? 'ONLINE' : 'OFFLINE';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3b30';

        title.innerHTML = `<i class="fas fa-brain" style="color:${aiColor}; margin-right: 10px;"></i> STATUS: <span style="color:${aiColor}">${aiStatus}</span>`;
    }
};
