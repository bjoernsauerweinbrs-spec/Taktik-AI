(function() {
    window.Stadionzeitung = {
        currentPage: 0,
        pages: [
            { title: "COVER STORY", content: "<h1>DERBY-FIEBER</h1><p>Björn's Taktik gegen den Erzrivalen.</p><div class='image-placeholder'>[HELDEN-FOTO]</div>" },
            { title: "TONI'S TAKTIK", content: "<h3>DIE ANALYSE</h3><p>Wir nutzen heute das Funinho-Prinzip für maximale Raumausbeute.</p><ul><li>Schnelles Umschalten</li><li>4-Kette hochschieben</li></ul>" },
            { title: "KADER & SPONSOREN", content: "<h3>TEAM-STATUS</h3><p>David Luiz ist in Bestform (HR: 65).</p><hr><h4>UNSERE PARTNER</h4><div class='sponsor-box'>NEON ENERGY DRINK</div>" }
        ],
        open() { this.render(); },
        nextPage() { if(this.currentPage < this.pages.length - 1) { this.currentPage++; this.render(); }},
        prevPage() { if(this.currentPage > 0) { this.currentPage--; this.render(); }},
        render() {
            const target = document.getElementById('active-sektor-content');
            const page = this.pages[this.currentPage];
            target.innerHTML = `
                <div class="newspaper-container animate-flip">
                    <div class="page-info">Seite ${this.currentPage + 1} von ${this.pages.length}</div>
                    <div class="newspaper-page">
                        <h2>${page.title}</h2>
                        <div class="page-inner-content" contenteditable="true">${page.content}</div>
                    </div>
                    <div class="page-controls">
                        <button onclick="Stadionzeitung.prevPage()">◀ ZURÜCK</button>
                        <button onclick="Stadionzeitung.nextPage()">VOR ▶</button>
                    </div>
                </div>`;
        }
    };
})();
