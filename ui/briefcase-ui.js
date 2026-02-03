window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    async switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');
        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            target.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <h3>👟 SPORTTASCHE // KADER</h3>
                    <div>
                        <button onclick="BriefcaseUI.exportData()" class="action-btn">💾 SICHERN</button>
                        <button onclick="document.getElementById('import-trigger').click()" class="action-btn">📂 LADEN</button>
                        <input type="file" id="import-trigger" hidden onchange="BriefcaseUI.importData(event)">
                    </div>
                </div>
                <div id="player-list-container">Lade...</div>
            `;
            await this.loadSquad();
        } else if (sektor === 'orga') {
            target.innerHTML = `<h3>🏢 GESCHÄFTSZIMMER</h3><textarea id="stadion-notes" class="orga-box"></textarea><button onclick="BriefcaseUI.saveOrga()" class="action-btn">SICHERN</button>`;
            const saved = localStorage.getItem('toni_orga_notes');
            if(saved) document.getElementById('stadion-notes').value = saved;
        }
    },

    async loadSquad() {
        const container = document.getElementById('player-list-container');
        try {
            const resp = await fetch('data/players.sample.json');
            const data = await resp.json();
            let html = "<div class='player-grid-view'>";
            
            data.homeTeam.players.forEach(p => {
                html += `
                    <div class="player-card red-border" onclick="BriefcaseUI.openSetcard('${p.name}', ${p.number}, '${p.position}')">
                        <div style="font-weight:bold; color:var(--accent-orange);">#${p.number}</div>
                        <div style="flex:1; margin-left:15px;">${p.name}</div>
                        <div class="status-dot"></div>
                    </div>`;
            });
            html += "</div>";
            container.innerHTML = html;
        } catch (e) { container.innerHTML = "Fehler beim Laden."; }
    },

    openSetcard(name, number, pos) {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn">← ZURÜCK ZUR LISTE</button>
            <div class="fifa-card-container">
                <div class="fifa-card gold">
                    <div class="card-inner">
                        <div class="card-rating">85</div>
                        <div class="card-pos">${pos}</div>
                        <div class="card-pic">👤</div>
                        <div class="card-name">${name.toUpperCase()}</div>
                        <div class="card-stats">
                            <div><span>PAC</span> 88</div><div><span>SHO</span> 74</div>
                            <div><span>PAS</span> 82</div><div><span>DRI</span> 85</div>
                            <div><span>DEF</span> 45</div><div><span>PHY</span> 70</div>
                        </div>
                    </div>
                </div>
                <div class="card-controls">
                    <h3>BEWERTUNG & STATUS</h3>
                    <label>Fitness (%)</label><input type="range" min="0" max="100" value="85">
                    <label>Status</label>
                    <select class="status-select">
                        <option>Anwesend</option><option>Verletzt</option><option>Fehlt</option>
                    </select>
                    <label>Ernährungsplan</label>
                    <textarea placeholder="z.B. High Carb vor dem Spiel..."></textarea>
                    <button class="action-btn" onclick="alert('Daten für ${name} gespeichert!')">SETCARD AKTUALISIEREN</button>
                </div>
            </div>
        `;
    },

    exportData() {
        const data = { board: window.arena.items, orga: localStorage.getItem('toni_orga_notes') };
        const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Toni2_Backup_${new Date().toLocaleDateString()}.json`;
        a.click();
    },

    importData(event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            if(data.board) { window.arena.items = data.board; window.arena.render(); }
            alert("Daten geladen!");
        };
        reader.readAsText(event.target.files[0]);
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
