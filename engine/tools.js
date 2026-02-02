// =========================================
// Toni 2.0 – Tools Engine (Vollständig)
// =========================================

// Passweg hinzufügen
function addPassLine(x1, y1, x2, y2, color = "rgba(0,150,255,0.9)") {
    arena.lines.push({ x1, y1, x2, y2, color, width: 3, dashed: false });
    arena.render();
}

// Laufweg hinzufügen (gestrichelt)
function addRunLine(x1, y1, x2, y2, color = "rgba(0,255,150,0.9)") {
    arena.lines.push({ x1, y1, x2, y2, color, width: 2, dashed: true });
    arena.render();
}

function addZone(x, y, w, h, color = "rgba(255,106,0,0.25)") {
    arena.zones.push({ x, y, w, h, color });
    arena.render();
}

function addMarker(x, y, size = 10, color = "rgba(255,255,0,0.9)") {
    arena.sequences.push({ x, y, size, color });
    arena.render();
}

function clearTools() {
    arena.lines = [];
    arena.zones = [];
    arena.sequences = [];
    arena.render();
}

// SICHERE ÜBERSCHREIBUNG FÜR GESTRICHELTE LINIEN
// Wir warten, bis arena bereit ist
setTimeout(() => {
    if (window.arena && window.arena.drawLine) {
        const originalDrawLine = arena.drawLine.bind(arena);

        arena.drawLine = function(ctx, line) {
            if (line.dashed) {
                ctx.setLineDash([10, 10]);
            } else {
                ctx.setLineDash([]);
            }
            originalDrawLine(ctx, line);
            ctx.setLineDash([]); // Reset für andere Zeichnungen
        };
        console.log("🛠️ Tools: drawLine erfolgreich erweitert.");
    }
}, 500);
