window.SektorZeitung = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = ""; // Clear
        grid.style.display = "block"; 

        const data = window.ToniDatabase.newspaper;

        const page = document.createElement('div');
        page.className = 'news-page';

        page.innerHTML = `
            <div class="news-header">
                <div class="news-meta" onclick="window.SektorZeitung.edit('issue')">${data.issue}</div>
                <h1 class="news-title" onclick="window.SektorZeitung.edit('title')">${data.title}</h1>
            </div>
            
            <div class="news-layout">
                <div class="editorial" onclick="window.SektorZeitung.edit('greeting')">
                    <h2 style="font-family:'Orbitron'; font-size: 1rem; margin-bottom: 15px;">WORT DES TRAINERS</h2>
                    <p>${data.greeting}</p>
                    <p style="margin-top:20px; font-weight:bold; font-family:'Orbitron';">COACH: BJÖRN</p>
                </div>

                <div class="news-sidebar">
                    <div class="match-day-box" onclick="window.SektorZeitung.edit('mainMatch')">
                        <small>TOP-SPIEL</small><br>
                        ${data.mainMatch}
                    </div>

                    <div class="sponsor-box" onclick="window.SektorZeitung.edit('sponsor1')">
                        <small>PRÄSENTIERT VON</small><br>
                        <strong>${data.sponsor1}</strong>
                    </div>

                    <div class="sponsor-box" onclick="window.SektorZeitung.edit('sponsor2')">
                        <i class="fas fa-handshake"></i><br>
                        <strong>${data.sponsor2}</strong>
                    </div>

                    <button onclick="window.SektorZeitung.generatePDF()" style="margin-top:auto; padding:15px; background:var(--neon-green); border:none; font-family:'Orbitron'; cursor:pointer;">
                        DRUCKVERSION GENERIEREN
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(page);
    },

    edit(key) {
        const current = window.ToniDatabase.newspaper[key];
        const newVal = prompt(`Bearbeite Bereich:`, current);
        if(newVal !== null && newVal !== "") {
            window.ToniDatabase.updateNews(key, newVal);
            this.render();
            window.ToniBrain.speak("Die Redaktion hat deine Änderungen übernommen.");
        }
    },

    generatePDF() {
        window.ToniBrain.speak("Ich bereite die Druckdaten für den Stadion-Kurier vor. PDF wird generiert.");
        alert("Elite-Feature: PDF wird in der Vollversion zum Download bereitgestellt.");
    }
};
