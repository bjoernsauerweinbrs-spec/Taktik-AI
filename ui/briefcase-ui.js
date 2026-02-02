(function() {
    window.BriefcaseUI = {
        kader: [],
        init() {
            const saved = localStorage.getItem('toni2_kader');
            this.kader = saved ? JSON.parse(saved) : [
                { id: 1, name: "David Luiz", number: 4, rating: 8, hr: 65, sleep: "7.5h", status: "Bereit", pos: "IV", x: 250, y: 350, team: 'home' }
            ];
            this.save();
        },
        save() { localStorage.setItem('toni2_kader', JSON.stringify(this.kader)); },
        
        // DIESE FUNKTION ÖFFNET DEN KOFFER
        toggle() {
            const el = document.getElementById('briefcase-overlay');
            if (el.style.display === 'none' || el.classList.contains('hidden')) {
                el.style.display = 'flex';
                el.classList.remove('hidden');
            } else {
                el.style.display = 'none';
                el.classList.add('hidden');
            }
        },

        switchSektor(sektor) {
            document.getElementById('briefcase-main-nav').classList.add('hidden');
            document.getElementById('briefcase-content').classList.remove('hidden');
            const target = document.getElementById('active-sektor-content');

            if(sektor === 'sporttasche') {
                target.innerHTML = `
                    <div class="sport-cockpit animate-fadeIn">
                        <div class="nav-card" onclick="BriefcaseUI.renderKader()">📋 KADERLISTE & RATING</div>
                        <div class="nav-card">📖 TRAININGSBUCH</div>
                        <div class="nav-card">🏟️ SPIELTAGSPLANUNG</div>
                    </div>`;
            } else if (sektor === 'orga') {
                target.innerHTML = `<div class="nav-card" onclick="Stadionzeitung.open()">📰 STADIONZEITUNG ÖFFNEN</div>`;
            }
        },

        backToMain() {
            document.getElementById('briefcase-main-nav').classList.remove('hidden');
            document.getElementById('briefcase-content').classList.add('hidden');
        },

        renderKader() {
            const target = document.getElementById('active-sektor-content');
            target.innerHTML = `
                <h3>Kader-Management</h3>
                <div class="kader-input-bar">
                    <input id="p-name" placeholder="Name"> <input id="p-nr" placeholder="Nr.">
                    <button onclick="BriefcaseUI.addPlayer()">+</button>
                </div>
                <div class="kader-list-scroll">
                    ${this.kader.map(p => `
                        <div class="player-entry">
                            <span>#${p.number} ${p.name}</span>
                            <button onclick="BriefcaseUI.toBoard(${p.id})">AUFS FELD</button>
                        </div>`).join('')}
                </div>`;
        },

        addPlayer() {
            const n = document.getElementById('p-name').value;
            const nr = document.getElementById('p-nr').value;
            if(!n || !nr) return;
            this.kader.push({ id: Date.now(), name: n, number: nr, pos: "ST", rating: 5, hr: 70, sleep: "8h", status: "Bereit", x: 400, y: 400, team: 'home' });
            this.save(); this.renderKader();
        },

        toBoard(id) {
            const p = this.kader.find(x => x.id === id);
            if(!arena.players.find(ap => ap.id === id)) {
                arena.players.push({...p});
                this.toggle(); 
            }
        }
    };

    window.showFullSetcard = function(p) {
        document.getElementById('setcard-content').innerHTML = `
            <div class="setcard-ui">
                <h3 style="color:var(--orange);">${p.name}</h3>
                <div style="font-size:45px; font-weight:bold;">#${p.number}</div>
                <hr style="opacity:0.2; margin:15px 0;">
                <div style="font-size:12px;">STATUS: ${p.status}</div>
                <div style="font-size:12px;">PULS: ${p.hr} BPM</div>
            </div>`;
    };
})();
