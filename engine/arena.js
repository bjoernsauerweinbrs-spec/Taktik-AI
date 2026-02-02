// =========================================
// Toni 2.0 – Arena Engine (Core)
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

function initArena(canvasElement) {
    if (!canvasElement) return;
    arena.canvas = canvasElement;
    arena.ctx = canvasElement.getContext("2d");

    resizeArena();
    window.addEventListener("resize", resizeArena);

    arena.ready = true;
    renderArena();
    console.log("🏟️ Arena Engine bereit.");
}

function resizeArena() {
    if (!arena.canvas) return;
    // Container-Größe für Flexibilität nutzen
    const container = arena.canvas.parentElement;
    arena.width = container.clientWidth || window.innerWidth;
    arena.height = container.clientHeight || window.innerHeight;

    arena.canvas.width = arena.width;
    arena.canvas.height = arena.height;

    renderArena();
}

function renderArena() {
    if (!arena.ready || !arena.ctx) return;
    const ctx = arena.ctx;

    // Hintergrund (Deep Dark)
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, arena.width, arena.height);

    drawPitchLines(ctx);

    // Ebenen-Rendering
    if (arena.zones) arena.zones.forEach(z => drawZone(ctx, z));
    if (arena.lines) arena.lines.forEach(l => drawLine(ctx, l));
    if (arena.players) arena.players.forEach(p => drawPlayer(ctx, p));
    if (arena.sequences) arena.sequences.forEach(s => drawSequenceStep(ctx, s));
}

function drawPitchLines(ctx) {
    ctx.strokeStyle = "rgba(0, 255, 150, 0.15)";
    ctx.lineWidth = 2;
    // Außenlinie
    ctx.strokeRect(50, 50, arena.width - 100, arena.height - 100);
    // Mittellinie
    ctx.beginPath();
    ctx.moveTo(arena.width / 2, 50);
    ctx.lineTo(arena.width / 2, arena.height - 50);
    ctx.stroke();
}

function drawPlayer(ctx, player) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color || "#ff6a00";
    
    ctx.fillStyle = player.color || "rgba(255, 106, 0, 0.9)";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0; // Schatten für Text aus
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.number || "0", player.x, player.y);
    
    // Name unter dem Spieler
    ctx.font = "10px Inter";
    ctx.fillText(player.name || "", player.x, player.y + 30);
}
