window.SektorKabine = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = "";
        grid.className = 'mgmt-grid';

        window.ToniDatabase.players.forEach(p => {
            const card = document.createElement('div');
            card.className = 'fifa-card';
            card.innerHTML = `
                <div class="card-img" id="drop-player-${p.id}" style="background-image: url('${p.photo}')"></div>
                <div style="padding:15px; text-align:center;">
                    <div style="font-family:'Orbitron'; font-size:1.2rem; color:var(--data-cyan);">${p.rating}</div>
                    <div style="font-weight:bold; font-size:0.8rem; margin:5px 0;">${p.name}</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; font-size:0.6rem; opacity:0.6;">
                        <span>PAC ${p.pace}</span><span>SHO ${p.sho}</span>
                        <span>PAS ${p.pas}</span><span>DRI ${p.dri}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
            this.initDrop(p.id, 'player');
        });
    },

    initDrop(id, type) {
        const el = document.getElementById(`drop-${type}-${id}`);
        el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('drop-active'); });
        el.addEventListener('dragleave', () => el.classList.remove('drop-active'));
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            el.classList.remove('drop-active');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    window.ToniDatabase.updatePhoto(type, id, ev.target.result);
                    this.render();
                    window.ToniBrain.speak("Foto aktualisiert und gespeichert.");
                };
                reader.readAsDataURL(file);
            }
        });
    }
};
