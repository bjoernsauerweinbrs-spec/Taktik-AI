/**
 * TONI 2.0 - SEKTOR SETTINGS (KI-SETUP)
 * Zentrale für die lokale KI-Anbindung (Ollama).
 */
window.SektorSettings = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        const aiStatus = window.aiOnline ? 'AKTIV' : 'INAKTIV';
        const aiColor = window.aiOnline ? 'var(--neon-green)' : '#ff3b30';

        let html = `
            <div style="padding: 0 10px; animation: fadeIn 0.5s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
                    <div>
                        <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">KI-SETUP & SYSTEM</h2>
                        <span style="color: #555; font-size: 0.7rem; letter-spacing: 1px;">KONFIGURATION DER SUPER-INTELLIGENZ</span>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    
                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color:#fff; margin-bottom:20px; font-size: 1rem;">
                            <i class="fas fa-microchip" style="color:${aiColor}; margin-right: 10px;"></i> 
                            STATUS: <span style="color:${aiColor}">${aiStatus}</span>
                        </h3>
                        
                        <p style="color:#888; font-size: 0.85rem; line-height: 1.6; margin-bottom: 20px;">
                            Um die <strong>Toni Super-Intelligenz (A-Lizenz Modus)</strong> zu nutzen, muss die lokale KI "Ollama" auf diesem Rechner laufen. 
                            Dies garantiert 100% Datenschutz – deine Taktiken bleiben privat.
                        </p>

                        <div style="background: rgba(57,255,20,0.05); border-left: 3px solid var(--neon-green); padding: 15px; margin-bottom: 20px;">
                            <h4 style="color:var(--neon-green); font-size: 0.8rem; margin-bottom: 5px;">SCHRITT 1: DOWNLOAD</h4>
                            <p style="color:#ccc; font-size: 0.75rem;">Lade Ollama für Windows/Mac herunter und installiere es.</p>
                            <a href="https://ollama.com/download" target="_blank" class="pro-btn-gold" style="display: inline-block; margin-top: 10px; text-decoration: none; text-align: center; width: auto; padding: 8px 20px;">
                                <i class="fas fa-download"></i> OLLAMA DOWNLOAD
                            </a>
                        </div>

                        <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #fff; padding: 15px;">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 5px;">SCHRITT 2: MODELL LADEN</h4>
                            <p style="color:#ccc; font-size: 0.75rem;">Öffne dein Terminal (CMD) und gib diesen Befehl ein:</p>
                            <code style="display: block; background: #000; padding: 10px; margin-top: 10px; color: var(--neon-green); font-size: 0.7rem; border-radius: 5px;">
                                ollama run llama3
                            </code>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color:#fff; margin-bottom:20px; font-size: 1rem;"><i class="fas fa-user-shield"></i> BROWSER-FREIGABE</h3>
                        
                        <p style="color:#888; font-size: 0.85rem; line-height: 1.6; margin-bottom: 15px;">
                            Damit dein Browser mit der KI kommunizieren darf, muss Ollama mit einer Erlaubnis (CORS) gestartet werden.
                        </p>

                        <p style="color:#aaa; font-size: 0.7rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Windows Befehl (PowerShell):</p>
                        <textarea readonly style="width: 100%; background: #000; color: #555; border: 1px solid #333; padding: 10px; font-family: monospace; font-size: 0.65rem; height: 80px; border-radius: 5px; resize: none;">
$env:OLLAMA_ORIGINS="*"; ollama serve</textarea>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <h4 style="color:#fff; font-size: 0.8rem; margin-bottom: 15px;">SYSTEM-RESOURCEN</h4>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color:#666; font-size: 0.75rem;">KI-Modell:</span>
                                <span style="color:var(--neon-green); font-size: 0.75rem;">Llama 3 (8B)</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color:#666; font-size: 0.75rem;">Latenz:</span>
                                <span style="color:#fff; font-size: 0.75rem;">${window.aiOnline ? 'Optimiert' : 'N/A'}</span>
                            </div>
                        </div>

                        <button class="pro-btn-gold" onclick="location.reload()" style="margin-top: 30px; width: 100%;">SYSTEM NEU STARTEN</button>
                    </div>

                </div>
            </div>
        `;
        content.innerHTML = html;
    }
};
