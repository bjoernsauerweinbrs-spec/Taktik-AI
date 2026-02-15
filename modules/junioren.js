window.SektorJunioren = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = ""; // Clear
        grid.style.display = "block";

        const albumTitle = document.createElement('h1');
        albumTitle.innerHTML = "MISSION STAMMPLATZ - STICKERALBUM";
        albumTitle.style.textAlign = "center";
        albumTitle.style.fontFamily = "Orbitron";
        albumTitle.style.color = "var(--neon-green)";
        albumTitle.style.marginBottom = "20px";
        grid.appendChild(albumTitle);

        const albumContainer = document.createElement('div');
        albumContainer.className = 'album-page';

        window.ToniDatabase.juniors.forEach(j => {
            const slot = document.createElement('div');
            slot.className = j.collected ? 'sticker-slot sticker-active' : 'sticker-slot sticker-empty';
            slot.onclick = () => {
                window.ToniDatabase.toggleSticker(j.id);
                this.render();
                if(j.collected) window.ToniBrain.speak(`${j.name} hat seinen Platz im Album sicher!`);
            };

            slot.innerHTML = `
                <div class="sticker-img" style="background-image: url('${j.photo}')"></div>
                ${j.collected ? `<div class="sticker-name">${j.name.toUpperCase()}</div>` : `<i class="fas fa-plus" style="color:#222"></i>`}
                <div style="position:absolute; top:-10px; right:-10px; background:var(--data-cyan); color:#000; font-size:0.5rem; padding:2px 5px; font-family:'Orbitron';">
                    ${j.team}
                </div>
            `;
            albumContainer.appendChild(slot);
        });

        grid.appendChild(albumContainer);
    }
};
