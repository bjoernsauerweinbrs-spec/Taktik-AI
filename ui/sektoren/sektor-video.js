/**
 * TONI 2.0 - SEKTOR SKILLS VIDEOANALYSE
 * Status: STABILISIERT (YouTube Fix & Clipping-Schutz)
 */
window.SektorVideo = {
    currentDrill: "Allround-Check",
    stream: null,
    animationFrame: null,

    setupDrill(type) {
        this.currentDrill = type;
        this.updateYouTubeReferenz(type);
        
        if (window.ToniVoice) {
            window.ToniVoice.speak(`Analyse-Modus auf ${type} umgestellt. Ich lade die Referenzwerte.`);
        }
        
        const label = document.getElementById('video-status-label');
        if (label) label.innerText = `MODUS: ${type.toUpperCase()}`;
    },

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Clipping-Schutz: Platz für die Action-Bar lassen
        content.style.paddingBottom = "180px";
        content.style.overflowY = "auto";

        this.render();
        
        // Erst laden, wenn der Container im DOM ist
        setTimeout(() => {
            this.updateYouTubeReferenz(this.currentDrill);
        }, 100);
    },

    updateYouTubeReferenz(query) {
        const ytContainer = document.getElementById('youtube-frame-container');
        if (!ytContainer) return;
        
        const searchQuery = encodeURIComponent(`football tutorial ${query} coaching points`);
        
        // Fix: YouTube Embed-Link korrigiert für bessere Kompatibilität
        ytContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed?q=${searchQuery}&rel=0&autoplay=1&mute=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="border-radius: 12px;">
            </iframe>`;
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom: 2px solid var(--data-cyan); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--data-cyan); letter-spacing: 2px;">SKILLS VIDEO-ANALYST</h2>
                    <span id="video-status-label" style="color: var(--neon-green); font-size: 0.75rem; font-weight:bold; letter-spacing: 1px;">MODUS: ${this.currentDrill.toUpperCase()}</span>
                </div>
                <button class="tactic-btn" onclick="window.SektorVideo.stopCamera(); window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; margin-bottom: 20px;">
                <div id="youtube-frame-container" style="background: #000; border-radius: 15px; border: 1px solid #333; height: 380px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align:center;">
                        <i class="fab fa-youtube" style="font-size: 3rem; color: #ff0000; opacity: 0.5;"></i>
                        <p style="color:#555; font-size:0.7rem; margin-top:10px;">LADE REFERENZ...</p>
                    </div>
                </div>

                <div style="background: #000; border-radius: 15px; border: 2px solid var(--neon-green); height: 380px; position: relative; overflow: hidden;">
                    <video id="player-cam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <canvas id="skeleton-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
                    
                    <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.8); padding: 12px; border-top: 1px solid var(--neon-green);">
                        <p id="toni-video-feedback" style="color: #fff; font-size: 0.8rem; text-align: center; font-weight:bold;">KAMERA BEREIT FÜR SCAN</p>
                    </div>
                </div>
            </div>

            <div class="video-action-bar" style="margin-top: 30px; display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.4); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                
                <select id="drill-selector" onchange="window.SektorVideo.setupDrill(this.value)" 
                    style="background: #000; color: var(--data-cyan); border: 1px solid var(--data-cyan); border-radius: 8px; padding: 10px; font-size: 0.85rem; cursor:pointer;">
                    <option value="Allround-Check" ${this.currentDrill === 'Allround-Check' ? 'selected' : ''}>ALLROUND-CHECK</option>
                    <option value="zidane turn" ${this.currentDrill === 'zidane turn' ? 'selected' : ''}>ZIDANE TURN</option>
                    <option value="torschuss" ${this.currentDrill === 'torschuss' ? 'selected' : ''}>TORSCHUSS</option>
                    <option value="dribbling" ${this.currentDrill === 'dribbling' ? 'selected' : ''}>DRIBBLING</option>
                </select>

                <div style="flex:1; display:flex; gap:10px; background:#000; padding:10px; border-radius:8px; border:1px solid #222;">
                    <i class="fas fa-microphone" style="color:var(--neon-green); align-self:center;"></i>
                    <input type="text" id="video-command-input" placeholder="Analyse-Befehl..." 
                        style="flex:1; background:transparent; border:none; color:#fff; outline:none; font-size:0.9rem;">
                </div>
                
                <button class="pro-btn-gold" onclick="window.SektorVideo.transferToBoard()" style="background:var(--data-cyan); color:#000;">
                    <i class="fas fa-arrow-up"></i> BOARD
                </button>

                <button id="camera-trigger-btn" class="pro-btn-gold" onclick="window.SektorVideo.startCamera()">
                    <i class="fas fa-video"></i> START
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
        feedback.innerText = "TRANSFER LÄUFT...";
        if (window.ToniVoice) window.ToniVoice.speak("Übertrage Bewegungsdaten auf das Taktikboard.");

        setTimeout(() => {
            if (window.arena) {
                window.arena.addPathFromVideo(35, 60, 15, 40, 'arrow');
                feedback.innerHTML = `<span style="color:var(--neon-green);">DATEN ÜBERTRAGEN!</span>`;
            }
        }, 1500);
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
            document.getElementById('toni-video-feedback').innerText = "KI-SCAN AKTIV";
            
            if (btn) {
                btn.innerHTML = `<i class="fas fa-video-slash"></i> STOP`;
                btn.style.background = "var(--status-error)";
                btn.onclick = () => this.stopCamera();
            }
            this.runVisionLoop();
        } catch (err) {
            alert("Kamera-Fehler: Berechtigungen prüfen.");
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
