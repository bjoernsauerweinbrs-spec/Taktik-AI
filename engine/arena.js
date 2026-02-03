// Ergänzung innerhalb von window.arena = { ... }

    // Verschiebt einen Spieler sanft über Zeit
    glideTo(playerId, targetX, targetY) {
        const p = [...this.players, ...this.opponents].find(x => x.id === playerId);
        if (!p) return;

        const duration = 1000; // 1 Sekunde Laufweg
        const startX = p.x;
        const startY = p.y;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing (Sanftes Anlaufen/Abbremsen)
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

            p.x = startX + (targetX - startX) * ease;
            p.y = startY + (targetY - startY) * ease;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },

    // Spezielle Formationen für Toni
    applyGingaTactics(formationType) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        if (formationType === 'pressing') {
            this.players.forEach((p, i) => {
                // Alle schieben weit nach vorne in die Gegnerhälfte
                const targetX = w / 2 + (i * 20);
                const targetY = (h / (this.players.length + 1)) * (i + 1);
                this.glideTo(p.id, targetX, targetY);
            });
        }
    }
// ... restlicher Code bleibt bestehen
