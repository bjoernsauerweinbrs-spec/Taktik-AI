// =========================================
// Toni 2.0 – Drag & Drop Engine
// Spieler bewegen per Maus oder Touch
// =========================================

let dragState = {
    active: false,
    player: null,
    offsetX: 0,
    offsetY: 0
};

// -----------------------------------------
// Event Listener initialisieren
// -----------------------------------------
window.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", dragMove);
window.addEventListener("mouseup", endDrag);

window.addEventListener("touchstart", startDrag, { passive: false });
window.addEventListener("touchmove", dragMove, { passive: false });
window.addEventListener("touchend", endDrag);

// -----------------------------------------
// Drag starten
// -----------------------------------------
function startDrag(e) {
    const pos = getPointerPosition(e);

    const player = getPlayerAtPosition(pos.x, pos.y);
    if (!player) return;

    dragState.active = true;
    dragState.player = player;
    dragState.offsetX = pos.x - player.x;
    dragState.offsetY = pos.y - player.y;

    e.preventDefault();
}

// -----------------------------------------
// Drag bewegen
// -----------------------------------------
function dragMove(e) {
    if (!dragState.active || !dragState.player) return;

    const pos = getPointerPosition(e);

    dragState.player.x = pos.x - dragState.offsetX;
    dragState.player.y = pos.y - dragState.offsetY;

    renderArena();
    e.preventDefault();
}

// -----------------------------------------
// Drag beenden
// -----------------------------------------
function endDrag() {
    dragState.active = false;
    dragState.player = null;
}

// -----------------------------------------
// Maus- oder Touch-Position ermitteln
// -----------------------------------------
function getPointerPosition(e) {
    let x, y;

    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    return { x, y };
}