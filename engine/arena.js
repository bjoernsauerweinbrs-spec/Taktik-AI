/**
 * TONI 2.0 - ARENA ENGINE (ELITE MODULAR EDITION)
 * Fokus: Pitch-Switching (Funino/Kleinfeld/Grossfeld) & Greenkeeper
 * Status: FINALISIERT - 10.02.2026
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    equipment: [], 
    selectedElement: null,
    benchHeight: 180,
    isAnimating: false,
    
    // --- PITCH CONFIG ---
    currentPitchMode: 'grossfeld', // 'grossfeld', 'kleinfeld', 'funino'
    isTransitioning: false,
    greenkeeperPos: -300,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.setupEventListeners();
        if(window.Database) this.syncFromDatabase();
        this.renderLoop();
    },

    /**
     * Schaltet den Platzmodus mit Greenkeeper-Animation um
     */
    setPitchMode(newMode) {
        if (this.currentPitchMode === newMode || this.isTransitioning) return;
        
        console.log(`🌱 Greenkeeper: Umstellung auf ${newMode.toUpperCase()}...`);
        this.isTransitioning = true;
        this.greenkeeperPos = -300;
        
        if(window.ToniVoice) {
            const msg = newMode === 'funino' ? "Umbau auf Funino-Spielfeld." : 
                        (newMode === 'kleinfeld' ? "Markiere Kleinfeld-Linien." : "Rückbau auf Standard-Spielfeld.");
            window.ToniVoice.speak(msg);
        }

        // Der Modus-Wechsel passiert genau, wenn der Balken die Mitte passiert
        const checkPoint = setInterval(() => {
            if (this.greenkeeperPos > this.canvas.width / 2) {
                this.currentPitchMode = newMode;
                clearInterval(checkPoint);
            }
        }, 50);
    },

    // --- DRAWING CORE ---
    drawPitch(ctx, w, fieldH) {
        const m = 50; // Margin
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.setLineDash([]);
        ctx.lineWidth = 2;

        // 1. Außenlinie (Immer gleich)
        ctx.strokeRect(m, m, w - (m*2), fieldH - (m*2));

        if (this.currentPitchMode === 'grossfeld') {
            // --- GROSSFELD LAYOUT ---
            ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, fieldH/2, 65, 0, Math.PI*2); ctx.stroke();
            
            const drawBox = (x, dir) => {
                ctx.strokeRect(x, fieldH/2 - 120, 130 * dir, 240); // 16m
                ctx.strokeRect(x, fieldH/2 - 50, 45 * dir, 100);  // 5m
            };
            drawBox(m, 1); drawBox(w-m, -1);
        } 
        else if (this.currentPitchMode === 'kleinfeld') {
            // --- KLEINFELD LAYOUT ---
            ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, fieldH/2, 45, 0, Math.PI*2); ctx.stroke();
            
            const drawKBox = (x, dir) => {
                ctx.strokeRect(x, fieldH/2 - 80, 70 * dir, 160); // Reduzierter Strafraum
            };
            drawKBox(m, 1); drawKBox(w-m, -1);
        }
        else if (this.currentPitchMode === 'funino') {
            // --- FUNINO LAYOUT ---
            ctx.setLineDash([10, 10]); 
            ctx.beginPath(); ctx.moveTo(m + 120, m); ctx.lineTo(m + 120, fieldH-m); ctx.stroke(); // Schusszone links
            ctx.beginPath(); ctx.moveTo(w - m - 120, m); ctx.lineTo(w - m - 120, fieldH-m); ctx.stroke(); // Schusszone rechts
            ctx.setLineDash([]);
            
            ctx.strokeStyle = "rgba(57, 255, 20, 0.15)";
            ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke(); // Mittellinie nur hauchdünn
            
            // 4 Minitore (Visualisierung)
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 3;
            const tW = 8, tH = 40;
            ctx.strokeRect(m-tW, fieldH/2-110-tH/2, tW, tH); // Tor L1
            ctx.strokeRect(m-tW, fieldH/2+110-tH/2, tW, tH); // Tor L2
            ctx.strokeRect(w-m, fieldH/2-110-tH/2, tW, tH);  // Tor R1
            ctx.strokeRect(w-m, fieldH/2+110-tH/2, tW, tH);  // Tor R2
        }
    },

    drawGreenkeeper(ctx, w, h) {
        if (!this.isTransitioning) return;
        
        this.greenkeeperPos += 25; // Speed

        ctx.save();
        const gradient = ctx.createLinearGradient(this.greenkeeperPos, 0, this.greenkeeperPos + 200, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, 'rgba(57, 255, 20, 0.1)');
        gradient.addColorStop(1, 'rgba(57, 255, 20, 0.5)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.greenkeeperPos, 0, 200, h);
        
        ctx.strokeStyle = "var(--neon-green)";
        ctx.lineWidth = 5;
        ctx.shadowBlur = 15; ctx.shadowColor = "var(--neon-green)";
        ctx.beginPath();
        ctx.moveTo(this.greenkeeperPos + 200, 0);
        ctx.lineTo(this.greenkeeperPos + 200, h);
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px Orbitron";
        ctx.fillText("UPDATING PITCH LAYERS...", this.greenkeeperPos + 10, 25);
        ctx.restore();

        if (this.greenkeeperPos > w + 200) {
            this.isTransitioning = false;
        }
    },

    // --- ELEMENTS DRAWING ---
    drawEliteCard(ctx, el) {
        ctx.save();
        const cw = 80, ch = 110;
        const x = el.x - cw/2, y = el.y - ch/2;
        ctx.beginPath();
        ctx.moveTo(x, y + 15); ctx.lineTo(x + cw/2, y); ctx.lineTo(x + cw, y + 15);
        ctx.lineTo(x + cw, y + ch - 20); ctx.lineTo(x + cw/2, y + ch); ctx.lineTo(x, y + ch - 20);
        ctx.closePath();
        ctx.shadowBlur = 15; ctx.shadowColor = el.color || 'var(--neon-green)';
        ctx.fillStyle = "#0a0a0a"; ctx.fill();
        ctx.strokeStyle = el.color || 'var(--neon-green)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.shadowBlur = 0; ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Orbitron";
        ctx.fillText(el.rat || 80, x + 12, y + 35);
        ctx.font = "900 9px Inter"; ctx.textAlign = "center";
        ctx.fillText(el.name ? el.name.split(' ').pop().toUpperCase() : 'PRO', el.x, y + ch - 15);
        ctx.restore();
    },

    drawTacticalDot(ctx, el) {
        ctx.save();
        ctx.beginPath(); ctx.arc(el.x, el.y, 18, 0, Math.PI*2);
        ctx.fillStyle = el.color || 'var(--neon-green)'; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#000"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(el.number || '?', el.x, el.y);
        ctx.restore();
    },

    // --- ENGINE LOOP & SYSTEMS ---
    renderLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    },

    update() {
        let moving = false;
        this.elements.forEach(el => {
            const dx = el.targetX - el.x; const dy = el.targetY - el.y;
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) { el.x += dx * 0.12; el.y += dy * 0.12; moving = true; }
        });
        this.isAnimating = moving;
    },

    render() {
        if(!this.ctx) return;
        const w = this.canvas.width; const h = this.canvas.height;
        const fieldH = h - this.benchHeight;

        this.ctx.fillStyle = "#050a05";
        this.ctx.fillRect(0, 0, w, h);
        
        this.drawPitch(this.ctx, w, fieldH);
        this.drawGreenkeeper(this.ctx, w, fieldH);

        // Bench Area
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, fieldH, w, this.benchHeight);
        this.ctx.strokeStyle = "var(--data-cyan)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath(); this.ctx.moveTo(0, fieldH); this.ctx.lineTo(w, fieldH); this.ctx.stroke();

        this.elements.forEach(el => {
            const isOnBench = el.y > fieldH - 10;
            if (isOnBench) this.drawEliteCard(this.ctx, el);
            else this.drawTacticalDot(this.ctx, el);
        });
    },

    resize() {
        const c = document.getElementById('stage-container');
        if(!c) return;
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            this.selectedElement = this.elements.find(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) < 45);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.selectedElement) return;
            const rect = this.canvas.getBoundingClientRect();
            this.selectedElement.x = e.clientX - rect.left;
            this.selectedElement.y = e.clientY - rect.top;
            this.selectedElement.targetX = this.selectedElement.x;
            this.selectedElement.targetY = this.selectedElement.y;
        });
        this.canvas.addEventListener('mouseup', () => { this.selectedElement = null; });
        window.addEventListener('resize', () => this.resize());
    },

    syncFromDatabase() {
        if(!this.canvas || !window.Database) return;
        const players = window.Database.players || [];
        const h = this.canvas.height;
        this.elements = players.map((p, i) => ({
            ...p, type: 'player', 
            x: p.x || (85 + (i % 8) * 95), y: p.y || (h - 90),
            targetX: p.x || (85 + (i % 8) * 95), targetY: p.y || (h - 90),
            color: (p.assignment === 'Trainer') ? 'var(--accent-orange)' : 'var(--neon-green)'
        }));
    }
};
