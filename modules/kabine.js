window.SektorKabine = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = ""; grid.className = 'mgmt-grid';
        window.ToniDatabase.players.forEach(p => {
            const card = document.createElement('div');
            card.className = 'fifa-card';
            card.innerHTML = `
                <div class="card-img" id="drop-p-${p.id}" style="background-image: url('${p.photo}')"></div>
                <div class="card-info">
                    <div class="card-rating">${p.rating}</div>
                    <div class="card-name">${p.name}</div>
                    <div style="font-size:0.6rem; opacity:0.5; display:grid; grid-template-columns:1fr 1fr;">
                        <span>PAC ${p.pace}</span><span>SHO ${p.sho}</span>
                    </div>
                </div>`;
            grid.appendChild(card);
            this.setupDrop(p.id);
        });
    },
    setupDrop(id) {
        const el = document.getElementById(`drop-p-${id}`);
        el.addEventListener('dragover', (e) => e.preventDefault());
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (ev) => { window.ToniDatabase.updatePhoto('player', id, ev.target.result); this.render(); };
            reader.readAsDataURL(e.dataTransfer.files[0]);
        });
    }
};
