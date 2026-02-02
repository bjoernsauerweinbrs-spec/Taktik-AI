(function() {
    let draggedPlayer = null;

    window.initDragDrop = function() {
        const canvas = document.getElementById('main-canvas');
        
        canvas.addEventListener('mousedown', (e) => {
            const pos = getPos(e);
            draggedPlayer = arena.players.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
            if (draggedPlayer) {
                draggedPlayer.selected = true; // Markierung für Animation
                if (window.AnalysisCenter) window.AnalysisCenter.renderSetcard(draggedPlayer);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!draggedPlayer) return;
            const pos = getPos(e);
            draggedPlayer.x = pos.x;
            draggedPlayer.y = pos.y;
            // arena.render() wird automatisch vom Animation-Loop aufgerufen!
        });

        window.addEventListener('mouseup', () => {
            if (draggedPlayer) draggedPlayer.selected = false;
            draggedPlayer = null;
        });
    };

    function getPos(e) {
        const rect = arena.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (arena.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (arena.canvas.height / rect.height)
        };
    }
})();
