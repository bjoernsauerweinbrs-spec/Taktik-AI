/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE BRANDING UPDATE)
 * Fokus: Taktik-Board, Kader-Integration, Mobile-Touch & Sponsor-Rotation
 * Status: MASTER-SYNC 2026 - FULL BUSINESS INTEGRATION
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    activeSponsorIndex: 0,
    lastRotation: 0,
    rotationSpeed: 5000, // Alle 5 Sek. Wechsel

    init() {
        console.log("🏟️ Arena Engine: Initialisiere High-End Spielfeld...");
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Initialer Formation-Sync
        this.applyDefaultFormations();
        
        this.setupEventListeners();
        this.startAnimationLoop();
        this.renderBench();
    },

    /**
     * Startet das Rendering-System inkl. Banner-Rotation
     */
    startAnimationLoop() {
        const loop = (time) => {
            this.update(time);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    update(time) {
        // Sponsor-Rotation alle X Sekunden
        if (time - this.lastRotation > this.rotationSpeed) {
            const sponsors = window.Database?.sponsors || [];
            if (sponsors.length > 0) {
                this.activeSponsorIndex = (this.activeSponsorIndex + 1) % sponsors.length;
            }
            this.lastRotation = time;
        }
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld & Linien
        ctx.fillStyle = "#1b3d2f"; 
        ctx.fillRect(0, 0, w, h);
        this.drawPitchLines(ctx, w, h);

        // 2. Dynamische Werbebanden (Oben & Unten)
        this.drawBanners(ctx, w, h);

        // 3. Aktive Spieler auf dem Feld
        const team = window.currentTeamContext || "Senioren";
        const playersOnField = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        playersOnField.forEach(p => this.drawPlayerOnBoard(p));
    },

    drawPitchLines(ctx, w, h) {
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 2;
        // Außen & Mitte
        ctx.strokeRect(20, 35, w - 40, h - 70);
        ctx.beginPath();
        ctx.moveTo(w / 2, 35);
        ctx.lineTo(w / 2, h - 35);
        ctx.stroke();
        // Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();
    },

    drawBanners(ctx, w, h) {
        const sponsors = window.Database?.sponsors || [];
        if (sponsors.length === 0) return;

        const currentSponsor = sponsors[this.activeSponsorIndex];
        
        // Schwarze Banden-Basis
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, 30); // Oben
        ctx.fillRect(0, h - 30, w, 30); // Unten

        // Sponsor-Logo-Projektion
        if (currentSponsor && currentSponsor.logo) {
            const img = new Image();
            img.src = currentSponsor.logo;
            ctx.globalAlpha = 0.7;
            for (let i = 0; i < 4; i++) {
                try {
                    ctx.drawImage(img, 60 + (i * (w/4)), 7, 50, 15);
                } catch(e) {}
            }
            ctx.globalAlpha = 1.0;
        }

        // TONI 2.0 - System Branding (Permanent)
        ctx.fillStyle = "rgba(0, 209, 255, 0.4)";
        ctx.font = "bold 9px Orbitron";
        ctx.textAlign = "right";
        ctx.fillText("TONI 2.0 // ANALYTICAL PARTNER", w - 30, h - 12);
    },

    drawPlayerOnBoard(p) {
        const ctx = this.ctx;
        // Farbe: Toni = Neon-Grün, Trainer = Rot
        const color = p.assignment === 'Toni' ? '#39ff14' : '#ff3b30';

        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,0,0,0.5)";

        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 5);

        if (this.showNames) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = "9px Orbitron";
            ctx.fillText(p.name.split(' ').pop().toUpperCase(), p.x, p.y + 38);
        }
    },

    /**
     * Wendet die gewünschten Standard-Formationen an
     */
    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        players.forEach(p => {
            if ((team === "Senioren" ? p.team === "Senioren" : p.jugend === team)) {
                p.onField = true;
                if (p.assignment === 'Toni') {
                    // Beispiel-Setup 4-4-2 (Linke Seite)
                    p.x = w * 0.2; p.y = h / 2; // Beispiel-Platzierung
                } else {
                    // Beispiel-Setup 3-4-3 (Rechte Seite)
                    p.x = w * 0.8; p.y = h / 2;
                }
            }
        });
    },

    renderBench() {
        const benchContainer = document.getElementById('arena-bench-list');
        if (!benchContainer) return;

        const team = window.currentTeamContext || "Senioren";
        const players = window.Database.players.filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team)
        );

        benchContainer.innerHTML = players.map(p => `
            <div class="fifa-card-mini" onclick="window.MobileTactics.handleBenchTap('${p.id}')">
                <div class="mini-rat">${p.rat}</div>
                <div class="mini-pos">${p.pos}</div>
                <div class="mini-name">${p.name.split(' ').pop().toUpperCase()}</div>
                <div class="mini-number">#${p.number || '0'}</div>
            </div>
        `).join('');
    },

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (window.MobileTactics && window.MobileTactics.selectedPlayerId) {
                window.MobileTactics.handleBoardTap(x, y);
            }
        });
    },

    resetBoard() {
        const team = window.currentTeamContext || "Senioren";
        window.Database.players.forEach(p => {
            if (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) {
                p.onField = false;
            }
        });
        this.draw();
        if(window.ToniVoice) window.ToniVoice.speak("Spielfeld bereinigt.");
    }
};
