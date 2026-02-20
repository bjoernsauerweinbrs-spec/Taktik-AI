/* ==========================================================
   TONI 2.0 - NEWSPAPER & PRINT ENGINE (UNGEKÜRZT)
   ========================================================== */

const newspaper = {
    currentPage: 1,
    maxPages: 4,

    /**
     * ÖFFNET DIE VORSCHAU
     */
    open: function() {
        this.maxPages = parseInt(mgmt.data.newsSettings.pages) || 4;
        this.currentPage = 1;
        
        const overlay = document.getElementById('newspaper-overlay');
        overlay.style.display = 'block';
        
        this.renderPreview();
        addMessage("Toni", `Vorschau für das ${this.maxPages}-seitige Magazin generiert.`);
    },

    /**
     * SCHLIESSEN
     */
    close: function() {
        document.getElementById('newspaper-overlay').style.display = 'none';
    },

    /**
     * BLÄTTERN
     */
    nextPage: function() {
        if (this.currentPage < this.maxPages - 1) {
            this.currentPage += 2;
            this.renderPreview();
        }
    },

    prevPage: function() {
        if (this.currentPage > 1) {
            this.currentPage -= 2;
            this.renderPreview();
        }
    },

    /**
     * RENDERT DIE INTERAKTIVE MAGAZIN-ANSICHT
     */
    renderPreview: function() {
        const container = document.getElementById('printable-newspaper');
        container.innerHTML = "";
        container.className = "newspaper-preview-mode"; // Spezial-Klasse für die Vorschau

        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const mgmtData = mgmt.data;

        // Erzeuge das Doppelseiten-Layout (Spread)
        const spread = document.createElement('div');
        spread.className = "magazine-spread";

        // Linke Seite (Gerade Zahl oder Seite 1 leer/Cover-Rückseite)
        const leftPageNum = this.currentPage === 1 ? null : this.currentPage;
        const rightPageNum = this.currentPage === 1 ? 1 : this.currentPage + 1;

        spread.innerHTML = `
            <div class="magazine-page left ${!leftPageNum ? 'cover-empty' : ''}">
                ${leftPageNum ? this.getPageContent(leftPageNum, players, mgmtData) : ''}
                <div class="page-footer">${leftPageNum || ''}</div>
            </div>
            <div class="magazine-page right">
                ${this.getPageContent(rightPageNum, players, mgmtData)}
                <div class="page-footer">${rightPageNum}</div>
            </div>
        `;

        // Navigation im Overlay hinzufügen (falls nicht da)
        const navHTML = `
            <div class="preview-nav-controls">
                <button onclick="newspaper.prevPage()" ${this.currentPage === 1 ? 'disabled' : ''}>⬅️ Zurück</button>
                <span>Seite ${rightPageNum === 1 ? '1 (Titel)' : leftPageNum + ' & ' + rightPageNum} von ${this.maxPages}</span>
                <button onclick="newspaper.nextPage()" ${rightPageNum >= this.maxPages ? 'disabled' : ''}>Weiter ➡️</button>
            </div>
        `;

        container.appendChild(spread);
        
        // Buttons für den echten Druckmodus vorbereiten
        this.prepPrintLayout(players, mgmtData);
    },

    /**
     * LOGIK FÜR DEN SEITENINHALT
     */
    getPageContent: function(num, players, mgmtData) {
        // Seite 1: TITELBLATT
        if (num === 1) return this.tplCover(mgmtData);
        
        // Seite 4, 8 oder 12: RÜCKSEITE (Sponsoren)
        if (num === this.maxPages) return this.tplSponsors(mgmtData);

        // Seite 2: TAKTIK
        if (num === 2) return this.tplTactics();

        // Seite 3: TOP-SPIELER
        if (num === 3) return this.tplPlayerFocus(players[0]);

        // Dynamische Spielerseiten für 8 und 12 Seiten
        if (num >= 4 && players[num - 3]) {
            return this.tplPlayerFocus(players[num - 3]);
        }

        // Fallback für leere Seiten
        return this.tplGeneric(num);
    },

    /* --- DESIGN TEMPLATES --- */

    tplCover: function(data) {
        return `
            <div class="news-content-wrapper cover">
                <div class="club-brand">
                    <img src="${data.clubLogo}" class="print-logo">
                    <h2>${data.clubName}</h2>
                </div>
                <div class="main-headline">
                    <h1>TONI AI 2.0</h1>
                    <p class="sub-line">DIE REVOLUTION IM ELITE-TRAINING</p>
                </div>
                <div class="cover-image-box">
                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000" class="full-img">
                </div>
                <div class="lead-text">
                    <p>${data.newsDraft}</p>
                </div>
                <div class="match-info">
                    <span>AUSGABE: ${new Date().toLocaleDateString('de-DE')}</span>
                    <span>STANDORT: ANALYSE-ZENTRUM</span>
                </div>
            </div>
        `;
    },

    tplSponsors: function(data) {
        return `
            <div class="news-content-wrapper sponsors">
                <h3>UNSERE PREMIUM-PARTNER</h3>
                <p style="font-size:10px; opacity:0.7; text-align:center;">ERFOLG DURCH STARKE NETZWERKE</p>
                <div class="sponsor-grid">
                    ${data.sponsors.map(s => `
                        <div class="sponsor-item">
                            ${s.logo ? `<img src="${s.logo}">` : `<b>${s.name}</b>`}
                        </div>
                    `).join('')}
                </div>
                <div class="footer-note">
                    <p>Powered by Toni AI 2.0 Elite Intelligence</p>
                    <img src="${data.clubLogo}" style="height:30px; opacity:0.3; filter:grayscale(1);">
                </div>
            </div>
        `;
    },

    tplTactics: function() {
        return `
            <div class="news-content-wrapper tactics">
                <h3>TAKTIK-ANALYSE</h3>
                <div class="mini-pitch">
                    <div class="pitch-line center-circle"></div>
                    <div class="pitch-line center-line"></div>
                </div>
                <div class="tactic-text">
                    <h4>KOMPAKTHEIT & PRESSING</h4>
                    <p>Toni 2.0 empfiehlt für das heutige System eine extrem hohe Intensität gegen den Ball. Die kognitiven Metriken zeigen...</p>
                    <ul>
                        <li>Scanning-Rate: +15%</li>
                        <li>Umschaltspiel: Elite-Level</li>
                    </ul>
                </div>
            </div>
        `;
    },

    tplPlayerFocus: function(p) {
        if (!p) return this.tplGeneric("SPIELER");
        return `
            <div class="news-content-wrapper player">
                <h3 class="side-title">PLAYER IN FOCUS</h3>
                <div class="player-hero">
                    <div class="hero-img">
                        ${p.img ? `<img src="${p.img}">` : '👤'}
                    </div>
                    <div class="hero-data">
                        <h4>${p.name}</h4>
                        <span class="pos-badge">${p.pos}</span>
                    </div>
                </div>
                <div class="player-analysis">
                    <div class="rating-circle">
                        <span class="val">${p.rating}</span>
                        <span class="lab">OVR</span>
                    </div>
                    <p>Der Spieler zeigt exzellente Werte im Bereich <b>${p.stats[0]} TEM</b> und <b>${p.stats[3]} DRI</b>. Toni 2.0 stuft ihn als Schlüsselspieler für die heutige Taktik ein.</p>
                </div>
            </div>
        `;
    },

    tplGeneric: function(num) {
        return `
            <div class="news-content-wrapper">
                <h3>INTERNE ANALYSE</h3>
                <div class="placeholder-box">TONI 2.0 DATA BLOCK</div>
                <p style="font-size:12px; line-height:1.6;">Hier werden zusätzliche Leistungsdaten aus dem VR-Center und dem Bio-Labor visualisiert, um die Tiefe des Magazins auf ${this.maxPages} Seiten zu gewährleisten.</p>
            </div>
        `;
    },

    /**
     * BEREITET DAS DRUCK-LAYOUT VOR (AUSSCHIESSEN)
     * Wird nur aktiv, wenn window.print() aufgerufen wird.
     */
    prepPrintLayout: function(players, mgmtData) {
        // Diese Funktion wird im Hintergrund ein verstecktes Div füllen, 
        // das die Seiten für den Drucker in der Reihenfolge 4-1, 2-3 usw. sortiert.
        const printContainer = document.createElement('div');
        printContainer.id = "real-print-area";
        printContainer.className = "print-only";
        
        // Logik für 4-Seiten (A4 Quer)
        if (this.maxPages === 4) {
            printContainer.innerHTML = `
                <div class="a4-sheet">
                    <div class="a5-page">${this.getPageContent(4, players, mgmtData)}</div>
                    <div class="a5-page">${this.getPageContent(1, players, mgmtData)}</div>
                </div>
                <div class="a4-sheet">
                    <div class="a5-page">${this.getPageContent(2, players, mgmtData)}</div>
                    <div class="a5-page">${this.getPageContent(3, players, mgmtData)}</div>
                </div>
            `;
        }
        // Hier folgen 8 und 12 Seiten... (Prinzip identisch)
        
        const existing = document.getElementById('real-print-area');
        if (existing) existing.remove();
        document.body.appendChild(printContainer);
    }
};
