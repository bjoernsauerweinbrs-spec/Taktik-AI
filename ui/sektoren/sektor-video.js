/**
 * TONI 2.0 - SEKTOR SKILLS VIDEOANALYSE
 * Version: 2.7 (Drill-Selector & AI-Sync Integration)
 */
window.SektorVideo = {
    currentDrill: "Allround-Check",
    stream: null,
    animationFrame: null,

    /**
     * Wechselt den Analyse-Modus und aktualisiert Referenz-Daten
     */
    setupDrill(type) {
        this.currentDrill = type;
        this.updateYouTubeReferenz(type);
        
        // ToniVoice Feedback
        if (window.ToniVoice) {
            window.ToniVoice.speak(`Analyse-Modus auf ${type} umgestellt. Ich lade die Referenzwerte.`);
        }
        
        // UI-Label direkt aktualisieren
        const label = document.getElementById('video-status-label');
        if (label) label.innerText = `MODUS: ${type.toUpperCase()}`;
    },

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
        if(this.currentDrill !== "Allround-Check") {
            this.updateYouTubeReferenz(this.currentDrill);
        }
    },

    updateYouTubeReferenz(query) {
        const ytContainer = document.getElementById('youtube-frame-container');
        if (!ytContainer) return;
        
        // Suche gezielt nach Coaching Points und Zeitlupe
        const searchQuery = encodeURIComponent(`football tutorial ${query} slow motion coaching points`);
        ytContainer.innerHTML = `
            <iframe width="100%" height="100%" 
                src="https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>`;
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid var(--data-cyan); padding-bottom: 15px;">
                <div>
                    <h2 style="color:var(--data-cyan); letter-spacing: 2px;">SKILLS VIDEO-ANALYST</h2>
                    <span id="video-status-label" style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 1px;">MODUS: ${this.currentDrill.toUpperCase()}</span>
                </div>
                <button class="tactic-btn" onclick="window.SektorVideo.stopCamera(); window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 80px;">
                <div id="youtube-frame-container" style="background: #000; border-radius: 15px; border: 1px solid #333; height: 380px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <i class="fab fa-youtube" style="font-size: 4rem; color: #ff0000; opacity: 0.3;"></i>
                </div>

                <div style="background: #000; border-radius: 15px; border: 2px solid var(--neon-green); height: 380px; position: relative; overflow: hidden;">
                    <video id="player-cam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <canvas id="skeleton-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
                    
                    <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.7); padding: 10px; border-top: 1px solid var(--neon-green);">
                        <p id="toni-video-feedback" style="color: #fff; font-size: 0.75rem; text-align: center;">Kamera bereit für biomechanischen Scan.</p>
                    </div>
                </div>
            </div>

            <div class="video-action-bar" style="position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 900px; display: flex; gap: 10px; background: rgba(13,20,33,0.95); padding: 15px; border-radius: 50px; border: 1px solid var(--data-cyan); box-shadow: 0 0 30px rgba(0,209,255,0.3); z-index: 1000;">
                
                <select id="drill-selector" onchange="window.SektorVideo.setupDrill(this.value)" 
                    style="background: #000; color: var(--data-cyan); border: 1px solid var(--data-cyan); border-radius: 20px; padding: 5px 15px; font-size: 0.8rem; outline: none; cursor:pointer;">
                    <option value="Allround-Check" ${this.currentDrill === 'Allround-Check' ? 'selected' : ''}>ALLROUND-CHECK</option>
                    <option value="zidane turn" ${this.currentDrill === 'zidane turn' ? 'selected' : ''}>ZIDANE TURN</option>
                    <option value="torschuss" ${this.currentDrill === 'torschuss' ? 'selected' : ''}>TORSCHUSS</option>
                    <option value="dribbling" ${this.currentDrill === 'dribbling' ? 'selected' : ''}>DRIBBLING (TIEF)</option>
                </select>

                <button class="tool-btn" onclick="window.ToniVoice.toggle()" style="background:none; border:none; color:var(--neon-green); cursor:pointer;" title="Sprachbefehl">
                    <i class="fas fa-microphone" style="font-size: 1.5rem;"></i>
                </button>
                
                <input type="text" id="video-command-input" placeholder="Befehl an Toni senden..." 
                    style="flex:1; background:transparent; border:none; color:#fff; outline:none; font-family:sans-serif;">
                
                <button class="pro-btn-gold" style="padding: 8px 20px; background: var(--data-cyan); color: #000; border: none;" onclick="window.SektorVideo.transferToBoard()" title="An Taktik-Board senden">
                    <i class="fas fa-draw-polygon"></i> BOARD
                </button>

                <button id="camera-trigger-btn" class="pro-btn-gold" style="padding: 8px 20px;" onclick="window.SektorVideo.startCamera()">
                    <i class="fas fa-video"></i> CAM
                </button>
            </div>
        `;

        setTimeout(() => {
            const inp = document.getElementById('video-command-input');
            if(inp) inp.addEventListener('keypress', (e) => { if(e.key === 'Enter') this.sendLocalCommand(); });
        }, 100);
    },

    async transferToBoard() {
        const feedback = document.getElementById('toni-video-feedback');
        const statusLabel = document.getElementById('video-status-label');
        
        feedback.innerText = "Analysiere Bewegungsvektoren...";
        statusLabel.innerText = "TRANSFER LÄUFT...";
        statusLabel.style.color = "var(--accent-gold)";

        if (window.ToniVoice) window.ToniVoice.speak("Ich extrahiere den Laufweg.");

        setTimeout(() => {
            if (window.arena) {
                const startX = 35; const startY = 60;
                const endX = 15;   const endY = 40;
                window.arena.addPathFromVideo(startX, startY, endX, endY, 'arrow');
                
                feedback.innerHTML = `<span style="color:var(--neon-green);">Vektoren an Board gesendet!</span>`;
                statusLabel.innerText = `MODUS: ${this.currentDrill.toUpperCase()}`;
                statusLabel.style.color = "var(--neon-green)";
            }
        }, 2000);
    },

    sendLocalCommand() {
        const inp = document.getElementById('video-command-input');
        if (inp && inp.value.trim()) {
            window.handleCommand(inp.value);
            inp.value = "";
        }
    },

    async startCamera() {
        const video = document.getElementById('player-cam');
        const btn = document.getElementById('camera-trigger-btn');
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" } 
            });
            video.srcObject = this.stream;
            document.getElementById('toni-video-feedback').innerText = "KI-SCAN AKTIV: Analyse gestartet.";
            
            if (btn) {
                btn.innerHTML = `<i class="fas fa-video-slash"></i> STOP`;
                btn.onclick = () => this.stopCamera();
            }
            
            this.runVisionLoop();
        } catch (err) {
            alert("Kamera-Fehler. Bitte Berechtigungen prüfen.");
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.render(); 
    },

    runVisionLoop() {
        const video = document.getElementById('player-cam');
        const canvas = document.getElementById('skeleton-canvas');
        if (!video || !canvas || !this.stream) return;

        if (window.ToniVision && window.ToniVision.isReady) {
            window.ToniVision.analyzeFrame(video, canvas);
        }

        this.animationFrame = requestAnimationFrame(() => this.runVisionLoop());
    }
};
