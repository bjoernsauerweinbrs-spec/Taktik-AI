window.SektorKabine = {
    render() {
        const g = document.getElementById('briefcase-content');
        g.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <h1 style="font-family:'Orbitron'; color:var(--cyan);">MANNSCHAFTS-KABINE</h1>
                <div>
                    <button class="plan-btn active">KADER</button>
                    <button class="plan-btn">SPIELTAG-MODUS</button>
                </div>
            </div>
            <div class="mgmt-grid" id="player-grid"></div>
        `;

        const grid = document.getElementById('player-grid');
        window.ToniDatabase.players.forEach(p => {
            const card = document.createElement('div');
            card.className = 'fifa-card';
            card.innerHTML = `
                <div class="card-img" style="background-image:url('${p.photo}')"></div>
                <div class="card-info">
                    <div class="card-rating">${p.rating}</div>
                    <div style="font-weight:bold; margin-bottom:10px;">${p.name}</div>
                    <div style="display:flex; gap:10px; justify-content:center;">
                        <i class="fas fa-dumbbell" onclick="window.SektorKabine.toggle(${p.id}, 'inTraining')" style="color:${p.inTraining?'var(--neon)':'#333'}; cursor:pointer;"></i>
                        <i class="fas fa-tshirt" onclick="window.SektorKabine.toggle(${p.id}, 'inMatch')" style="color:${p.inMatch?'var(--cyan)':'#333'}; cursor:pointer;"></i>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    },
    toggle(id, type) {
        window.ToniDatabase.toggleStatus(id, type);
        this.render();
    }
};
