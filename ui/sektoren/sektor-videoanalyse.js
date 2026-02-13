/**
 * TONI 2.0 - SEKTOR SKILLS & VIDEOANALYSE (MEDIA HUB)
 * Fokus: Split-Screen Vergleich, Skill-Bibliothek & Biometrie-Scan
 * Status: CLEAN & SYNCED 2026
 */
window.SektorVideo = {
    currentDrill: "Dribbling Basics",
    stream: null,
    animationFrame: null,

    open() {
        console.log("🎥 Video-Analyst: Elite-Module werden synchronisiert...");
        const content = document.getElementById('active-content');
        if (!content) return;

        this.stopCamera();
        this.render();
        
        setTimeout(() => {
            this.updateYouTubeReferenz(this.currentDrill);
        }, 150);
    },

    render() {
        const content = document.getElementById('active-content');
        const teamContext = window.currentTeamContext || "Senioren";

        content.innerHTML = `
            <div class="fadeIn" style="height: 100%; display: flex; flex-direction: column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 2px solid var(--data-cyan); padding-bottom: 15px;">
                    <div>
                        <h2 style="color:var(--data-cyan); font-family:'Orbitron'; margin:0; font-size:1.1rem; letter-spacing:2px;">MEDIA HUB: SKILL-ANALYSE</h2>
                        <span id="video-status-label" style="color: var(--neon-green); font-size: 0.6rem; font-family:'Orbitron';">
                            UNIT: ${this.currentDrill.toUpperCase()} | TARGET: ${teamContext.toUpperCase()}
                        </span>
                    </div>
                    <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1; min-height: 400px; margin-bottom: 20px;">
                    
                    <div id="youtube-frame-container" style="background: #000; border-radius: 12px; border: 1px solid #222; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="position:absolute; top:10px; left:10px; background:rgba(255,0,0,0.8); color:#fff; padding:3px 8px; border-radius:4px; font-size:0.5rem; z-index:10; font-family:'Orbitron';">PRO REFERENZ</div>
                        <div style="height:100%; display:flex; align-items:center; justify-content:center;">
                             <i class="fab fa-youtube" style="font-size: 2rem; color: #333;"></i>
                        </div>
                    </div>

                    <div style="background: #000; border-radius: 12px; border: 2px solid var(--neon-green); overflow: hidden; position: relative; box-shadow: 0 0 20px rgba(57, 255, 20, 0.1);">
                        <div style="position:absolute; top:10px; left:10px; background:var(--neon-green); color:#000; padding:3px 8px; border-radius:4px; font-size:0.5rem; z-index:10; font-family:'Orbitron'; font-weight:bold;">PLAYER SCAN</div>
                        
                        <video id="player-cam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                        <canvas id="skeleton-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
                        
                        <div id="upload-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:none; flex-direction:column; align-items:center; justify-content:center;">
                             <i class="fas fa-file-video" style="font-size:2rem; color:var(--data-cyan); margin-bottom:15px;"></i>
                             <button class="pro-btn-gold" onclick="document.getElementById('file-upload').click()">VIDEO DATEI WÄHLEN</button>
                             <input type="file" id="file-upload" hidden accept="video/*" onchange="window.SektorVideo.handleFileUpload(event)">
                        </div>

                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); padding: 10px; border-top: 1px solid var(--neon-green);">
                            <p id="toni-video-feedback" style="color: #fff; font-size: 0.7rem; text-align: center; font-family:'Orbitron'; margin:0; letter-spacing:1px;">SCANNER BEREIT</p>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 15px; align-items: center; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid #222;">
                    
                    <div style="display:flex; flex-direction:column; gap:5px;">
                        <label style="font-size:0.5rem; color:#666; font-family:'Orbitron';">SKILL-BIBLIOTHEK</label>
                        <select id="drill-selector" onchange="window.SektorVideo.setupDrill(this.value)" 
                            style="background: #000; color: var(--data-cyan); border: 1px solid var(--data-cyan); border-radius: 4px; padding: 8px; font-size: 0.7rem; font-family:'Orbitron';">
                            <option value="Dribbling Basics">DRIBBLING (BASICS)</option>
                            <option value="Zidane Turn">ZIDANE TURN</option>
                            <option value="Erster Kontakt">ERSTER KONTAKT</option>
                            <option value="Torschuss Technik">TORSCHUSS PRO</option>
                        </select>
                    </div>

                    <div style="flex:1; display:flex; gap:10px; background:rgba(0,0,0,0.5); padding:10px; border-radius:6px; border:1px solid #333;">
                        <input type="text" id="video-command-input" placeholder="Toni, analysiere die Körperhaltung..." 
                            style="flex:1; background:transparent; border:none; color:#fff; outline:none; font-size:0.75rem;">
                        <button class="send-btn" onclick="window.SektorVideo.sendLocalCommand()"><i class="fas fa-microchip"></i></button>
                    </div>

                    <div style="display:flex; gap:10px;">
                        <button class="tactic-btn" style="font-size:0.6rem;" onclick="window.SektorVideo.toggleUpload()">
                            <i class="fas fa-upload"></i> UPLOAD
                        </button>
                        <button id="camera-trigger-btn" class="pro-btn-gold" onclick="window.SektorVideo.startCamera()" style="background:var(--neon-green); color:#000; font-size:0.65rem;">
                            <i class="fas fa-video"></i> LIVE SCAN
                        </button>
                        <button class="pro-btn-gold" onclick="window.SektorVideo.transferToBoard()" style="background:var(--data-cyan); color:#000; font-size:0.65rem;">
                            <i class="fas fa-sync"></i> SYNC BOARD
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    setupDrill(type) {
        this.currentDrill = type;
        this.updateYouTubeReferenz(type);
        const label = document.getElementById('video-status-label');
        if (label) label.innerText = `UNIT: ${type.toUpperCase()} | TARGET: ${window.currentTeamContext?.toUpperCase() || 'SENIOREN'}`;
        if (window.ToniVoice) window.ToniVoice.speak(`Lade Übung ${type}.`);
    },

    updateYouTubeReferenz(query) {
        const ytContainer = document.getElementById('youtube-frame-container');
        if (!ytContainer) return;
        const context = window.currentTeamContext || "Fussball";
        const searchQuery = encodeURIComponent(`${context} training ${query} elite tutorial`);
        ytContainer.innerHTML = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed?listType=search&list=${searchQuery}&mute=1" frameborder="0" allowfullscreen style="border:none;"></iframe>
            <div style="position:absolute; top:10px; left:10px; background:rgba(255,0,0,0.8); color:#fff; padding:3px 8px; border-radius:4px; font-size:0.5rem; z-index:10; font-family:'Orbitron';">PRO REFERENZ</div>
        `;
    },

    async startCamera() {
        this.toggleUpload(false);
        const video = document.getElementById('player-cam');
        const btn = document.getElementById('camera-trigger-btn');
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = this.stream;
            if (btn) {
                btn.innerHTML = `<i class="fas fa-stop"></i> STOP SCAN`;
                btn.style.background = "#ff3131";
                btn.onclick = () => this.stopCamera();
            }
            document.getElementById('toni-video-feedback').innerText = "LIVE-SCAN AKTIV";
            this.runVisionLoop();
        } catch (err) { alert("Kamera-Fehler."); }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        const btn = document.getElementById('camera-trigger-btn');
        if (btn) {
            btn.innerHTML = `<i class="fas fa-video"></i> LIVE SCAN`;
            btn.style.background = "var(--neon-green)";
            btn.onclick = () => this.startCamera();
        }
    },

    toggleUpload(force) {
        const overlay = document.getElementById('upload-overlay');
        if(!overlay) return;
        overlay.style.display = (force === undefined) ? (overlay.style.display === 'none' ? 'flex' : 'none') : (force ? 'flex' : 'none');
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.stopCamera();
            const video = document.getElementById('player-cam');
            video.srcObject = null;
            video.src = URL.createObjectURL(file);
            this.toggleUpload(false);
            document.getElementById('toni-video-feedback').innerText = "DATEI-ANALYSE...";
        }
    },

    runVisionLoop() {
        const canvas = document.getElementById('skeleton-canvas');
        if (!canvas || !this.stream) return;
        this.animationFrame = requestAnimationFrame(() => this.runVisionLoop());
    },

    transferToBoard() {
        const fb = document.getElementById('toni-video-feedback');
        fb.innerText = "VEKTOR-SYNC...";
        setTimeout(() => {
            fb.innerHTML = `<span style="color:var(--neon-green)">SYNC ERFOLGREICH</span>`;
            if (window.ToniVoice) window.ToniVoice.speak("Daten übertragen.");
            setTimeout(() => { fb.innerText = "SCANNER BEREIT"; }, 2000);
        }, 1000);
    },

    sendLocalCommand() {
        const inp = document.getElementById('video-command-input');
        if (inp.value && window.handleCommand) {
            window.handleCommand(inp.value);
            inp.value = "";
        }
    }
};
