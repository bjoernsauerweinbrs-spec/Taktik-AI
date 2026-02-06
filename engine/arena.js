window.arena = {
    canvas: null, ctx: null, players: [],
    
    init: function(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        window.ToniEvents.on('players:updated', (data) => {
            this.players = data;
            this.render();
        });
        this.players = window.ToniDB.getPlayers();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.render();
    },

    resize: function() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.render();
    },

    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pad = 60; // Spielfeld-Abstand

        // 1. RASEN (Dunkler Profi-Look)
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);

        // 2. LINIEN (Neon-Grün)
        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 2;
        ctx.strokeRect(pad, pad, w - (pad*2), h - (pad*2)); // Außenlinie

        // Mittellinie & Kreis
        ctx.beginPath();
        ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h - pad);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, h/2, 50, 0, Math.PI*2);
        ctx.stroke();

        // 3. TORE & STRAFRÄUME (Inkl. 5m-Raum)
        const boxW = 120;
        const boxH = 240;
        const smallBoxW = 40; // 5m Raum
        const smallBoxH = 100;

        // Heim-Seite (Links)
        ctx.strokeRect(pad, (h/2) - (boxH/2), boxW, boxH); // 16er
        ctx.strokeRect(pad, (h/2) - (smallBoxH/2), smallBoxW, smallBoxH); // 5er
        ctx.fillStyle = "#39FF14";
        ctx.fillRect(pad - 10, (h/2) - 30, 10, 60); // Tor

        // Gast-Seite (Rechts)
        ctx.strokeRect(w - pad - boxW, (h/2) - (boxH/2), boxW, boxH); // 16er
        ctx.strokeRect(w - pad - smallBoxW, (h/2) - (smallBoxH/2), smallBoxW, smallBoxH); // 5er
        ctx.fillRect(w - pad, (h/2) - 30, 10, 60); // Tor

        // 4. SPIELER RENDERN
        this.players.forEach((p, i) => {
            if(p.team === 'home' && !p.isPresent) return;

            const isHome = p.team === 'home';
            // Taktische Verteilung statt einer Reihe
            const x = isHome ? (pad + 100 + (i * 20)) : (w - pad - 100 - (i * 20));
            const y = pad + 50 + (i * 45 % (h - 150));

            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI*2);
            ctx.fillStyle = isHome ? "#FF3030" : "#3080FF";
            if(p.isStarter && isHome) ctx.fillStyle = "#39FF14"; // Starter leuchten Grün
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.stroke();

            // Name
            ctx.fillStyle = "#fff";
            ctx.font = "bold 10px Inter";
            ctx.fillText(p.name, x - 20, y + 30);
        });
    }
};
