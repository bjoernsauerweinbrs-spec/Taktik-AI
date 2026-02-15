window.SektorKabine = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = ""; // Clear
        
        window.ToniDatabase.players.forEach(p => {
            const card = document.createElement('div');
            card.className = p.type === 'toty' ? 'fifa-card' : 'sticker-card';
            
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${p.photo}')" onclick="window.SektorKabine.changePhoto(${p.id})"></div>
                <div class="card-info">
                    <div style="font-size: 1.2rem; color:${p.type==='toty'?'var(--data-cyan)':'#000'}">${p.rating}</div>
                    <div style="font-size: 0.8rem; font-weight:bold;">${p.name}</div>
                    <div class="card-stats">
                        <div class="stat-item" onclick="window.SektorKabine.edit(${p.id}, 'pace')">PAC: ${p.pace}</div>
                        <div class="stat-item" onclick="window.SektorKabine.edit(${p.id}, 'sho')">SHO: ${p.sho}</div>
                        <div class="stat-item" onclick="window.SektorKabine.edit(${p.id}, 'pas')">PAS: ${p.pas}</div>
                        <div class="stat-item" onclick="window.SektorKabine.edit(${p.id}, 'dri')">DRI: ${p.dri}</div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    edit(id, key) {
        const newVal = prompt(`Neuer Wert für ${key.toUpperCase()}:`);
        if(newVal) {
            window.ToniDatabase.updatePlayer(id, key, newVal);
            this.render(); // Refresh
        }
    },

    changePhoto(id) {
        const newUrl = prompt("Bild-URL einfügen (oder später Datei-Upload):");
        if(newUrl) {
            window.ToniDatabase.updatePlayer(id, 'photo', newUrl);
            this.render();
        }
    }
};
