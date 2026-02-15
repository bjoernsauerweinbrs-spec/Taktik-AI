window.SektorJunioren = {
    render() {
        const g = document.getElementById('briefcase-grid');
        g.innerHTML = ""; g.className = 'mgmt-grid';
        window.ToniDatabase.juniors.forEach(j => {
            const s = document.createElement('div');
            s.className = j.collected ? 'sticker-slot sticker-active' : 'sticker-slot';
            s.id = `dj-${j.id}`;
            s.innerHTML = `<div style="width:100%; height:100%; background-image:url('${j.photo}'); background-size:cover;"></div><div style="text-align:center; font-size:0.6rem; font-weight:bold; margin-top:5px;">${j.name}</div>`;
            g.appendChild(s);
            this.initDrop(j.id);
        });
    },
    initDrop(id) {
        const el = document.getElementById(`dj-${id}`);
        el.addEventListener('dragover', (e) => e.preventDefault());
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            const r = new FileReader();
            r.onload = (ev) => { window.ToniDatabase.updatePhoto('junior', id, ev.target.result); this.render(); };
            r.readAsDataURL(e.dataTransfer.files[0]);
        });
    }
};
