(function() {
    let selectedPlayer = null;

    window.initDragDrop = function() {
        const canvas = arena.canvas;
        
        const start = (e) => {
            const pos = getPos(e);
            selectedPlayer = arena.players.find(p => 
                Math.hypot(p.x - pos.x, p.y - pos.y) < 25
            );
        };

        const move = (e) => {
            if (!selectedPlayer) return;
            const pos = getPos(e);
            selectedPlayer.x = pos.x;
            selectedPlayer.y = pos.y;
            arena.render();
        };

        const end = () => selectedPlayer = null;

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        
        canvas.addEventListener('touchstart', (e) => start(e.touches[0]));
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e.touches[0]); });
        canvas.addEventListener('touchend', end);
    };

    function getPos(e) {
        const rect = arena.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
})();
