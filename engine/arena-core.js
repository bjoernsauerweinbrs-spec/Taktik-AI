/**
 * TONI 2.0 - ARENA ENGINE CORE
 * Fokus: Taktik-Board, Kader-Integration & Mobile-Touch
 * Status: MASTER-SYNC 2026
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    isDragging: false,
    draggedPlayer: null,

    init() {
        console.log("🏟️ Arena Engine: Initialisiere Spielfeld...");
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.setupEventListeners();
        this.draw();
        this.renderBench();
    },

    /**
     * Zeichnet das komplette Spielfeld und alle aktiven Spieler
     */
    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld zeichnen (Grüner Untergrund & Linien)
        ctx.fillStyle = "#1b3d2f"; // Dunkelgrün
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        
        // Außenlinie
        ctx.strokeRect(20, 20, w - 40, h - 40);
        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, 20);
        ctx.lineTo(w / 2, h - 20);
        ctx.stroke();
        // Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Aktive Spieler auf dem Feld zeichnen
        const team = window.currentTeamContext || "Senioren";
        const playersOnField = window.Database.players.filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        playersOnField.forEach(p => this.drawPlayerOnBoard(p));
    },

    /**
     * Zeichnet den Spieler als taktischen Kreis (Rot/Grün) mit Nummer
     */
    drawPlayerOnBoard(p) {
        const ctx = this.ctx;
        // Farbe: Toni = Neon-Grün, Trainer = Rot
        const color = p.assignment === 'Toni' ? '#39ff14' : '#ff3b30';

        // Schatteneffekt
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,0,0,0.5)";

        // Der Kreis
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0; // Schatten für Text aus

        // Rückennummer im Kreis
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 5);

        // Name unter dem Kreis
        if (this.showNames) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = "10px Orbitron";
            ctx.fillText(p.name.split(' ').pop().toUpperCase(), p.x, p.y + 35);
        }
    },

    /**
     * Rendert die Ersatzbank als FIFA-Mini-Cards
     */
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

    /**
     * Event Listener für Maus und Touch (Mobile Support)
     */
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Mobile-Check: Wenn ein Spieler auf der Bank ausgewählt ist -> Deploy
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
        if(window.ToniVoice) window.ToniVoice.speak("Spielfeld zurückgesetzt.");
    }
};
