/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE BRANDING & PITCH UPDATE)
 * Fokus: Taktik-Board, Kader-Integration, Sponsoren-Rotation & Full Pitch Markings
 * Status: MASTER-SYNC 2026 - COMPLETED VISUAL RECOVERY
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    activeSponsorIndex: 0,
    lastRotation: 0,
    rotationSpeed: 5000, 

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

        // 1. Spielfeld (Sattes Champions-Grün)
        ctx.fillStyle = "#348C31"; 
        ctx.fillRect(0, 0, w, h);
        
        // 2. Alle Spielfeldmarkierungen (16m, 5m, Tore etc.)
        this.drawPitchLines(ctx, w, h);

        // 3. Dynamische Werbebanden (Oben & Unten)
        this.drawBanners(ctx, w, h);

        // 4. Aktive Spieler auf dem Feld
        const team = window.currentTeamContext || "Senioren";
        const playersOnField = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        playersOnField.forEach(p => this.drawPlayerOnBoard(p));
    },

    /**
     * Zeichnet alle offiziellen Spielfeldmarkierungen inkl. 16m und Toren
     */
    drawPitchLines(ctx, w, h) {
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; // Weiße Linien
        ctx.lineWidth = 2;

        const offsetV = 50; // Versatz wegen der Banden oben/unten
        const offsetH = 30; // Versatz von den Seiten
        const fieldW = w - (offsetH * 2);
        const fieldH = h - (offsetV * 2);

        // Außenlinie
        ctx.strokeRect(offsetH, offsetV, fieldW, fieldH);

        // Mittellinie & Mittelkreis
        ctx.beginPath();
        ctx.moveTo(w / 2, offsetV);
        ctx.lineTo(w / 2, h - offsetV);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
        ctx.stroke();

        // --- LINKS (TONI SEITE) ---
        // 16-Meter Raum
        ctx.strokeRect(offsetH, h / 2 - 120, 100, 240);
        // 5-Meter Raum
        ctx.strokeRect(offsetH, h / 2 - 50, 35, 100);
        // Elfmeterpunkt
        ctx.beginPath();
        ctx.arc(offsetH + 75, h / 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
        // Strafraum-Halbkreis
        ctx.beginPath();
        ctx.arc(offsetH + 75, h / 2, 50, -Math.PI/2.5, Math.PI/2.5);
        ctx.stroke();

        // --- RECHTS (TRAINER SEITE) ---
        // 16-Meter Raum
        ctx.strokeRect(w - offsetH - 100, h / 2 - 120, 100, 240);
        // 5-Meter Raum
        ctx.strokeRect(w - offsetH - 35, h / 2 - 50, 35, 100);
        // Elfmeterpunkt
        ctx.beginPath();
        ctx.arc(w - offsetH - 75, h / 2, 2, 0, Math.PI * 2);
        ctx.fill();
        // Strafraum-Halbkreis
        ctx.beginPath();
        ctx.arc(w - offsetH - 75, h / 2, 50, Math.PI * 0.6, Math.PI * 1.4);
        ctx.stroke();

        // --- TORE (Visuelle Darstellung) ---
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#fff";
        // Tor Links
        ctx.beginPath();
        ctx.moveTo(offsetH, h / 2 - 40);
        ctx.lineTo(offsetH - 10, h / 2 - 40);
        ctx.lineTo(offsetH - 10, h / 2 + 40);
        ctx.lineTo(offsetH, h / 2 + 40);
        ctx.stroke();

        // Tor Rechts
        ctx.beginPath();
        ctx.moveTo(w - offsetH, h / 2 - 40);
        ctx.lineTo(w - offsetH + 10, h / 2 - 40);
        ctx.lineTo(w - offsetH + 10, h / 2 + 40);
        ctx.lineTo(w - offsetH, h / 2 + 40);
        ctx.stroke();
    },

    drawBanners(ctx, w, h) {
        const sponsors = window.Database?.sponsors || [];
        const bannerHeight = 40; 

        // Schwarze Banden
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, bannerHeight); 
        ctx.fillRect(0, h - bannerHeight, w, bannerHeight); 

        // Logo Projektion
        if (sponsors.length > 0) {
            const currentSponsor = sponsors[this.activeSponsorIndex];
            const img = new Image();
            img.src = currentSponsor.logo;
            
            ctx.globalAlpha = 1.0; 
            for (let i = 0; i < 5; i++) {
                try {
                    ctx.drawImage(img, 80 + (i * (w/5)), 8, 80, 24);
                } catch(e) {}
            }
            ctx.globalAlpha = 1.0;
        }

        // TONI 2.0 Branding
        ctx.fillStyle = "var(--data-cyan)";
        ctx.font = "bold 12px Orbitron";
        ctx.textAlign = "right";
        ctx.fillText("TONI 2.0 // ANALYTICAL PARTNER", w - 30, h - 15);
    },

    drawPlayerOnBoard(p) {
        const ctx = this.ctx;
        const color = p.assignment === 'Toni' ? '#39ff14' : '#ff3b30';

        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 6);

        if (this.showNames) {
            ctx.font = "bold 10px Orbitron";
            ctx.fillStyle = "#fff";
            ctx.fillText(p.name.split(' ').pop().toUpperCase(), p.x, p.y + 42);
        }
    },

    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        let toniIdx = 0;
        let trainerIdx = 0;

        players.forEach(p => {
            if ((team === "Senioren" ? p.team === "Senioren" : p.jugend === team)) {
                p.onField = true;
                if (p.assignment === 'Toni') {
                    // 4-4-2 Raster
                    p.x = w * 0.1 + (Math.floor(toniIdx / 3) * 120);
                    p.y = (h * 0.2) + ((toniIdx % 4) * 120);
                    toniIdx++;
                } else {
                    // 3-4-3 Raster
                    p.x = w * 0.9 - (Math.floor(trainerIdx / 3) * 120);
                    p.y = (h * 0.2) + ((trainerIdx % 4) * 120);
                    trainerIdx++;
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
        if(window.ToniVoice) window.ToniVoice.speak("Board gesäubert.");
    }
};
