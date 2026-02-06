window.arena = {
    canvas: null, ctx: null,
    mode: 'match', // 'match' oder 'training'
    elements: [], // Spieler, Hütchen, Bälle landen hier
    dragTarget: null,

    init: function(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.setupListeners();
        this.render();
        
        // Höre auf Spieler-Aktivierungen aus der Sporttasche
        window.ToniEvents.on('playerStatusChanged', (player) => {
            this.syncPlayer(player);
        });
    },

    // 5m-Raum & Spielfeld Zeichnung
    drawPitch: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pad = 40;

        // Gras & Neon-Linien
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(57, 255, 20, 0.6)";
        ctx.lineWidth = 2;
        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, pad); ctx.lineTo(w / 2, h - pad);
        ctx.stroke();

        // 16m & 5m RÄUME (Die Trainer-Zonen)
        this.drawBox(pad, h / 2, 120, 240); // 16m links
        this.drawBox(pad, h / 2, 45, 100);  // 5m links (Torraum)
        
        this.drawBox(w - pad, h / 2, -120, 240); // 16m rechts
        this.drawBox(w - pad, h / 2, -45, 100);  // 5m rechts
    },

    drawBox: function(x, y, w, h) {
        this.ctx.strokeRect(x, y - h / 2, w, h);
    },

    // Training-Equipment hinzufügen
    addEquipment: function(type) {
        const item = {
            id: Date.now(),
            type: type, // 'cone', 'ball', 'goal'
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            color: type === 'cone' ? '#ff6a00' : '#fff'
        };
        this.elements.push(item);
        this.render();
    },

    syncPlayer: function(player) {
        if (player.status !== 'inactive') {
            // Falls Spieler noch nicht auf dem Feld, hinzufügen
            if (!this.elements.find(e => e.id === player.id)) {
                this.elements.push({
                    id: player.id, type: 'player', name: player.name,
                    x: 100, y: 100, color: '#ff3030'
                });
            }
        } else {
            // Wenn inaktiv, vom Feld entfernen
            this.elements = this.elements.filter(e => e.id !== player.id);
        }
        this.render();
    },

    render: function() {
        if (!this.ctx) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        this.drawPitch();

        // Zeichne alle aktiven Elemente (Spieler & Hütchen)
        this.elements.forEach(el => {
            this.ctx.beginPath();
            if (el.type === 'player') {
                this.ctx.arc(el.x, el.y, 15, 0, Math.PI * 2);
                this.ctx.fillStyle = el.color;
                this.ctx.fill();
                this.ctx.fillStyle = "#fff";
                this.ctx.fillText(el.name, el.x - 10, el.y + 25);
            } else if (el.type === 'cone') {
                this.ctx.moveTo(el.x, el.y - 10);
                this.ctx.lineTo(el.x - 10, el.y + 10);
                this.ctx.lineTo(el.x + 10, el.y + 10);
                this.ctx.fillStyle = el.color;
                this.ctx.fill();
            }
            this.ctx.closePath();
        });
    },

    setupListeners: function() {
        this.canvas.onmousedown = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.dragTarget = this.elements.find(el => 
                Math.hypot(el.x - mouseX, el.y - mouseY) < 20
            );
        };
        this.canvas.onmousemove = (e) => {
            if (this.dragTarget) {
                const rect = this.canvas.getBoundingClientRect();
                this.dragTarget.x = e.clientX - rect.left;
                this.dragTarget.y = e.clientY - rect.top;
                this.render();
            }
        };
        this.canvas.onmouseup = () => { this.dragTarget = null; };
    }
};
