/**
 * TONI 2.0 - GINGA ARENA ENGINE
 * Professionelles Spielfeld-Rendering mit 5m-Zone & FIFA-Effekten
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [], // Rote Spieler (Dein Team)
    opponents: [], // Blaue Spieler (Gegner)
    
    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.render();
        
        // Event-Listener für Status-Änderungen (Sync mit Kabine)
        document.addEventListener('playerStatusChanged', () => this.render());
    },

    resize: function() {
        // Fixiert das Seitenverhältnis auf ein Profi-Spielfeld
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    },

    render: function() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        // 1. DER RASEN (Ginga-Deep-Green mit Streifen)
        ctx.fillStyle = "#0A2410"; // Sehr dunkles Grün
        ctx.fillRect(0, 0, w, h);
        
        // Rasen-Schnittmuster (Subtile Streifen)
        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        for (let i = 0; i < w; i += w/10) {
            if((i/(w/10)) % 2 === 0) ctx.fillRect(i, 0, w/10, h);
        }

        // 2. DIE LINIEN (Electric White)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, w-40, h-40); // Außenlinie
        
        // Mittellinie & Kreis
        ctx.beginPath();
        ctx.moveTo(w/2, 20); ctx.lineTo(w/2, h-20);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, h/2, h/6, 0, Math.PI * 2);
        ctx.stroke();

        // 3. DIE 5-METER-ZONE (Dein Wunsch!)
        this.drawBox(ctx, 20, h/2, h/4, h/2.5, "5m"); // Links
        this.drawBox(ctx, w-20, h/2, -h/4, h/2.5, "5m"); // Rechts

        // 4. SPIELER-RENDERING (Beispiel-Positionen)
        this.drawPlayer(ctx, w*0.3, h/2, "RED", "Pele", "10", 88); // Dein Ginga-Spieler
        this.drawPlayer(ctx, w*0.7, h/2, "BLUE", "Gegner", "4", null);
    },

    drawBox: function(ctx, x, y, width, height, label) {
        ctx.setLineDash([5, 5]); // Gestrichelte Linie für die 5m Zone
        ctx.strokeStyle = "rgba(0, 209, 255, 0.4)"; // Cyan-Glühen
        ctx.strokeRect(x, y - height/2, width, height);
        ctx.setLineDash([]); // Reset
    },

    drawPlayer: function(ctx, x, y, team, name, nr, rating) {
        const isRed = team === "RED";
        
        // FIFA-Aura für rote Spieler
        if(isRed) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "var(--accent-gold)";
        }

        // Spieler-Körper
        ctx.fillStyle = isRed ? "var(--accent-orange)" : "#1E90FF";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset Aura

        // Nummer
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Inter";
        ctx.textAlign = "center";
        ctx.fillText(nr, x, y + 5);

        // Name Tag
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(x - 25, y + 20, 50, 15);
        ctx.fillStyle = "#fff";
        ctx.font = "9px Inter";
        ctx.fillText(name, x, y + 31);
    }
};
