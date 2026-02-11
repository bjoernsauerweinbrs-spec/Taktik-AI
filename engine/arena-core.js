/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE GLOW & LOGIC SYNC)
 * Fokus: Namen-Logik (Nur Trainer-Team), Glow-Sponsoring & Command-Input-Fix
 * Status: MASTER-SYNC 2026 - FULL RECOVERY COMPLETED
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    activeSponsorIndex: 0,
    lastRotation: 0,
    rotationSpeed: 5000, 

    init() {
        console.log("🏟️ Arena Engine: Initialisiere High-Tech Spielfeld...");
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Initialer Formation-Sync
        this.applyDefaultFormations();
        
        // Listener für Taktik-Board und Chat-Eingabe (Enter-Fix)
        this.setupEventListeners();
        this.initChatListener(); 
        
        this.startAnimationLoop();
        this.renderBench();

        // System-Begrüßung triggern
        this.triggerWelcome();
    },

    /**
     * Fix: Ermöglicht die Bestätigung von Befehlen via Enter-Taste
     */
    initChatListener() {
        const input = document.getElementById('command-input');
        if (input) {
            // Verhindert doppelte Listener durch Klonen
            input.replaceWith(input.cloneNode(true));
            const newInput = document.getElementById('command-input');
            
            newInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const cmd = newInput.value.trim();
                    if (cmd && window.BriefcaseUI) {
                        this.handleCommand(cmd);
                        newInput.value = '';
                    }
                }
            });
        }
    },

    handleCommand(cmd) {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML += `<div class="chat-msg user"><b>DU:</b> ${cmd}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
            
            setTimeout(() => {
                if(window.ToniVoice) window.ToniVoice.speak("Analysiere Eingabe: " + cmd);
            }, 500);
        }
    },

    triggerWelcome() {
        setTimeout(() => {
            const chatBox = document.getElementById('chat-box');
            if (chatBox && chatBox.innerHTML === "") {
                chatBox.innerHTML = `<div class="chat-msg system"><b>TONI:</b> System bereit. Elite-Cockpit 2026 synchronisiert. Wie kann ich helfen, Coach?</div>`;
                if(window.ToniVoice) window.ToniVoice.speak("System bereit. Elite Cockpit 2026 synchronisiert.");
            }
        }, 1000);
    },

    startAnimationLoop() {
        const loop = (time) => {
            this.update(time);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    update(time) {
        if (time - this.lastRotation > this.rotationSpeed) {
            const sponsors = window.Database?.sponsors || [];
            const totalSlots = sponsors.length + 1; 
            this.activeSponsorIndex = (this.activeSponsorIndex + 1) % totalSlots;
            this.lastRotation = time;
        }
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld (Deep Black)
        ctx.fillStyle = "#050505"; 
        ctx.fillRect(0, 0, w, h);
        
        // 2. Markierungen & Banden
        this.drawPitchLines(ctx, w, h);
        this.drawBanners(ctx, w, h);

        // 3. Spieler-Rendering
        const team = window.currentTeamContext || "Senioren";
        const playersOnField = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        playersOnField.forEach(p => this.drawPlayerOnBoard(p));
    },

    drawPitchLines(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)"; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#39FF14";
        ctx.lineWidth = 1.5;

        const offsetV = 50; 
        const offsetH = 30; 
        const fieldW = w - (offsetH * 2);
        const fieldH = h - (offsetV * 2);

        ctx.strokeRect(offsetH, offsetV, fieldW, fieldH);
        ctx.beginPath();
        ctx.moveTo(w / 2, offsetV); ctx.lineTo(w / 2, h - offsetV); ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeRect(offsetH, h / 2 - 120, 100, 240); // 16m
        ctx.strokeRect(w - offsetH - 100, h / 2 - 120, 100, 240);
        
        ctx.strokeStyle = "rgba(0, 209, 255, 0.8)";
        ctx.shadowColor = "#00d1ff";
        ctx.strokeRect(offsetH - 10, h / 2 - 40, 10, 80); // Tore
        ctx.strokeRect(w - offsetH, h / 2 - 40, 10, 80);

        ctx.shadowBlur = 0;
    },

    drawBanners(ctx, w, h) {
        const sponsors = window.Database?.sponsors || [];
        const bannerHeight = 40; 
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, bannerHeight); 
        ctx.fillRect(0, h - bannerHeight, w, bannerHeight); 

        ctx.textAlign = "center";
        
        if (this.activeSponsorIndex < sponsors.length) {
            const s = sponsors[this.activeSponsorIndex];
            const img = new Image();
            img.src = s.logo;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
            for (let i = 0; i < 5; i++) {
                try { ctx.drawImage(img, 80 + (i * (w/5)), 8, 80, 24); } catch(e) {}
            }
        } else {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#39FF14";
            ctx.fillStyle = "#39FF14";
            ctx.font = "900 16px Orbitron";
            for (let i = 0; i < 5; i++) {
                ctx.fillText("TONI 2.0", 120 + (i * (w/5)), 26);
                ctx.fillText("ELITE SYSTEMS", 120 + (i * (w/5)), h - 14);
            }
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 209, 255, 0.6)";
        ctx.font = "bold 10px Orbitron";
        ctx.textAlign = "right";
        ctx.fillText("MASTER HUB SYNC ACTIVE", w - 20, h - 15);
    },

    drawPlayerOnBoard(p) {
        const ctx = this.ctx;
        const isToni = p.assignment === 'Toni';
        const color = isToni ? '#39ff14' : '#ff3b30'; // Toni=Grün, Trainer=Rot

        // 1. Glow & Kreis
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

        // 2. Nummer (Für alle zentriert)
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 6);

        // 3. Namen-Rendering (Nur für Team Trainer / Rot)
        if (!isToni && this.showNames && p.name) {
            ctx.font = "bold 11px Orbitron";
            ctx.fillStyle = "#fff";
            const lastName = p.name.split(' ').pop().toUpperCase();
            
            // Dezenter Text-Schatten für bessere Lesbarkeit
            ctx.shadowBlur = 5;
            ctx.shadowColor = "#000";
            ctx.fillText(lastName, p.x, p.y + 42);
            ctx.shadowBlur = 0;
        }
    },

    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const w = this.canvas.width;
        const h = this.canvas.height;
        let toniIdx = 0; let trainerIdx = 0;

        players.forEach(p => {
            if ((team === "Senioren" ? p.team === "Senioren" : p.jugend === team)) {
                p.onField = true;
                if (p.assignment === 'Toni') {
                    p.x = w * 0.1 + (Math.floor(toniIdx / 3) * 120);
                    p.y = (h * 0.2) + ((toniIdx % 4) * 120);
                    toniIdx++;
                } else {
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
        const players = window.Database.players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));
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
            if (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) p.onField = false;
        });
        this.draw();
        if(window.ToniVoice) window.ToniVoice.speak("Board gesäubert.");
    }
};
