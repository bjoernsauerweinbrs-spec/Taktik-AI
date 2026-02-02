// Ergänzung in startDrag(e)
function startDrag(e) {
    const pos = getPos(e);
    const player = arena.players.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
    
    if (player) {
        draggedPlayer = player;
        // RUFT DIE SETCARD AUF
        if (window.AnalysisCenter) {
            window.AnalysisCenter.renderSetcard(player);
        }
    } else {
        if (window.AnalysisCenter) window.AnalysisCenter.clear();
    }
}
