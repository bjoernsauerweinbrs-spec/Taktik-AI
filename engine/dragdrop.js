// engine/dragdrop.js - VOLLSTÄNDIG OHNE EXPORT
(function() {
    let draggedPlayer = null;

    function initDragDrop() {
        const canvas = document.getElementById('arena-canvas');
        if (!canvas) return;

        canvas.addEventListener('mousedown', startDrag);
        canvas.addEventListener('mousemove', doDrag);
        canvas.addEventListener('mouseup', stopDrag);
        console.log("🖱️ Drag & Drop bereit.");
    }

    function startDrag(e) {
        const rect = arena.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Nutze PlayerEngine aus players.js
        draggedPlayer = PlayerEngine.findPlayerAt(x, y);
        if (draggedPlayer) {
            console.log("Spieler gepackt:", draggedPlayer.name);
        }
    }

    function doDrag(e) {
        if (!draggedPlayer) return;
        const rect = arena.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        draggedPlayer.x = x;
        draggedPlayer.y = y;
        arena.render();
    }

    function stopDrag() {
        draggedPlayer = null;
    }

    window.initDragDrop = initDragDrop;
})();
