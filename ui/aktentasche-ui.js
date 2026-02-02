(function() {
    window.Aktentasche = {
        kader: [
            { id: 1, name: "David Luiz", number: 4, team: 'home', rating: 8, x: 200, y: 300 },
            { id: 2, name: "Max Miller", number: 10, team: 'home', rating: 6, x: 400, y: 250 }
        ],

        renderSporttasche() {
            const target = document.getElementById('subfolder-inner');
            target.innerHTML = `
                <h3>Sporttasche: Kader & Spiel</h3>
                <div class="player-list-grid">
                    ${this.kader.map(p => `
                        <div class="player-item">
                            <span>#${p.number} ${p.name}</span>
                            <button onclick="Aktentasche.sendToBoard(${p.id})">Aufs Feld</button>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        sendToBoard(id) {
            const p = this.kader.find(player => player.id === id);
            if(!arena.players.find(ap => ap.id === id)) {
                arena.players.push(p);
                if(window.toniSpeak) toniSpeak(p.name + " ist jetzt auf dem Feld.");
            }
        }
    };
})();
