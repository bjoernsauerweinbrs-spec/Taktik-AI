/**
 * =========================================
 * TONI 2.0 – DRAG & DROP ENGINE
 * Ermöglicht Spielerbewegung & Setcard-Trigger
 * =========================================
 */
(function() {
    let draggedPlayer = null;
    let isDragging = false;
    let startPos = { x: 0, y: 0 };

    function initDragDrop() {
        const canvas = document.getElementById('main-canvas');
        if (!canvas) {
            console.error("❌ DragDrop: Canvas 'main-canvas' nicht gefunden.");
            return;
        }

        // Maus-Events
        canvas.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        // Touch-Events für Tablets am Spielfeldrand
        canvas.addEventListener('touchstart', (e) => onPointerDown(e.touches[0]), { passive: false });
        window.addEventListener('touchmove', (e) => onPointerMove(e.touches[0]), { passive: false });
        window.addEventListener('touchend', onPointerUp);

        console.log("🖱️ Drag & Drop Engine: Aktiviert (Touch & Mouse ready)");
    }

    function onPointerDown(e) {
        const pos = getCoordinates(e);
        
        // Suche Spieler an dieser Position (Toleranz 25px)
        const player = window.arena.players.find(p => 
            Math.hypot(p.x - pos.x, p.y - pos.y) < 25
        );

        if (player) {
            draggedPlayer = player;
            isDragging = true;
            startPos = { x: pos.x, y: pos.y };

            // Setcard im Analysezentrum öffnen
            if (window.AnalysisCenter && typeof window.AnalysisCenter.renderSetcard === 'function') {
                window.AnalysisCenter.renderSetcard(player);
            }
            
            console.log(`🎯 Spieler ausgewählt: ${player.name}`);
        }
    }

    function onPointerMove(e) {
        if (!isDragging || !draggedPlayer) return;

        const pos = getCoordinates(e);
        
        // Position des Spielers aktualisieren
        draggedPlayer.x = pos.x;
        draggedPlayer.y = pos.y;

        // Neuzeichnen der Arena anfordern
        if (window.arena && typeof window.arena.render === 'function') {
            window.arena.render();
        }
    }

    function onPointerUp() {
        if (isDragging) {
            console.log("✅ Position gespeichert.");
            isDragging = false;
            draggedPlayer = null;
        }
    }

    function getCoordinates(e) {
        const canvas = window.arena.canvas;
        const rect = canvas.getBoundingClientRect();
        
        // Berechnung der relativen Position unter Berücksichtigung von Skalierung
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    // Global verfügbar machen ohne 'export'
    window.initDragDrop = initDragDrop;

})();
