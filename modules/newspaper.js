/* ==========================================================
   NEWSPAPER MODUL - ELITE VORSCHAU (WOW-EFFEKT)
   ========================================================== */

const newspaper = {
    open: function() {
        const overlay = document.getElementById('newspaper-overlay');
        overlay.style.display = 'block';
        this.renderPreview();
    },

    close: function() {
        document.getElementById('newspaper-overlay').style.display = 'none';
    },

    renderPreview: function() {
        const container = document.getElementById('printable-newspaper');
        const data = mgmt.data;
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];

        // Magazin-Design mit Doppelseite
        container.innerHTML = `
            <div class="magazine-spread" style="display:flex; justify-content:center; gap:0; perspective: 1500px;">
                <div class="magazine-page left" style="background:var(--paper); width:400px; height:560px; padding:30px; border:1px solid #ddd; box-shadow: -15px 20px 30px rgba(0,0,0,0.3); border-radius: 5px 0 0 5px;">
                    <h3 style="border-bottom:1px solid #000;">SPONSOREN</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px;">
                        ${data.sponsors.map(s => `<div style="border:1px solid #ccc; padding:10px; text-align:center; font-size:10px;">${s.name}</div>`).join('')}
                    </div>
                </div>
                <div class="magazine-page right" style="background:var(--paper); width:400px; height:560px; padding:30px; border:1px solid #ddd; box-shadow: 15px 20px 30px rgba(0,0,0,0.3); border-radius: 0 5px 5px 0; position:relative;">
                    <div style="text-align:center; border-bottom:4px solid #000;">
                        <h1 style="margin:0; font-size:40px;">${data.clubName}</h1>
                        <p style="font-size:10px;">AUSGABE ${new Date().toLocaleDateString()}</p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400" style="width:100%; margin:20px 0; border:1px solid #000;">
                    <h2 style="font-size:22px; line-height:1.1;">ELITE ANALYSE: TONI 2.0 STARTET DURCH</h2>
                    <p style="font-size:12px;">${data.newsDraft}</p>
                </div>
            </div>
            <div style="text-align:center; margin-top:30px;">
                <button class="action-btn" onclick="window.print()">JETZT DRUCKEN (A4 QUER)</button>
            </div>
        `;
    }
};
