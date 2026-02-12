/**
 * TONI 2.0 - SEKTOR STADIONZEITUNG (ELITE PUBLISHING HUB)
 * Fokus: Modulares Layout, CMS-Editing & Print-Optimierung
 * Status: ETAPPE 5 - REDAKTION VOLLSTÄNDIG VERSIEGELT
 */
window.SektorStadionzeitung = {
    
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;
        
        // Initialisierung der Daten falls nicht vorhanden
        if (!window.Database.magazine) {
            window.Database.magazine = {
                pages: [
                    { type: 'cover', title: 'MATCHDAY', subtitle: 'Die offizielle Stadionzeitung', date: 'Februar 2026', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800' },
                    { type: 'article', headline: 'Der Coach im Interview', text: 'Wir haben große Pläne für die Rückrunde...', img: '' }
                ]
            };
        }
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const magazine = window.Database.magazine;

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 300px; gap: 25px; height: 100%;">
                
                <div style="overflow-y: auto; padding-right: 15px; background: rgba(255,255,255,0.02); border-radius: 15px; padding: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h2 style="color:var(--neon-green); font-family:'Orbitron'; font-size:1rem; margin:0;">STADIONZEITUNG PREVIEW</h2>
                        <button class="pro-btn-gold" onclick="window.print()" style="font-size:0.6rem;"><i class="fas fa-print"></i> DRUCK-EXPORT</button>
                    </div>

                    <div id="magazine-preview-container" style="display: flex; flex-direction: column; gap: 40px; align-items: center;">
                        ${magazine.pages.map((p, idx) => this.renderPageHTML(p, idx)).join('')}
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border-left: 1px solid #222; padding: 20px; display:flex; flex-direction:column;">
                    <h3 style="color:#fff; font-family:'Orbitron'; font-size:0.7rem; margin-bottom:20px;">REDAKTION-TOOLS</h3>
                    
                    <button class="tactic-btn" style="width:100%; margin-bottom:10px; border-color:var(--neon-green);" onclick="window.SektorStadionzeitung.addPage()">
                        <i class="fas fa-plus"></i> NEUE SEITE HINZUFÜGEN
                    </button>
                    
                    <div style="flex:1; overflow-y:auto; margin-top:20px;">
                        <p style="font-size:0.6rem; color:#666; margin-bottom:10px;">SEITEN-STRUKTUR</p>
                        ${magazine.pages.map((p, idx) => `
                            <div style="background:#111; padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; border:1px solid #222;">
                                <span style="font-size:0.7rem; color:#fff;">S.${idx+1} [${p.type.toUpperCase()}]</span>
                                <div style="display:flex; gap:8px;">
                                    <i class="fas fa-edit" onclick="window.SektorStadionzeitung.openEditor(${idx})" style="color:var(--data-cyan); cursor:pointer; font-size:0.8rem;"></i>
                                    <i class="fas fa-trash" onclick="window.SektorStadionzeitung.removePage(${idx})" style="color:var(--status-error); cursor:pointer; font-size:0.8rem;"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div id="mag-editor-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#0a0a0a; border:2px solid var(--neon-green); padding:30px; border-radius:20px; z-index:1000005; width:500px; box-shadow:0 0 150px #000; color:#fff; font-family:'Orbitron';">
                <div id="mag-editor-content"></div>
            </div>
        `;
    },

    renderPageHTML(p, idx) {
        const club = window.coachInfo?.verein || "UNSER VEREIN";
        
        // High-Level Layouts je nach Typ
        if (p.type === 'cover') {
            return `
                <div class="mag-page" style="width:400px; height:560px; background:#fff; color:#000; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.5); overflow:hidden;">
                    <div style="height:60%; background:url('${p.img}') center/cover;"></div>
                    <div style="padding:30px; text-align:center;">
                        <div style="font-size:0.8rem; letter-spacing:4px; color:#666;">${club}</div>
                        <h1 style="font-size:2.5rem; margin:10px 0; font-weight:900;">${p.title}</h1>
                        <div style="width:50px; height:3px; background:#000; margin:15px auto;"></div>
                        <p style="font-size:0.9rem; font-style:italic;">${p.subtitle}</p>
                        <div style="position:absolute; bottom:20px; left:0; width:100%; font-size:0.7rem; color:#999;">AUSGABE: ${p.date}</div>
                    </div>
                </div>`;
        }
        
        return `
            <div class="mag-page" style="width:400px; height:560px; background:#fff; color:#000; padding:40px; box-shadow:0 20px 50px rgba(0,0,0,0.5); font-family:serif;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #ddd; padding-bottom:5px; margin-bottom:20px; font-family:sans-serif; font-size:0.6rem; color:#999;">
                    <span>${club} // INTERN</span>
                    <span>SEITE ${idx+1}</span>
                </div>
                <h2 style="font-size:1.8rem; font-family:sans-serif; font-weight:900; line-height:1.1; margin-bottom:15px;">${p.headline || 'Überschrift'}</h2>
                ${p.img ? `<div style="width:100%; height:150px; background:url('${p.img}') center/cover; margin-bottom:15px;"></div>` : ''}
                <p style="font-size:0.9rem; line-height:1.6; white-space:pre-wrap;">${p.text || 'Inhalt hier einfügen...'}</p>
            </div>`;
    },

    openEditor(idx) {
        const p = window.Database.magazine.pages[idx];
        const modal = document.getElementById('mag-editor-modal');
        const content = document.getElementById('mag-editor-content');
        modal.classList.remove('hidden');

        let inputs = '';
        if (p.type === 'cover') {
            inputs = `
                <label>TITEL</label><input type="text" id="edit-mag-title" value="${p.title}" style="width:100%; background:#111; color:#fff; border:1px solid #333; padding:10px; margin-bottom:15px;">
                <label>UNTERTITEL</label><input type="text" id="edit-mag-subtitle" value="${p.subtitle}" style="width:100%; background:#111; color:#fff; border:1px solid #333; padding:10px; margin-bottom:15px;">
                <label>BILD-URL (TITELBILD)</label><input type="text" id="edit-mag-img" value="${p.img}" style="width:100%; background:#111; color:#fff; border:1px solid #333; padding:10px; margin-bottom:15px;">
            `;
        } else {
            inputs = `
                <label>ÜBERSCHRIFT</label><input type="text" id="edit-mag-headline" value="${p.headline || ''}" style="width:100%; background:#111; color:#fff; border:1px solid #333; padding:10px; margin-bottom:15px;">
                <label>BILD-URL (OPTIONAL)</label><input type="text" id="edit-mag-img" value="${p.img || ''}" style="width:100%; background:#111; color:#fff; border:1px solid #333; padding:10px; margin-bottom:15px;">
                <label>ARTIKEL-TEXT</label><textarea id="edit-mag-text" style="width:100%; height:150px; background:#111; color:#fff; border:1px solid #333; padding:10px; margin-bottom:15px;">${p.text || ''}</textarea>
            `;
        }

        content.innerHTML = `
            <h3 style="color:var(--neon-green); font-size:0.8rem; margin-bottom:20px;">SEITE ${idx+1} BEARBEITEN</h3>
            ${inputs}
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button class="pro-btn-gold" style="flex:1;" onclick="window.SektorStadionzeitung.savePage(${idx})">SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('mag-editor-modal').classList.add('hidden')">ABBRECHEN</button>
            </div>
        `;
    },

    savePage(idx) {
        const p = window.Database.magazine.pages[idx];
        if (p.type === 'cover') {
            p.title = document.getElementById('edit-mag-title').value;
            p.subtitle = document.getElementById('edit-mag-subtitle').value;
            p.img = document.getElementById('edit-mag-img').value;
        } else {
            p.headline = document.getElementById('edit-mag-headline').value;
            p.text = document.getElementById('edit-mag-text').value;
            p.img = document.getElementById('edit-mag-img').value;
        }
        window.Database.save();
        document.getElementById('mag-editor-modal').classList.add('hidden');
        this.render();
    },

    addPage() {
        window.Database.magazine.pages.push({
            type: 'article',
            headline: 'Neue Seite',
            text: 'Hier Text eingeben...',
            img: ''
        });
        window.Database.save();
        this.render();
    },

    removePage(idx) {
        if (idx === 0) return alert("Das Cover kann nicht gelöscht werden.");
        if (confirm("Seite wirklich entfernen?")) {
            window.Database.magazine.pages.splice(idx, 1);
            window.Database.save();
            this.render();
        }
    }
};
