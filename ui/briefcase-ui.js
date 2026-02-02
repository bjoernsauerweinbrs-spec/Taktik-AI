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
            const name = document.getElementById('new-p-name').value;
            const nr = document.getElementById('new-p-nr').value;
            if(!name || !nr) return;
            this.kader.push({ id: Date.now(), name: name, number: nr, pos: "ST", rating: 5, hr: 70, sleep: "8h", status: "Bereit", x: 300, y: 300, team: 'home' });
            this.save(); this.renderSport();
        },
        renderSport() {
            const t = document.getElementById('sub-content');
            t.innerHTML = `
                <div style="background:rgba(255,106,0,0.1); padding:15px; border-radius:10px; margin-bottom:20px; display:flex; gap:10px;">
                    <input id="new-p-name" placeholder="Name" style="background:#1A2233; color:white; flex:2;">
                    <input id="new-p-nr" placeholder="Nr." style="background:#1A2233; color:white; flex:1;">
                    <button onclick="BriefcaseUI.addPlayer()" style="background:var(--accent-orange); color:white; border:none; padding:5px 15px; border-radius:4px;">HINZUFÜGEN</button>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${this.kader.map(p => `
                        <div style="padding:15px; background:rgba(255,255,255,0.05); border-radius:10px; display:flex; justify-content:space-between;">
                            <span>#${p.number} ${p.name}</span>
                            <button onclick="BriefcaseUI.toBoard(${p.id})" style="background:var(--success-green); border:none; color:white; padding:4px 8px; border-radius:4px;">AUFS BOARD</button>
                        </div>
                    `).join('')}
                </div>`;
        },
        renderOrga() {
            document.getElementById('sub-content').innerHTML = `
                <div style="text-align:center;">
                    <button onclick="window.Stadionzeitung.render()" style="background:white; color:black; padding:30px; border-radius:12px; cursor:pointer; font-weight:bold;">📰 STADIONZEITUNG ÖFFNEN</button>
                </div>`;
        },
        toBoard(id) {
            const p = this.kader.find(x => x.id === id);
            if(!arena.players.find(x => x.id === id)) { 
                arena.players.push({...p}); 
                toggleBriefcase(); 
            }
        }
    };
})();
