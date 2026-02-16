window.SektorKabine = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = `<h1 style="font-family:'Orbitron'; margin-bottom:40px; color:var(--data-cyan)">MANNSCHAFTS-KABINE</h1>`;
        
        const container = document.createElement('div');
        container.className = 'mgmt-grid';

        window.ToniDatabase.players.forEach(p => {
            const card = document.createElement('div');
            card.className = 'fifa-card';
            card.innerHTML = `
                <div style="height:60%; background-image:url('${p.photo}'); background-size:cover; background-position:top;"></div>
                <div class="card-info">
                    <div class="card-rating">${p.rating}</div>
                    <div style="font-weight:bold; text-transform:uppercase;">${p.name}</div>
                </div>
            `;
            container.appendChild(card);
        });
        grid.appendChild(container);
    }
};
