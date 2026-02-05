/**
 * TONI 2.0 - ARENA ENGINE (RECOVERY)
 * Pfad: /engine/arena.js
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [],

    /**
     * Initialisiert das Spielfeld
     */
    init: function(id) {
        console.log("Arena: Initialisiere Canvas...");
        this.canvas = document.getElementById(id);
        if (!this.canvas) {
            console.error("Arena: Canvas mit ID '" + id + "' nicht gefunden!");
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Listener für den Event-Bus (falls vorhanden)
        if (window.ToniEvents && typeof window.ToniEvents.on === 'function') {
            window.ToniEvents.on('players:updated', (data) => {
                this.players = data;
                this.render();
            });
        }

        // Spieler aus der Datenbank laden
        if (window.ToniDB && typeof window.ToniDB.getPlayers === 'function') {
            this.players = window.ToniDB.getPlayers();
        }

        this.render();
    },

    /**
     * Haupt-Render-Funktion
     */
    render: function() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Hintergrund (Rasen-Dunkel)
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);

        // 2. Spielfeldmarkierungen (Neon-Grün)
        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 2;
        
        // Außenlinie
        const pad = 40;
        ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));
        
        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, pad);
        ctx.lineTo(w / 2, h - pad);
        ctx.stroke();

        // Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Spieler zeichnen
        if (this.players && this.players.length > 0) {
            this.players.forEach((p, index) => {
                // Nur anwesende Spieler des Heimteams zeigen (oder alle Gegner)
                if (p.team === 'home' && !p.isPresent) return;

                const isHome = p.team === 'home';
                
                // Berechne Positionen (einfache Verteilung für den Recovery-Mode)
                const x = isHome ? w * 0.25 : w * 0.75;
                const y = pad + 60 + (index * 50 % (h - 120));

                // Spieler-Kreis
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, Math.PI * 2);
                ctx.fillStyle = isHome ? (p.isStarter ? "#39FF14" : "#FF3030") : "#3080FF";
                ctx.fill();
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Nummer oder Name
                ctx.fillStyle = isHome && p.isStarter ? "#000" : "#fff";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(p.nr || index + 1, x, y + 4);

                // Name unter dem Spieler
                ctx.fillStyle = "#fff";
                ctx.font = "9px Inter, sans-serif";
                ctx.fillText(p.name.toUpperCase(), x, y + 28);
                ctx.restore();
            });
        }

        console.log("Arena: Render-Vorgang abgeschlossen.");
    }
};
