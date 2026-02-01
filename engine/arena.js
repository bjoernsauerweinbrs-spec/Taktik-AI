// =========================================
// Toni 2.0 – Arena Engine
// Spielfeld-Rendering, Canvas-Setup, Grundlogik
// =========================================

let arena = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    players: [],
    lines: [],
    zones: [],
    sequences: [],
    ready: false
};

// -----------------------------------------
// Initialisierung
// -----------------------------------------
function initArena(canvasElement) {
    arena.canvas = canvasElement;
    arena.ctx = canvasElement.getContext("2d");

    resizeArena();
    window.addEventListener("resize", resizeArena);

    arena.ready = true;
    renderArena();

    console.log("Arena initialisiert.");
}

// -----------------------------------------
// Canvas an Fenstergröße anpassen
// -----------------------------------------
function resizeArena() {
    if (!arena.canvas) return;

    arena.width = window.innerWidth;
    arena.height = window.innerHeight;

    arena.canvas.width = arena.width;
    arena.canvas.height = arena.height;

    renderArena();
}

// -----------------------------------------
// Haupt-Render-Funktion
// -----------------------------------------
function renderArena() {
    if (!arena.ready) return;

    const ctx = arena.ctx;

    // Hintergrund
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, arena.width, arena.height);

    // Spielfeld-Linien
    drawPitchLines(ctx);

    // Zonen
    arena.zones.forEach(zone => drawZone(ctx, zone));

    // Linien (Pässe, Laufwege)
    arena.lines.forEach(line => drawLine(ctx, line));

    // Spieler
    arena.players.forEach(player => drawPlayer(ctx, player));

    // Sequenzen
    arena.sequences.forEach(step => drawSequenceStep(ctx, step));
}

// -----------------------------------------
// Spielfeld-Linien (Grundlayout)
// -----------------------------------------
function drawPitchLines(ctx) {
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;

    // Außenlinien
    ctx.strokeRect(50, 50, arena.width - 100, arena.height - 100);

    // Mittellinie
    ctx.beginPath();
    ctx.moveTo(arena.width / 2, 50);
    ctx.lineTo(arena.width / 2, arena.height - 50);
    ctx.stroke();

    // Mittelkreis
    ctx.beginPath();
    ctx.arc(arena.width / 2, arena.height / 2, 80, 0, Math.PI * 2);
    ctx.stroke();
}

// -----------------------------------------
// Spieler zeichnen
// -----------------------------------------
function drawPlayer(ctx, player) {
    ctx.fillStyle = player.color || "rgba(255,106,0,0.8)";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Nummer
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.number || "?", player.x, player.y);
}

// -----------------------------------------
// Linien zeichnen
// -----------------------------------------
function drawLine(ctx, line) {
    ctx.strokeStyle = line.color || "rgba(255,106,0,0.8)";
    ctx.lineWidth = line.width || 3;

    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
}

// -----------------------------------------
// Zonen zeichnen
// -----------------------------------------
function drawZone(ctx, zone) {
    ctx.fillStyle = zone.color || "rgba(255,106,0,0.2)";
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
}

// -----------------------------------------
// Sequenz-Schritte zeichnen
// -----------------------------------------
function drawSequenceStep(ctx, step) {
    ctx.fillStyle = step.color || "rgba(255,106,0,0.6)";
    ctx.beginPath();
    ctx.arc(step.x, step.y, step.size || 12, 0, Math.PI * 2);
    ctx.fill();
}