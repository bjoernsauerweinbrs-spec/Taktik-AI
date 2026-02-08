/**
 * TONI 2.0 - SEKTOR SKILLS VIDEOANALYSE
 * Version: 2.1 (Elite Capture & YouTube-Automatik)
 */
window.SektorVideo = {
    currentDrill: "Allround-Check",
    stream: null,
    capturedImage: null,

    setupDrill(type) {
        this.currentDrill = type;
        this.updateYouTubeReferenz(type);
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

        const searchQuery = encodeURIComponent(`football tutorial ${query} slow motion coaching points`);
        
        ytContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid var(--data-cyan); padding-bottom: 15px;">
                <div>
                    <h2 style="color:var(--data-cyan); letter-spacing: 2px;">SKILLS VIDEO-ANALYST</h2>
                    <span style="color: var(--neon-green); font-size: 0.7rem; letter-spacing: 1px;">MODUS: ${this.currentDrill.toUpperCase()}</span>
                </div>
                <button class="tactic-btn" onclick="window.SektorVideo.stopCamera(); window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                
                <div id="youtube-frame-container" style="background: #000; border-radius: 15px; border: 1px solid #333; height: 400px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <i class="fab fa-youtube" style="font-size: 4rem; color: #ff0000; opacity: 0.3;"></i>
                </div>

                <div style="background: #000; border-radius: 15px; border: 2px solid var(--neon-green); height: 400px; position: relative; overflow: hidden;">
                    <video id="player-cam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    
                    <canvas id="skeleton-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
                    
                    <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,255,0,0.1); backdrop-filter: blur(10px); padding: 15px; border-top: 1px solid var(--neon-green);">
                        <span style="color: var(--neon-green); font-size: 0.7rem; font-weight: bold; text-transform: uppercase;">Toni's Live-Check</span>
                        <p id="toni-video-feedback" style="color: #fff; font-size: 0.85rem; font-style: italic; margin-top: 5px;">"Bereit für die Analyse, Coach."</p>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 15px; margin-top: 25px;">
                <button id="cam-toggle-btn" class="pro-btn-gold" style="flex: 2;" onclick="window.SektorVideo.startCamera()">
                    <i class="fas fa-video"></i> KAMERA AKTIVIEREN
                </button>
                <button class="tactic-btn" style="flex: 1;" onclick="window.SektorVideo.captureAction()">
                    <i class="fas fa-camera"></i> SNAPSHOT (ANALYSE)
                </button>
            </div>
            
            <canvas id="capture-canvas" style="display:none;"></canvas>
        `;
    },

    async startCamera() {
        const video = document.getElementById('player-cam');
        const btn = document.getElementById('cam-toggle-btn');
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment", frameRate: { ideal: 60 } } 
            });
            video.srcObject = this.stream;
            btn.innerHTML = `<i class="fas fa-video-slash"></i> KAMERA STOPPEN`;
            btn.onclick = () => this.stopCamera();
            document.getElementById('toni-video-feedback').innerText = "Kamera läuft mit 60 FPS. Ich scanne jetzt...";
        } catch (err) {
            alert("Kamera-Zugriff fehlgeschlagen. Bitte Berechtigung prüfen.");
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.render(); // UI zurücksetzen
    },

    captureAction() {
        const video = document.getElementById('player-cam');
        const canvas = document.getElementById('capture-canvas');
        if (!video || !this.stream) return alert("Kamera ist nicht aktiv!");

        // Snapshot machen
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        this.capturedImage = canvas.toDataURL('image/jpeg');
        document.getElementById('toni-video-feedback').innerHTML = 
            `<span style="color:var(--accent-gold);">SNAPSHOT FIXIERT!</span> Toni analysiert die Körperhaltung...`;
        
        // Hier folgt als Nächstes die Übergabe an das Vision-Modell
        console.log("Snapshot für Analyse bereit.");
    }
};
