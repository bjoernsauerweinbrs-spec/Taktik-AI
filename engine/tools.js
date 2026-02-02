/**
 * =========================================
 * TONI 2.0 – TACTICAL TOOLS ENGINE
 * Pässe, Laufwege & Zonen (Multi-Layer)
 * =========================================
 */
(function() {
    window.tools = {
        currentTool: null,
        firstPoint: null,

        // Aktiviert ein Werkzeug
        set(toolName) {
            this.currentTool = toolName;
            this.firstPoint = null; // Reset für neue Zeichnung
            console.log("🛠️ Tool aktiv: " + toolName);
            
            // Visuelles Feedback für Buttons (falls vorhanden)
            document.querySelectorAll('.tool-btn').forEach(btn => {
                btn.classList.toggle('active', btn.id === 'tool-' + toolName);
            });
        },

        // Verarbeitet Klicks auf das Spielfeld (wird von dragdrop.js oder main gerufen)
        handleCanvasClick(x, y) {
            if (!this.currentTool) return;

            if (this.currentTool === 'marker') {
                this.addMarker(x, y);
                return;
            }

            if (!this.firstPoint) {
                this.firstPoint = { x, y };
                // Optional: Kleiner visueller Punkt als Start-Indikator
            } else {
                this.createTacticalElement(this.firstPoint, { x, y });
                this.firstPoint = null;
            }
        },

        createTacticalElement(p1, p2) {
            const arena = window.arena;
            if (!arena) return;

            switch(this.currentTool) {
                case 'pass':
                    // Passweg: Durchgezogene Linie in Cyan
                    arena.lines.push({
                        x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
                        color: "#00D1FF", dashed: false, type: 'pass'
                    });
                    break;
                case 'run':
                    // Laufweg: Gestrichelte Linie in Neon-Orange
                    arena.lines.push({
                        x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
                        color: "#FF6A00", dashed: true, type: 'run'
                    });
                    break;
                case 'zone':
                    // Taktische Zone: Transparentes Rechteck
                    arena.zones.push({
                        x: Math.min(p1.x, p2.x),
                        y: Math.min(p1.y, p2.y),
                        w: Math.abs(p2.x - p1.x),
                        h: Math.abs(p2.y - p1.y),
                        color: "rgba(255, 106, 0, 0.15)"
                    });
                    break;
            }
        },

        addMarker(x, y) {
            if (!window.arena) return;
            window.arena.zones.push({
                x: x - 5, y: y - 5, w: 10, h: 10,
                color: "#FFFFFF"
            });
        }
    };
})();
