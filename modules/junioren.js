window.SektorJunioren = {
    render() {
        const g = document.getElementById('briefcase-content');
        g.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:40px;">
                <h1 style="font-family:'Orbitron'; color:var(--cyan);">JUNIOREN AKADEMIE</h1>
                <div style="font-family:'Orbitron'; font-size:0.7rem;">STATUS: <span style="color:var(--neon);">PROFESSIONELLES TRAINING</span></div>
            </div>
            <div class="mgmt-grid"></div>
        `;

        const grid = g.querySelector('.mgmt-grid');
        window.ToniDatabase.juniors.forEach(j => {
            const slot = document.createElement('div');
            slot.className = j.collected ? 'sticker-slot sticker-active' : 'sticker-slot';
            slot.id = `jr-${j.id}`;
            
            slot.innerHTML = `
                <div style="width:100%; height:100%; background-image:url('${j.photo}'); background-size:cover;"></div>
                ${j.collected ? `<div style="text-align:center; padding-top:10px;">
                    <div style="font-weight:900; font-size:0.7rem;">${j.name}</div>
                    <div style="font-size:0.4rem; color:var(--neon);">TRAINING: ${j.trainingCount} EINHEITEN</div>
                    <div class="bar-bg" style="height:4px; margin-top:5px;"><div class="bar-fill" style="width:${j.skillTechnik}%"></div></div>
                </div>` : '<i class="fas fa-plus" style="opacity:0.2"></i>'}
            `;
            grid.appendChild(slot);
            this.initDrop(j.id);
        });
    },

    initDrop(id) {
        const el = document.getElementById(`jr-${id}`);
        el.addEventListener('dragover', (e) => e.preventDefault());
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            const r = new FileReader();
            r.onload = (ev) => { window.ToniDatabase.updatePhoto('junior', id, ev.target.result); this.render(); };
            r.readAsDataURL(e.dataTransfer.files[0]);
        });
    }
};
