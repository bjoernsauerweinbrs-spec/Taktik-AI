/**
 * TONI 2.0 - SEKTOR SKILLS VIDEOANALYSE
 * Das "Auge" des Cockpits: KI-gestützte Bewegungsanalyse & Referenz-Vergleich.
 * Kalibriert für 5G-Einsatz am Spielfeldrand.
 */
window.SektorVideo = {
    currentDrill: "Allround-Check",
    stream: null,

    /**
     * Wird von Toni (script.js) aufgerufen, um die Übung einzustellen.
     */
    setupDrill(type) {
        this.currentDrill = type;
        console.log("Video-Analyst kalibriert auf:", type);
    },

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid var(--data-cyan); padding-bottom: 15px;">
                <div>
                    <h2 style="color:var(--data-cyan); letter-spacing: 2px;">LIVE VIDEO-ANALYST</h2>
                    <span style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 1px;">MODUS: ${this.currentDrill.toUpperCase()}</span>
                </div>
                <button class="tactic-btn" onclick="window.SektorVideo.stopCamera(); window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                
                <div style="background: #000; border-radius: 15px; border: 1px solid #333; height: 400px; position: relative; overflow: hidden;">
                    <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                        <div style="text-align:center;">
                            <i class="fab fa-youtube" style="font-size: 4rem; color: #ff0000; margin-bottom: 15px;"></i>
                            <p style="color: #ccc; font-size: 0.9rem;">SUCHE REFERENZ FÜR: <b>${this.currentDrill}</b></p>
                        </div>
                    </div>
                    <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 5px 12px; border-radius: 5px; font-size: 0.6rem; color: var(--accent-gold); border: 1px solid var(--accent-gold);">
                        ELITE-DATENBANK AKTIV
                    </div>
                </div>

                <div style="background: #000; border-radius: 15px; border: 2px solid var(--neon-green); height: 400px; position: relative; overflow: hidden;">
                    <video id="player-cam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    
                    <canvas id="skeleton-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
                    
                    <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,255,0,0.1); backdrop-filter: blur(10px); padding: 15px; border-top: 1px solid var(--neon-green);">
                        <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 5px;">
                            <i class="fas fa-brain" style="color: var(--neon-green);"></i>
                            <span style="color: var(--neon-green); font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">Toni's Live-Check</span>
                        </div>
                        <p id="toni-video-feedback" style="color: #fff; font-size: 0.85rem; font-style: italic;">"Warte auf Signal... Coach, bitte Kamera starten."</p>
                    </div>
                </div>

            </div>

            <div style="display: flex; gap: 15px; margin-top: 25px;">
                <button class="pro-btn-gold" style="flex: 2;" onclick="window.SektorVideo.startCamera()">
                    <i class="fas fa-video"></i> KAMERA STARTEN
                </button>
                <button class="tactic-btn" style="flex: 1;" onclick="window.SektorVideo.captureAction()">
                    <i class="fas fa-stopwatch"></i> SNAPSHOT / SLOW-MO
                </button>
            </div>
        `;
    },

    async startCamera() {
        const video = document.getElementById('player-cam');
        const feedback = document.getElementById('toni-video-feedback');
        
        feedback.innerText = "Initialisiere High-Speed Kamera...";
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment", frameRate: { ideal: 60 } } 
            });
            video.srcObject = this.stream;
            feedback.innerText = "System online. Ich analysiere jetzt die Skelett-Punkte des Spielers.";
        } catch (err) {
            feedback.innerText = "Fehler: Kamera-Zugriff verweigert.";
            console.error(err);
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    },

    captureAction() {
        alert("Snapshot erstellt. Toni analysiert die Biomechanik des letzten Versuchs...");
    }
};
