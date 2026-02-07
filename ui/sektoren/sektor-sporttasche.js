/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Rendert FIFA-Cards mit Schildform, 6 Attributen und Bild-Upload.
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; padding: 0 10px;">
                <h2 style="color:var(--neon-green); letter-spacing: 2px;">TEAM-KABINE</h2>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
            <div class="fifa-cards-grid">
        `;

        window.Database.players.forEach(p => {
            const statusClass = p.present ? 'active' : 'inactive';
            
            html += `
                <div class="fifa-card ${statusClass}">
                    <div class="presence-toggle ${p.present ? 'on' : 'off'}" 
                         onclick="window.Database.togglePresence(${p.id}); window.SektorSporttasche.open();"></div>
                    
                    <div class="card-inner">
                        <div class="rating" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat}</div>
                        <div class="pos-label" onclick="window.SektorSporttasche.edit(${p.id}, 'pos')">${p.pos}</div>
                        
                        <div class="player-img-container" onclick="document.getElementById('img-up-${p.id}').click()">
                            ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` 
                                    : `<i class="fas fa-user-ninja" style="font-size:3rem; margin-top:15px; opacity:0.1"></i>`}
                            <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                        </div>
                        
                        <div class="player-name-banner" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">
                            ${p.name.toUpperCase()}
                        </div>
                        
                        <div class="stats-grid">
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'pac')"><span>${p.pac || 0}</span>PAC</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'sho')"><span>${p.sho || 0}</span>SHO</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'pas')"><span>${p.pas || 0}</span>PAS</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'dri')"><span>${p.dri || 0}</span>DRI</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'def')"><span>${p.def || 0}</span>DEF</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'phy')"><span>${p.phy || 0}</span>PHY</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html + `</div>`;
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        
        const val = prompt(`Neuer Wert für ${key.toUpperCase()}:`, p[key]);
        if (val !== null) {
            // Speichert Zahlen als Zahl, Text als Text
            const finalVal = isNaN(val) || val === "" ? val : parseInt(val);
            window.Database.updatePlayer(id, key, finalVal);
            this.open();
        }
    },

    upload(e, id) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            window.Database.updatePlayer(id, 'img', reader.result);
            this.open();
        };
        reader.readAsDataURL(file);
    }
};
