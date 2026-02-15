window.SektorKabine = {
    render() {
        const g = document.getElementById('briefcase-grid');
        g.innerHTML = ""; g.className = 'mgmt-grid';
        window.ToniDatabase.players.forEach(p => {
            const c = document.createElement('div'); c.className = 'fifa-card';
            c.innerHTML = `
                <div class="card-img" id="dp-${p.id}" style="background-image:url('${p.photo}')"></div>
                <div class="card-info">
                    <div class="card-rating">${p.rating}</div>
                    <div class="card-name">${p.name}</div>
                </div>`;
            g.appendChild(c);
            this.initDrop(p.id);
        });
    },
    initDrop(id) {
        const el = document.getElementById(`dp-${id}`);
        el.addEventListener('dragover', (e) => e.preventDefault());
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            const r = new FileReader();
            r.onload = (ev) => { window.ToniDatabase.updatePhoto('player', id, ev.target.result); this.render(); };
            r.readAsDataURL(e.dataTransfer.files[0]);
        });
    }
};
