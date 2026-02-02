(function() {
    window.BriefcaseUI = {
        kader: [],
        init() {
            const s = localStorage.getItem('toni2_kader');
            this.kader = s ? JSON.parse(s) : [{id:1, name:"David Luiz", number:4, pos:"IV", rating:8}];
        },
        toggle() {
            const el = document.getElementById('briefcase-overlay');
            el.classList.toggle('hidden');
        },
        switchSektor(s) {
            document.getElementById('briefcase-main-nav').classList.add('hidden');
            const target = document.getElementById('active-sektor-content');
            document.getElementById('briefcase-content').classList.remove('hidden');
            
            if(s === 'sporttasche') {
                target.innerHTML = `
                    <div class="sport-cockpit animate-fadeIn">
                        <div class="nav-card" onclick="BriefcaseUI.renderKader()">📋 Kader & Rating</div>
                        <div class="nav-card">📖 Trainingsbuch</div>
                        <div class="nav-card">🏟️ Spieltagsplanung</div>
                    </div>`;
            } else if(s === 'orga') {
                target.innerHTML = `<div class="nav-card" onclick="Stadionzeitung.open()">📰 Stadionzeitung öffnen</div>`;
            }
        },
        renderKader() {
            const target = document.getElementById('active-sektor-content');
            target.innerHTML = `
                <h3>Kader-Management</h3>
                <div style="margin:20px 0;"><input id="p-name" placeholder="Name"> <input id="p-nr" placeholder="Nr"> <button onclick="BriefcaseUI.addPlayer()">+</button></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${this.kader.map(p => `<div>#${p.number} ${p.name} <button onclick="BriefcaseUI.toBoard(${p.id})">Board</button></div>`).join('')}
                </div>`;
        },
        addPlayer() {
            const n = document.getElementById('p-name').value; const nr = document.getElementById('p-nr').value;
            if(!n || !nr) return;
            this.kader.push({id:Date.now(), name:n, number:nr, rating:5});
            localStorage.setItem('toni2_kader', JSON.stringify(this.kader)); this.renderKader();
        },
        toBoard(id) {
            const p = this.kader.find(x => x.id === id);
            arena.players.push({...p, x: 300, y: 300, team: 'home'}); this.toggle();
        }
    };

    window.showSetcard = function(p) {
        document.getElementById('setcard-content').innerHTML = `
            <div class="animate-fadeIn">
                <h3 style="color:var(--accent-orange);">${p.name}</h3><div style="font-size:40px;">#${p.number}</div>
                <hr style="opacity:0.2; margin:15px 0;">
                <div>Rating: ${p.rating}/10</div>
            </div>`;
    };
})();
