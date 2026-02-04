/**
 * TONI 2.0 - NEON GINGA ARENA ENGINE
 * Professionelles Rendering & Taktik-Logik
 */
window.arena = {
    canvas: null,
    ctx: null,
    
    init: function(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize: function() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.render();
    },

    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = "#050B05"; 
        ctx.fillRect(0,0,w,h);
        
        ctx.strokeStyle = "#39FF14"; 
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15; 
        ctx.shadowColor = "#39FF14";

        // Spielfeld-Linien
        ctx.strokeRect(60, 60, w-120, h-120);
        ctx.beginPath(); ctx.moveTo(w/2, 60); ctx.lineTo(w/2, h-60); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, h/7, 0, Math.PI*2); ctx.stroke();

        // Strafraum & Tore
        this.drawGoalArea(ctx, 60, h/2, 80, h/2.5); // Links
        this.drawGoalArea(ctx, w-60, h/2, -80, h/2.5); // Rechts

        // Auswechselbank Beschriftung
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(57, 255, 20, 0.2)";
        ctx.fillRect(w*0.25, h-45, w*0.5, 30);
        ctx.fillStyle = "#39FF14";
        ctx.font = "bold 12px Inter";
        ctx.textAlign = "center";
        ctx.fillText("TECHNICAL AREA - SUBSTITUTION BENCH", w/2, h-25);
        
        // Ball Rendering
        this.drawBall(ctx, w/2 + 50, h/2 - 40);
    },

    drawGoalArea: function(ctx, x, y, boxW, boxH) {
        ctx.strokeRect(x, y - boxH/2, boxW, boxH);
    },

    drawBall: function(ctx, x, y) {
        ctx.shadowBlur = 20; ctx.shadowColor = "#fff"; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
    },

    // FIX für app.html Fehler: Taktik-Muster anwenden
    applyTacticalPattern: function(pattern) {
        console.log("Taktik angewendet:", pattern);
        if(window.ToniTTS) ToniTTS.speak(`Taktik ${pattern} wird auf dem Feld umgesetzt.`, "deep");
        this.render(); // Platzhalter für Animationen
    },

    // FIX für app.html Fehler: Board zurücksetzen
    resetBoard: function() {
        console.log("Board Reset");
        if(window.ToniTTS) ToniTTS.speak("Spielfeld wird bereinigt.", "warm");
        this.render();
    }
};
