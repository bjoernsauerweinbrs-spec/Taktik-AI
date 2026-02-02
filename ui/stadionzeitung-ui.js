(function() {
    window.Stadionzeitung = {
        currentLayout: 'matchday-classic',
        
        init() {
            console.log("📰 Stadionzeitung-Generator: Online");
        },

        // Generiert ein Vorschaubild der Seite
        generatePreview() {
            const lineup = window.arena.players; // Holt Daten vom Spielfeld
            const spotlightPlayer = window.TONI.players[0]; // Beispiel
            
            return `
                <div class="sz-page" style="background: #0B1220; color: white; padding: 40px;">
                    <header>
                        <h1 style="color: #FF6A00; border-bottom: 2px solid #FF6A00;">STADIONREPORT</h1>
                        <p>Heimspiel gegen den Tabellenführer</p>
                    </header>
                    <main style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <section class="lineup-box">
                            <h3>Voraussichtliche Aufstellung</h3>
                            <div class="mini-pitch"> </div>
                        </section>
                        <section class="player-spotlight">
                            <h3>Spieler im Fokus</h3>
                            <p>${spotlightPlayer.name} (#${spotlightPlayer.number})</p>
                            <div class="stats-radar"> </div>
                        </section>
                    </main>
                    <footer style="margin-top: 40px; border-top: 1px solid #2E2E2E;">
                        <p>Präsentiert von: [Hauptsponsor Logo]</p>
                    </footer>
                </div>
            `;
        }
    };
})();
