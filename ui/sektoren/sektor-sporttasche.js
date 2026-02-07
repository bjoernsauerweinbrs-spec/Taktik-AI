window.SektorSporttasche = {
    open() {
        const content = document.getElementById('active-content') || document.querySelector('.briefcase-window');
        if (!content) return;

        let html = `
            <div class="kabine-header">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--neon-green); letter-spacing: 3px;">TEAM-KABINE (PRO-DEMO)</h2>
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
                            <span class="rating" onclick="window.SektorSporttasche.editStat(${p.id}, 'rat')">${p.rat}</span>
                            <span class="position" onclick="window.SektorSporttasche.editStat(${p.id}, 'pos')">${p.pos}</span>
                        </div>
                        
                        <div class="player-img" onclick="document.getElementById('upload-${p.id}').click()">
                            ${p.img.startsWith('assets') ? '<i class="fas fa-user-circle"></i>' : `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius:50%">`}
                            <input type="file" id="upload-${p.id}" style="display:none" onchange="window.SektorSporttasche.handleUpload(event, ${p.id})">
                        </div>
                        
                        <div class="player-name" onclick="window.SektorSporttasche.editStat(${p.id}, 'name')">${p.name.toUpperCase()}</div>
                        
                        <div class="player-stats">
                            <div onclick="window.SektorSporttasche.editStat(${p.id}, 'pac')"><span>PAC</span><br>${p.pac}</div>
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

    handleUpload(event, playerId) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                window.Database.updatePlayerImage(playerId, e.target.result);
                this.open();
            };
            reader.readAsDataURL(file);
        }
    },

    editStat(id, stat) {
        const player = window.Database.players.find(p => p.id === id);
        const newVal = prompt(`Neuer Wert für ${stat}:`, player[stat]);
        if (newVal !== null) {
            player[stat] = isNaN(newVal) ? newVal : parseInt(newVal);
            this.open();
        }
    }
};
