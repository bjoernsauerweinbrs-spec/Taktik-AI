window.BriefcaseUI = {
    init() {
        console.log("Aktentasche geladen.");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            console.log("Koffer Status gewechselt.");
        }
    },

    switchSektor(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        const target = document.getElementById('active-content');
        
        if (sektor === 'sport') {
            target.innerHTML = `<h3>👟 Sporttasche</h3><button onclick="BriefcaseUI.toBoard(1)" class="login-btn">DAVID LUIZ AUFS FELD</button>`;
        } else if (sektor === 'orga') {
            target.innerHTML = `<h3>🏢 Geschäftszimmer</h3><p>Redaktion wird vorbereitet.</p>`;
        }
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    },

    toBoard(id) {
        // Spieler-Logik hier...
        this.toggle();
        ToniAI.speak("Spieler wird auf das Feld geschickt.");
    }
};
