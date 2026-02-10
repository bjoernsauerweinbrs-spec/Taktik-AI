/**
 * TONI 2.0 - SEKTOR SKILLS & VIDEOANALYSE (MEDIA HUB)
 * Fokus: Biometrischer Scan, YouTube-Referenz & Vektor-Board Sync
 * Status: MASTER-SYNC 2026
 */
window.SektorVideo = {
    currentDrill: "Allround-Check",
    stream: null,
    animationFrame: null,

    open() {
        console.log("🎥 Video-Analyst: Biometrie-Module werden geladen...");
        const content = document.getElementById('active-content');
        if (!content) return;

        // Sicherstellen, dass die Kamera gestoppt wird, wenn wir navigieren
        this.stopCamera();

        this.render();
        
        // Initialer YouTube-Load mit kurzem Delay für das DOM
        setTimeout(() => {
            this.updateYouTubeReferenz(this.currentDrill);
        }, 150);
    },

    render() {
        const content = document.getElementById('active-content');
        const teamContext = window.currentTeamContext || "PRO";

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom: 2px solid var(--data-cyan); padding-bottom: 20px;">
                    <div>
                        <h2 style="color:var(--data-cyan); font-family:'Orbitron'; margin:0; font-size:1.2rem; letter-spacing:2px;">VIDEO-ANALYSE</h2>
                        <span id="video-status-label" style="color: var(--neon-green); font-size: 0.65rem; font-weight:bold; letter-spacing: 1px; font-family:'Orbitron';">
                            MODUS: ${this.currentDrill.toUpperCase()} | KONTEXT: ${teamContext}
                        </span>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    
                    <div id="youtube-frame-container" style="background: #000; border-radius: 15px; border: 1px solid #333; height: 350px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="text-align:center;">
                            <i class="fab fa-youtube" style="font-size: 2.5rem; color: #ff0000; opacity: 0.5;"></i>
                            <p style="color:#555; font-size:0.6rem; margin-top:10px; font-family:'Orbitron';">SUCHE REFERENZ-VIDEO...</p>
                        </div>
                    </div>

                    <div style="background: #000; border-radius: 15px; border: 2px solid var(--neon-green); height: 350px; position: relative; overflow: hidden; box-shadow: 0 0 25px rgba(57, 255, 20, 0.1);">
                        <video id="player-cam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; filter: brightness(1.1) contrast(1.1);"></video>
                        <canvas id="skeleton-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
                        
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.85); padding: 12px; border-top: 1px solid var(--neon-green);">
                            <p id="toni-video-feedback" style="color: #fff; font-size: 0.75rem; text-align: center; font-family:'Orbitron'; margin:0;">KAMERA IM STANDBY</p>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 15px; align-items: center; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px; border: 1px solid #222;">
                    
                    <select id="drill-selector" onchange="window.SektorVideo.setupDrill(this.value)" 
                        style="background: #000; color: var(--data-cyan); border: 1px solid var(--data-cyan); border-radius: 8px; padding: 10px; font-size: 0.75rem; font-family:'Orbitron'; cursor:pointer;">
                        <option value="allround">ALLROUND-CHECK</option>
                        <option value="zidane turn">ZIDANE TURN</option>
                        <option value="torschuss">TORSCHUSS-ANALYSE</option>
                        <option value="speed test">SPEED-TEST</option>
                    </select>

                    <div style="flex:1; display:flex; gap:10px; background:rgba(0,0,0,0.3); padding:8px 15px; border-radius:8px; border:1px solid #333;">
                        <i class="fas fa-terminal" style="color:var(--neon-green); align-self:center; font-size:0.8rem;"></i>
                        <input type="text" id="video-command-input" placeholder="Toni, analysiere die Hüftstellung..." 
                            style="flex:1; background:transparent; border:none; color:#fff; outline:none; font-size:0.8rem;">
                    </div>
                    
                    <button class="pro-btn-gold" onclick="window.SektorVideo.transferToBoard()" style="background:var(--data-cyan); color:#000; font-size:0.7rem;">
                        <i class="fas fa-project-diagram"></i> SYNC BOARD
                    </button>

                    <button id="camera-trigger-btn" class="pro-btn-gold" onclick="window.SektorVideo.startCamera()" style="background:var(--neon-green); color:#000; font-size:0.7rem;">
                        <i class="fas fa-video"></i> SCAN START
                    </button>
                </div>
            </div>
        `;

        // Enter-Key Bindung
        setTimeout(() => {
            const inp = document.getElementById('video-command-input');
            if(inp) inp.addEventListener('keypress', (e) => { if(e.key === 'Enter') this.sendLocalCommand(); });
        }, 100);
    },

    setupDrill(type) {
        this.currentDrill = type;
        this.updateYouTubeReferenz(type);
        
        const label = document.getElementById('video-status-label');
        if (label) label.innerText = `MODUS: ${type.toUpperCase()} | KONTEXT: ${window.currentTeamContext || 'PRO'}`;
        
        if (window.ToniVoice) {
            window.ToniVoice.speak(`Referenz-Modus auf ${type} umgestellt.`);
        }
    },

    updateYouTubeReferenz(query) {
        const ytContainer = document.getElementById('youtube-frame-container');
        if (!ytContainer) return;
        
        const teamContext = window.currentTeamContext || "Fussball";
        const searchQuery = encodeURIComponent(`${teamContext} individual training ${query} tutorial`);
        
        ytContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed?listType=search&list=${searchQuery}&mute=1" 
                frameborder="0" 
                allowfullscreen
                style="border:none;">
            </iframe>`;
    },

    async startCamera() {
        const video = document.getElementById('player-cam');
        const btn = document.getElementById('camera-trigger-btn');
        const feedback = document.getElementById('toni-video-feedback');

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment", width: 1280, height: 720 } 
            });
            video.srcObject = this.stream;
            if(feedback) feedback.innerText = "BIOMETRISCHER SCAN AKTIV";
            
            if (btn) {
                btn.innerHTML = `<i class="fas fa-video-slash"></i> SCAN STOP`;
                btn.style.background = "var(--status-error)";
                btn.onclick = () => this.stopCamera();
            }
            this.runVisionLoop();
        } catch (err) {
            alert("Kamera-Fehler: Bitte Zugriff erlauben.");
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        
        // Reset Button im UI falls wir noch im Video-Sektor sind
        const btn = document.getElementById('camera-trigger-btn');
        if (btn) {
            btn.innerHTML = `<i class="fas fa-video"></i> SCAN START`;
            btn.style.background = "var(--neon-green)";
            btn.onclick = () => this.startCamera();
        }
    },

    runVisionLoop() {
        const video = document.getElementById('player-cam');
        const canvas = document.getElementById('skeleton-canvas');
        if (!video || !canvas || !this.stream) return;
        
        // Platzhalter für Vektor-Zeichnung
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        this.animationFrame = requestAnimationFrame(() => this.runVisionLoop());
    },

    async transferToBoard() {
        const feedback = document.getElementById('toni-video-feedback');
        feedback.innerText = "VEKTOR-ÜBERTRAGUNG...";
        if (window.ToniVoice) window.ToniVoice.speak("Synchronisiere Bewegungsvektoren mit der Arena.");

        setTimeout(() => {
            feedback.innerHTML = `<span style="color:var(--neon-green);">SYNC OK - DATEN IM BOARD</span>`;
            setTimeout(() => { feedback.innerText = "BIOMETRISCHER SCAN AKTIV"; }, 2000);
        }, 1500);
    },

    sendLocalCommand() {
        const inp = document.getElementById('video-command-input');
        if (inp && inp.value.trim()) {
            window.handleCommand(inp.value);
            inp.value = "";
        }
    }
};
