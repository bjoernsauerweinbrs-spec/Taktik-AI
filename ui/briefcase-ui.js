(function() {
    window.BriefcaseUI = {
        kader: [],
        init() {
            const saved = localStorage.getItem('toni2_kader');
            this.kader = saved ? JSON.parse(saved) : [{id:1, name:"David Luiz", number:4, pos:"IV", rating:8, hr:65, status:"Fit"}];
        },
        toggle() {
            const el = document.getElementById('briefcase-overlay');
            el.style.display = (el.style.display === 'none') ? 'flex' : 'none';
        },
        switchSektor(sektor) {
            document.getElementById('briefcase-main-nav').classList.add('hidden');
            const content = document.getElementById('briefcase-content');
            content.classList.remove('hidden');
            const target = document.getElementById('active-sektor-content');

            if(sektor === 'sporttasche') {
                target.innerHTML = `
                    <div class="sporttasche-cockpit">
                        <button class="nav-card" onclick="BriefcaseUI.renderKader()">📋 Kaderliste & Rating</button>
                        <button class="nav-card" onclick="alert('Trainingsbuch wird geladen...')">📖 Trainingsbuch</button>
                        <button class="nav-card" onclick="alert('Spieltagsplanung wird geladen...')">🏟️ Spieltagsplanung</button>
                    </div>`;
            } else if (sektor === 'orga') {
                target.innerHTML = `<div class="nav-card" onclick="Stadionzeitung.open()">📰 Stadionzeitung (Redaktion)</div>`;
            }
        },
        renderKader() {
            const target = document.getElementById('active-sektor-content');
            target.innerHTML = `
                <h3>Kader-Management</h3>
                <div class="kader-input-bar">
                    <input id="p-name" placeholder="Name"> <input id="p-nr" placeholder="Nr.">
                    <button onclick="BriefcaseUI.addPlayer()">+</button>
                </div>
                <div class="kader-grid-display">
                    ${this.kader.map(p => `<div class="player-row"><span>#${p.number} ${p.name}</span> <button onclick="BriefcaseUI.toBoard(${p.id})">Aufs Feld</button></div>`).join('')}
                </div>`;
        },
        backToMain() {
            document.getElementById('briefcase-main-nav').classList.remove('hidden');
            document.getElementById('briefcase-content').classList.add('hidden');
        },
        toBoard(id) {
            const p = this.kader.find(x => x.id === id);
            if(!arena.players.find(ap => ap.id === id)) {
                arena.players.push({...p, x: 200, y: 300, team: 'home'});
                this.toggle();
            }
        }
    };
})();
