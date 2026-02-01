// =========================================
// Toni 2.0 – Tools Engine
// Linien, Laufwege, Zonen, Markierungen
// =========================================

// -----------------------------------------
// Passweg zeichnen
// -----------------------------------------
function addPassLine(x1, y1, x2, y2, color = "rgba(0,150,255,0.9)") {
    arena.lines.push({
        x1, y1, x2, y2,
        color,
        width: 3
    });

    renderArena();
}

// -----------------------------------------
// Laufweg zeichnen (gestrichelt)
// -----------------------------------------
function addRunLine(x1, y1, x2, y2, color = "rgba(0,255,150,0.9)") {
    arena.lines.push({
        x1, y1, x2, y2,
        color,
        width: 2,
        dashed: true
    });

    renderArena();
}

// -----------------------------------------
// Zone hinzufügen
// -----------------------------------------
function addZone(x, y, w, h, color = "rgba(255,106,0,0.25)") {
    arena.zones.push({
        x, y, w, h,
        color
    });

    renderArena();
}

// -----------------------------------------
// Markierungspunkt (z. B. Coaching-Punkt)
// -----------------------------------------
function addMarker(x, y, size = 10, color = "rgba(255,255,0,0.9)") {
    arena.sequences.push({
        x, y,
        size,
        color
    });

    renderArena();
}

// -----------------------------------------
// Alles löschen
// -----------------------------------------
function clearTools() {
    arena.lines = [];
    arena.zones = [];
    arena.sequences = [];
    renderArena();
}

// -----------------------------------------
// Erweiterung: gestrichelte Linien rendern
// (Arena-Engine nutzt diese Info)
// -----------------------------------------
const originalDrawLine = drawLine;

drawLine = function(ctx, line) {
    if (line.dashed) {
        ctx.setLineDash([10, 10]);
    } else {
        ctx.setLineDash([]);
    }

    originalDrawLine(ctx, line);
};