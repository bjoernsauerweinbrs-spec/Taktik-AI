window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="color:var(--neon-green)">TEAM-KABINE</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
            <div class="fifa-cards-grid">
        `;

        window.Database.players.forEach(p => {
            html += `
                <div class="fifa-card ${p.present ? 'active' : 'inactive'}">
                    <div class="presence-toggle ${p.present ? 'on' : 'off'}" 
                         onclick="window.Database.updatePlayer(${p.id}, 'present', !${p.present}); window.SektorSporttasche.open();"></div>
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="rating" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat}</span>
                            <span class="position" onclick="window.SektorSporttasche.edit(${p.id}, 'pos')">${p.pos}</span>
                        </div>
                        <div class="player-img" onclick="document.getElementById('img-up-${p.id}').click()">
                            ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius:15px">` : `<i class="fas fa-user-circle" style="font-size:3rem; opacity:0.2"></i>`}
                            <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                        </div>
                        <div class="player-name" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">${p.name}</div>
                        <div class="player-stats">
                            <span>PAC ${p.pac}</span> <span>SHO ${p.sho}</span> <span>PAS ${p.pas}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        content.innerHTML = html + `</div>`;
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        const val = prompt(`Neuer Wert für ${key}:`, p[key]);
        if (val) { window.Database.updatePlayer(id, key, isNaN(val) ? val : parseInt(val)); this.open(); }
    },

    upload(e, id) {
        const reader = new FileReader();
        reader.onload = () => { window.Database.updatePlayer(id, 'img', reader.result); this.open(); };
        reader.readAsDataURL(e.target.files[0]);
    }
};
