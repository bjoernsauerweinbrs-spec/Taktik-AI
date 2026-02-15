window.SektorJunioren = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = "";
        grid.className = 'mgmt-grid';
        grid.style.background = "rgba(255,255,255,0.02)";

        window.ToniDatabase.juniors.forEach(j => {
            const slot = document.createElement('div');
            // Wenn gesammelt: White-Sticker-Look, sonst grauer Slot
            slot.className = j.collected ? 'sticker-slot sticker-active' : 'sticker-slot sticker-empty';
            slot.id = `drop-junior-${j.id}`;
            
            slot.innerHTML = `
                <div class="sticker-img-container" style="background-image: url('${j.photo}')">
                    ${!j.collected ? '<div class="sticker-plus"><i class="fas fa-plus"></i></div>' : ''}
                </div>
                <div class="sticker-label">
                    <span class="st-name">${j.name}</span>
                    <span class="st-team">${j.team}</span>
                </div>
            `;
            
            grid.appendChild(slot);
            this.initDrop(j.id);
        });
    },

    initDrop(id) {
        const el = document.getElementById(`drop-junior-${id}`);
        
        el.addEventListener('dragover', (e) => {
            e.preventDefault();
            el.style.borderColor = "var(--neon-green)";
            el.style.transform = "scale(1.05)";
        });

        el.addEventListener('dragleave', () => {
            el.style.borderColor = "";
            el.style.transform = "";
        });

        el.addEventListener('drop', (e) => {
            e.preventDefault();
            el.style.transform = "";
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    window.ToniDatabase.updatePhoto('junior', id, ev.target.result);
                    this.render(); // Sofort-Update des Albums
                    window.ToniBrain.speak(`Super! Der Sticker von ${window.ToniDatabase.juniors.find(x=>x.id==id).name} ist eingeklebt.`);
                };
                reader.readAsDataURL(file);
            }
        });
    }
};
