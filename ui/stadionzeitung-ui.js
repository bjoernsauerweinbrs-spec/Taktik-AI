(function() {
    window.Stadionzeitung = {
        currentPage: 0,
        pages: [
            { h: "THE ARENA TIMES", c: "<h1>DERBY-HELDEN</h1><p>Björn's Taktik-Analyse für das heutige Match.</p><div style='height:200px; background:#eee; margin:20px 0;'>[TEAM-FOTO]</div>" },
            { h: "TONI'S TAKTIK-CHECK", c: "<h3>RAUMDEUTUNG</h3><p>Wir agieren heute im Funinho-Style. Fokus auf die Halbräume.</p><p>Toni sagt: 'Die Kette muss höher stehen!'</p>" },
            { h: "SPONSOREN & PARTNER", c: "<h3>UNSERE UNTERSTÜTZER</h3><div style='display:grid; grid-template-columns:1fr 1fr; gap:20px;'><div>[SPONSOR A]</div><div>[SPONSOR B]</div></div>" }
        ],
        open() { this.currentPage = 0; this.render(); },
        render() {
            const target = document.getElementById('active-sektor-content');
            const p = this.pages[this.currentPage];
            target.innerHTML = `
                <div class="newspaper-container">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <button onclick="Stadionzeitung.prev()" class="tool-btn">◀</button>
                        <span style="color:#000;">SEITE ${this.currentPage + 1} / 3</span>
                        <button onclick="Stadionzeitung.next()" class="tool-btn">▶</button>
                    </div>
                    <div class="newspaper-page" contenteditable="true">
                        <small>${p.h}</small>
                        <div>${p.c}</div>
                    </div>
                    <button onclick="window.print()" style="margin-top:20px;">💾 PDF EXPORT</button>
                </div>`;
        },
        next() { if(this.currentPage < 2) { this.currentPage++; this.render(); } },
        prev() { if(this.currentPage > 0) { this.currentPage--; this.render(); } }
    };
})();
