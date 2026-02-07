window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        let html = `
            <div class="kabine-header">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--neon-green); letter-spacing: 3px;">TEAM-KABINE</h2>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>
            <div class="fifa-cards-grid">
        `;

        window.Database.players.forEach(p => {
            const statusClass = p.present ? "active" : "inactive";
            const toggleClass = p.present ? "on" : "off";
            
            html += `
                <div class="fifa-card ${statusClass}">
                    <div class="presence-toggle ${toggleClass}" 
                         onclick="window.Database.togglePresence(${p.id}); window.SektorSporttasche.open();">
                    </div>
                    
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="rating" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat}</span>
                            <span class="position" onclick="window.SektorSporttasche.edit(${p.id}, 'pos')">${p.pos}</span>
                        </div>
                        
                        <div class="player-img" onclick="document.getElementById('file-${p.id}').click()">
                            ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius:50%">` : `<i class="fas fa-user-circle" style="font-size:3.5rem; color:rgba(255,255,255,0.1)"></i>`}
                            <input type="file" id="file-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                        </div>
                        
                        <div class="player-name" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">${p.name.toUpperCase()}</div>
                        
                        <div class="player-stats" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'pac')">
                            <div><span>PAC</span><br>${p.pac}</div>
                            <div><span>SHO</span><br>${p.sho}</div>
                            <div><span>PAS</span><br>${p.pas}</div>
                        </div>
                        
                        <div class="status-ribbon">${p.status}</div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        content.innerHTML = html;
    },

    edit(id, key) {
        const p = window.Database.players.find(player => player.id === id);
        const val = prompt(`Neuer Wert für ${key}:`, p[key]);
        if (val !== null) {
            window.Database.updatePlayer(id, key, isNaN(val) ? val : parseInt(val));
            this.open();
        }
    },

    upload(event, id) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                window.Database.updatePlayer(id, 'img', e.target.result);
                this.open();
            };
            reader.readAsDataURL(file);
        }
    }
};
