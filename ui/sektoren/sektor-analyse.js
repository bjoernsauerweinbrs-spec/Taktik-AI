/**
 * TONI 2.0 - PERFORMANCE LAB (VIDEO & VISION)
 * Fokus: YouTube Trick-Suche, Live-Cam Vergleich & Biometrie
 */
window.SektorAnalyse = {
    activeMode: 'vision', // 'vision' oder 'biometrie'

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";
        this.render();
    },

    switchMode(mode) {
        this.activeMode = mode;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(57, 255, 20, 0.2); padding-bottom:15px;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <h2 style="color: var(--neon-green); margin:0; font-size:1.1rem; letter-spacing:2px;">PERFORMANCE LAB</h2>
                    <div style="display:flex; background:#000; border:1px solid #333; border-radius:8px; padding:3px;">
                        <button onclick="window.SektorAnalyse.switchMode('vision')" 
                            style="padding:5px 12px; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:0.65rem;
                            ${this.activeMode === 'vision' ? 'background:var(--neon-green); color:#000;' : 'background:transparent; color:#666;'}">VISION & VIDEO</button>
                        <button onclick="window.SektorAnalyse.switchMode('biometrie')" 
                            style="padding:5px 12px; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:0.65rem;
                            ${this.activeMode === 'biometrie' ? 'background:var(--data-cyan); color:#000;' : 'background:transparent; color:#666;'}">BIOMETRIE</button>
                    </div>
                </div>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div id="lab-content">
                ${this.activeMode === 'vision' ? this.renderVisionModule() : this.renderBiometrieModule()}
            </div>
            
            <div id="analysis-detail-view" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:var(--bg-deep); z-index:100; padding:40px; border-radius:24px; overflow-y:auto;"></div>
        `;

        if (this.activeMode === 'biometrie') this.renderCards();
    },

    renderVisionModule() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 60vh;">
                <div style="background:#000; border:2px solid var(--data-cyan); border-radius:15px; overflow:hidden; display:flex; flex-direction:column;">
                    <div style="background:var(--data-cyan); color:#000; padding:8px 15px; font-weight:900; font-size:0.7rem; display:flex; justify-content:space-between;">
                        <span><i class="fab fa-youtube"></i> TONI YOUTUBE COACH</span>
                        <span id="video-name">WARTE AUF BEFEHL...</span>
                    </div>
                    <div id="youtube-player" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0a0a0a;">
                        <i class="fas fa-search" style="font-size:3rem; color:#1a1a1a; margin-bottom:15px;"></i>
                        <p style="color:#444; font-size:0.8rem; text-align:center; padding:0 20px;">Sag zum Beispiel: <br>"Toni, zeig mir ein Tutorial für den Regenbogen-Trick."</p>
                    </div>
                </div>

                <div style="background:#000; border:2px solid var(--neon-green); border-radius:15px; overflow:hidden; display:flex; flex-direction:column;">
                    <div style="background:var(--neon-green); color:#000; padding:8px 15px; font-weight:900; font-size:0.7rem; display:flex; justify-content:space-between;">
                        <span><i class="fas fa-video"></i> TONI VISION ANALYSER</span>
                        <div style="display:flex; gap:15px;">
                            <i class="fas fa-camera" onclick="window.SektorAnalyse.startLiveVision()" style="cursor:pointer;" title="Kamera starten"></i>
                            <i class="fas fa-file-import" onclick="document.getElementById('video-upload').click()" style="cursor:pointer;" title="Video hochladen"></i>
                            <input type="file" id="video-upload" style="display:none" accept="video/*" onchange="window.SektorAnalyse.handleFileUpload(event)">
                        </div>
                    </div>
                    <div id="vision-container" style="flex:1; background:#051205; position:relative; display:flex; align-items:center; justify-content:center;">
                        <video id="vision-feed" style="width:100%; height:100%; object-fit:cover; display:none;" autoplay playsinline></video>
                        <canvas id="vision-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
                        <div id="vision-placeholder" style="text-align:center;">
                            <i class="fas fa-robot" style="font-size:3rem; color:var(--neon-green); opacity:0.1;"></i>
                            <p style="color:#222; font-size:0.8rem; margin-top:10px;">CAM ODER DATEI WÄHLEN</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top:20px; background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; border-left:4px solid var(--neon-green);">
                <div style="font-size:0.7rem; color:var(--neon-green); font-weight:900; letter-spacing:1px; margin-bottom:5px;">LIVE KI-FEEDBACK</div>
                <p id="vision-feedback" style="color:#ccc; font-size:0.85rem; font-style:italic; margin:0;">"Aktiviere die Kamera, damit ich die Bewegungen deines Spielers mit dem Tutorial-Video abgleichen kann."</p>
            </div>
        `;
    },

    // YouTube Integration (Wird über BriefcaseUI Sprachbefehl gerufen)
    playTrickVideo(trickName) {
        const playerContainer = document.getElementById('youtube-player');
        const videoNameLabel = document.getElementById('video-name');
        if(!playerContainer) return;

        videoNameLabel.innerText = trickName.toUpperCase();
        // Hier simulieren wir die Suche. In Produktion wird hier ein Embed-Link generiert.
        playerContainer.innerHTML = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed?listType=search&list=${trickName}+tutorial+football" 
                    frameborder="0" allowfullscreen></iframe>
        `;
        window.ToniVoice.speak(`Ich habe ein Tutorial für ${trickName} gefunden, Coach.`);
    },

    startLiveVision() {
        const video = document.getElementById('vision-feed');
        const placeholder = document.getElementById('vision-placeholder');
        
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.style.display = 'block';
                placeholder.style.display = 'none';
                window.ToniVoice.speak("Kamera aktiv. Ich analysiere jetzt die Bewegungsabläufe.");
                this.startSkeletonTracking();
            })
            .catch(err => alert("Kamera-Zugriff verweigert oder nicht verfügbar."));
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const video = document.getElementById('vision-feed');
        const placeholder = document.getElementById('vision-placeholder');
        
        video.src = URL.createObjectURL(file);
        video.style.display = 'block';
        placeholder.style.display = 'none';
        video.play();
        window.ToniVoice.speak("Video-Datei geladen. Starte taktische Analyse der Spielsituation.");
    },

    startSkeletonTracking() {
        const feedback = document.getElementById('vision-feedback');
        // Hier würde die MediaPipe Skelett-Erkennung laufen
        setTimeout(() => {
            feedback.innerText = "Toni: Die Hüftdrehung beim Trick-Ansatz ist noch zu steif. Vergleich zum Video: 74% Deckung.";
        }, 3000);
    },

    // --- BIOMETRIE LOGIK (DEIN ORIGINAL) ---
    renderBiometrieModule() {
        return `
            <div class="kabine-header" style="text-align:center; margin-bottom: 25px; border-bottom: 1px solid rgba(57, 255, 20, 0.2); padding-bottom: 15px;">
                <p style="color: var(--text-dim); font-size: 0.7rem; text-transform:uppercase;">MANUELLE DATENERFASSUNG & VITAL-CHECK</p>
            </div>
            <div class="fifa-cards-grid" id="analysis-grid" style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;"></div>
        `;
    },

    renderCards() {
        const grid = document.getElementById('analysis-grid');
        if (!grid) return;
        const players = window.Database ? window.Database.players : [];

        grid.innerHTML = players.map((p, idx) => `
            <div class="fifa-card" onclick="window.SektorAnalyse.showDetails(${idx})" style="width:200px; cursor:pointer;">
                <div style="background:rgba(0,0,0,0.6); border:1px solid #333; padding:15px; border-radius:12px; text-align:center; position:relative;">
                    <div style="position:absolute; top:5px; left:10px; font-weight:900; color:var(--neon-green);">${p.rat || 80}</div>
                    <i class="fas fa-heartbeat" style="position:absolute; top:5px; right:10px; color:var(--status-error); font-size:0.8rem;"></i>
                    <i class="fas fa-user-circle" style="font-size:3rem; color:#444; margin:10px 0;"></i>
                    <div style="font-weight:bold; font-size:0.8rem; color:#fff;">${p.name}</div>
                    <div style="font-size:0.6rem; color:var(--data-cyan);">${p.pos}</div>
                    <div style="margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:0.6rem; color:#888;">
                        <div>PULS: <span style="color:#fff;">${p.pulse || '--'}</span></div>
                        <div>ENG: <span style="color:#fff;">${p.energy || 100}%</span></div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    showDetails(idx) {
        const p = window.Database.players[idx];
        const detailView = document.getElementById('analysis-detail-view');
        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom:1px solid #333; padding-bottom:15px;">
                <h2 style="color:var(--neon-green); margin:0;">${p.name.toUpperCase()}</h2>
                <button class="tactic-btn" onclick="window.SektorAnalyse.closeDetails()">SPEICHERN</button>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:15px;">
                ${this.renderInputCard('percentage', 'bodyFat', 'Körperfett %', p.bodyFat || 12, p.id)}
                ${this.renderInputCard('dumbbell', 'muscleMass', 'Muskelmasse kg', p.muscleMass || 40, p.id)}
                ${this.renderInputCard('history', 'metabolicAge', 'Stoffwechselalter', p.metabolicAge || 22, p.id)}
            </div>
        `;
        detailView.style.display = 'block';
    },

    renderInputCard(icon, key, label, value, playerId) {
        return `
            <div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:10px; text-align:center; border:1px solid #222;">
                <i class="fas fa-${icon}" style="color:var(--neon-green); margin-bottom:8px;"></i><br>
                <input type="number" step="0.1" style="background:#000; border:1px solid var(--data-cyan); color:#fff; width:80px; text-align:center; padding:5px; border-radius:5px;" 
                    value="${value}" onchange="window.SektorAnalyse.updateStat(${playerId}, '${key}', this.value)">
                <span style="display:block; margin-top:5px; font-size:0.6rem; color:#666; text-transform:uppercase;">${label}</span>
            </div>
        `;
    },

    updateStat(playerId, key, value) {
        if (window.Database) window.Database.updatePlayer(playerId, key, parseFloat(value));
    },

    closeDetails() {
        if (window.Database) window.Database.save();
        document.getElementById('analysis-detail-view').style.display = 'none';
        this.renderCards();
        window.ToniVoice.speak("Daten gespeichert.");
    }
};
