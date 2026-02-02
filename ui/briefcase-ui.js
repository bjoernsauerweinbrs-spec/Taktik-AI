(function() {
    window.BriefcaseUI = {
        kader: [],
        initKader() {
            const saved = localStorage.getItem('toni2_kader');
            this.kader = saved ? JSON.parse(saved) : [
                { id: 1, name: "David Luiz", number: 4, rating: 8, hr: 65, sleep: "7.5h", status: "Bereit", pos: "IV", x: 250, y: 350, team: 'home' }
            ];
            this.save();
        },
        save() { localStorage.setItem('toni2_kader', JSON.stringify(this.kader)); },
        addPlayer() {
            const n = document.getElementById('in-name').value;
            const nr = document.getElementById('in-nr').value;
            if(!n || !nr) return;
            this.kader.push({ id: Date.now(), name: n, number: nr, pos: "ST", rating: 5, hr: 70, sleep: "8h", status: "Bereit", x: 300, y: 300, team: 'home' });
            this.save(); this.renderSport();
        },
        renderSport() {
            const t = document.getElementById('sub-content');
            t.innerHTML = `
                <div style="background:rgba(255,106,0,0.1); padding:15px; border-radius:10px; margin-bottom:20px; display:flex; gap:10px;">
                    <input id="in-name" placeholder="Name" style="flex:2;">
                    <input id="in-nr" placeholder="Nr." style="flex:1;">
                    <button onclick="BriefcaseUI.addPlayer()">+</button>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${this.kader.map(p => `<div style="padding:15px; background:rgba(255,255,255,0.05);">#${p.number} ${p.name} <button onclick="BriefcaseUI.toBoard(${p.id})">BOARD</button></div>`).join('')}
                </div>`;
        },
        renderOrga() {
            document.getElementById('sub-content').innerHTML = `
                <div onclick="window.Stadionzeitung.render()" style="background:white; color:black; padding:30px; border-radius:10px; cursor:pointer; text-align:center;">
                    📰 STADIONZEITUNG ÖFFNEN
                </div>`;
        },
        toBoard(id) {
            const p = this.kader.find(x => x.id === id);
            if(!arena.players.find(x => x.id === id)) { arena.players.push({...p}); toggleBriefcase(); }
        }
    };
    window.showFullSetcard = function(p) {
        document.getElementById('setcard-content').innerHTML = `
            <div class="setcard-ui"><h3>${p.name}</h3><div style="font-size:40px;">#${p.number}</div></div>`;
    };
})();
