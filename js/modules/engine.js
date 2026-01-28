/**
 * TONI 2.0 - Player Engine
 * Steuert die Erstellung und Bewegung der Akteure auf dem Feld
 */

const ToniEngine = {
    container: null,
    players: new Map(),

    init() {
        this.container = document.getElementById('pitch-surface');

        // Auf Befehle vom EventBus hören
        window.ToniEvents.on('PLAYER:SPAWN', (data) => this.spawnPlayer(data));
        window.ToniEvents.on('PLAYER:MOVE', (data) => this.movePlayer(data.id, data.x, data.y));
        window.ToniEvents.on('ARENA:READY', () => this.setupInitialFormation());
    },

    /**
     * Erzeugt einen Spieler auf dem Feld
     */
    spawnPlayer(data) {
        const playerEl = document.createElement('div');
        playerEl.className = `player ${data.team === 'red' ? 'team-home' : 'team-away'}`;
        playerEl.id = `player-${data.id}`;
        
        // Anzeige von Nummer oder Name
        playerEl.innerHTML = `<span class="player-number">${data.nr || ''}</span>`;
        
        // Ginga-Style: CSS-Transition für flüssige Bewegung
        playerEl.style.position = 'absolute';
        playerEl.style.left = `${data.x}%`;
        playerEl.style.top = `${data.y}%`;

        // Drag & Drop Logik initialisieren
        this.makeDraggable(playerEl, data.id);

        this.container.appendChild(playerEl);
        this.players.set(data.id, playerEl);
    },

    /**
     * Bewegt einen Spieler zu neuen Koordinaten
     */
    movePlayer(id, x, y) {
        const player = this.players.get(id);
        if (player) {
            player.style.left = `${x}%`;
            player.style.top = `${y}%`;
            console.log(`[Engine] Spieler ${id} bewegt nach ${x}/${y}`);
        }
    },

    /**
     * Macht Elemente auf dem Handy und Desktop verschiebbar
     */
    makeDraggable(el, id) {
        let isDragging = false;

        const start = () => { isDragging = true; el.classList.add('dragging'); };
        const end = () => { isDragging = false; el.classList.remove('dragging'); };
        
        const move = (e) => {
            if (!isDragging) return;
            
            const rect = this.container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // Berechnung der Prozent-Position für Responsivität
            const x = ((clientX - rect.left) / rect.width) * 100;
            const y = ((clientY - rect.top) / rect.height) * 100;

            if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
                this.movePlayer(id, x, y);
                window.ToniEvents.emit('PLAYER:SYNC', { id, x, y });
            }
        };

        el.addEventListener('mousedown', start);
        el.addEventListener('touchstart', start, { passive: false });
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
    },

    /**
     * Beispiel-Startaufstellung nach dem Arena-Build
     */
    setupInitialFormation() {
        // Nur ein kleiner Test, damit das Feld nicht leer bleibt
        this.spawnPlayer({ id: 'keeper', nr: 1, team: 'red', x: 5, y: 50 });
        this.spawnPlayer({ id: 'striker', nr: 9, team: 'red', x: 45, y: 50 });
        console.log("[Engine] Basis-Formation geladen.");
    }
};

// Initialisierung
ToniEngine.init();
