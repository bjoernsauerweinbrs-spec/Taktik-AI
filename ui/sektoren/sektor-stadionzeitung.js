/**
 * TONI 2.0 - SEKTOR STADIONZEITUNG (ELITE PUBLISHING HUB)
 * Fokus: A4-Druck, Automatischer Taktik-Sync & Sponsoring
 * Status: ETAPPE 5.2 - PRINT ENGINE VERSIEGELT
 */
window.SektorStadionzeitung = {
    
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;
        
        // Initialisierung des Magazins mit Profi-Struktur
        if (!window.Database.magazine) {
            window.Database.magazine = {
                pages: [
                    { type: 'cover', title: 'MATCHDAY', subtitle: 'Offizielle Stadionzeitung', date: 'FEBRUAR 2026', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800' },
                    { type: 'lineup', headline: 'DIE STARTELF', formation: '4-4-2', coachNode: 'Analysiert von TONI AI' },
                    { type: 'article', headline: 'Wort des Trainers', text: 'Wir sind bereit für den nächsten Sieg...', img: '' },
                    { type: 'sponsors', headline: 'UNSERE PARTNER' }
                ]
            };
        }
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const magazine = window.Database.magazine;
        const team = window.currentTeamContext || "Senioren";

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 320px; gap: 25px; height: 100%;">
                
                <div style="overflow-y: auto; padding: 25px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px solid rgba(57, 255, 20, 0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                        <div>
                            <h2 style="color:var(--neon-green); font-family:'Orbitron'; font-size:1.1rem; margin:0; letter-spacing:2px;">STADIONZEITUNG: ${team.toUpperCase()}</h2>
                            <span style="color:#666; font-size:0.6rem;">A4 PRINT ENGINE AKTIV</span>
                        </div>
                        <button class="pro-btn-gold" onclick="window.SektorStadionzeitung.triggerPrint()" style="font-size:0.7rem; padding:10px 20px;">
                            <i class="fas fa-print"></i> JETZT DRUCKEN (A4)
                        </button>
                    </div>

                    <div id="magazine-preview-container" style="display: flex; flex-direction: column; gap: 50px; align-items: center; padding-bottom:100px;">
                        ${magazine.pages.map((p, idx) => this.renderPageHTML(p, idx)).join('')}
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border-left: 1px solid #222; padding: 25px; display:flex; flex-direction:column; border-radius:15px;">
                    <h3 style="color:#fff; font-family:'Orbitron'; font-size:0.75rem; margin-bottom:25px; letter-spacing:1px; border-bottom:1px solid #333; padding-bottom:10px;">REDAKTION-CENTER</h3>
                    
                    <button class="tactic-btn" style="width:100%; margin-bottom:15px; border-color:var(--neon-green); color:var(--neon-green); font-size:0.7rem;" onclick="window.SektorStadionzeitung.addPage()">
                        <i class="fas fa-plus-circle"></i> NEUE SEITE EINFÜGEN
                    </button>
                    
                    <div style="flex:1; overflow-y:auto;">
                        <p style="font-size:0.55rem; color:#666; margin-bottom:15px; letter-spacing:1px;">LAYOUT-STRUKTUR</p>
                        ${magazine.pages.map((p, idx) => `
                            <div style="background:#05080F; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #222; transition:0.3s;">
                                <div style="display:flex; flex-direction:column;">
                                    <span style="font-size:0.75rem; color:#fff; font-family:'Orbitron';">S.${idx+1} ${p.type.toUpperCase()}</span>
                                    <span style="font-size:0.5rem; color:#444;">${p.title || p.headline || 'Inhalt'}</span>
                                </div>
                                <div style="display:flex; gap:12px;">
                                    <i class="fas fa-edit" onclick="window.SektorStadionzeitung.openEditor(${idx})" style="color:var(--data-cyan); cursor:pointer; font-size:0.9rem;"></i>
                                    <i class="fas fa-trash" onclick="window.SektorStadionzeitung.removePage(${idx})" style="color:#ff3131; cursor:pointer; font-size:0.9rem;"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div id="mag-editor-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#05080F; border:2px solid var(--neon-green); padding:35px; border-radius:15px; z-index:2000000; width:550px; box-shadow:0 0 100px #000; color:#fff; font-family:'Orbitron';">
                <div id="mag-editor-content"></div>
            </div>
        `;
    },

    renderPageHTML(p, idx) {
        const club = window.coachInfo?.verein || "UNSER VEREIN";
        const baseStyle = "width:210mm; min-height:297mm; background:#fff; color:#000; padding:20mm; box-shadow:0 10px 30px rgba(0,0,0,0.5); position:relative; margin-bottom:20px; box-sizing:border-box; font-family:'Inter', sans-serif;";
        
        if (p.type === 'cover') {
            return `
                <div class="print-page" style="${baseStyle} padding:0; display:flex; flex-direction:column;">
                    <div style="height:65%; background:url('${p.img}') center/cover;"></div>
                    <div style="flex:1; padding:40px; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                        <div style="font-size:1rem; letter-spacing:6px; color:#666; font-family:'Orbitron';">${club}</div>
                        <h1 style="font-size:4rem; margin:20px 0; font-weight:900; font-family:'Orbitron'; line-height:1;">${p.title}</h1>
                        <div style="width:80px; height:5px; background:#000; margin:25px auto;"></div>
                        <p style="font-size:1.2rem; font-style:italic;">${p.subtitle}</p>
                        <div style="margin-top:auto; font-size:0.9rem; font-family:'Orbitron'; color:#999; border-top:1px solid #eee; width:100%; padding-top:20px;">
                            ${p.date} // POWERED BY TONI AI
                        </div>
                    </div>
                </div>`;
        }

        if (p.type === 'lineup') {
            return `
                <div class="print-page" style="${baseStyle}">
                    <h2 style="font-size:2.5rem; font-family:'Orbitron'; font-weight:900; border-bottom:4px solid #000; padding-bottom:10px; margin-bottom:30px;">${p.headline}</h2>
                    <div style="width:100%; height:400px; background:#0a150a; border-radius:10px; border:2px solid #000; position:relative; display:flex; justify-content:center; align-items:center;">
                        <div style="color:#39FF14; font-family:'Orbitron'; font-size:0.8rem; text-align:center;">
                            <i class="fas fa-microchip" style="font-size:2rem; margin-bottom:10px;"></i><br>
                            TAKTIK-DATEN WERDEN BEIM DRUCK SYNCHRONISIERT
                        </div>
                    </div>
                    <div style="margin-top:30px; padding:20px; background:#f9f9f9; border-left:5px solid #000;">
                        <h4 style="margin:0 0 10px 0; font-family:'Orbitron';">TONI'S EDITORIAL:</h4>
                        <p style="font-style:italic; font-size:0.95rem; line-height:1.6;">"Coach ${window.coachInfo?.name || 'Coach'}, basierend auf der Biometrie empfehle ich heute ein extrem hohes Pressing. Die Aufstellung ist optimal für Umschaltmomente versiegelt."</p>
                    </div>
                </div>`;
        }

        if (p.type === 'sponsors') {
            return `
                <div class="print-page" style="${baseStyle}">
                    <h2 style="font-size:2.5rem; font-family:'Orbitron'; font-weight:900; margin-bottom:40px;">${p.headline}</h2>
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:30px; text-align:center;">
                        <div style="height:120px; border:1px dashed #ccc; display:flex; align-items:center; justify-content:center; color:#ccc;">LOGO 1</div>
                        <div style="height:120px; border:1px dashed #ccc; display:flex; align-items:center; justify-content:center; color:#ccc;">LOGO 2</div>
                        <div style="height:120px; border:1px dashed #ccc; display:flex; align-items:center; justify-content:center; color:#ccc;">LOGO 3</div>
                    </div>
                    <div style="margin-top:100px; text-align:center; font-size:0.8rem; color:#999;">VIELEN DANK FÜR DIE UNTERSTÜTZUNG!</div>
                </div>`;
        }

        return `
            <div class="print-page" style="${baseStyle}">
                <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:30px; font-family:'Orbitron'; font-size:0.8rem;">
                    <span>${club} // OFFICIAL MATCH REPORT</span>
                    <span>SEITE ${idx+1}</span>
                </div>
                <h2 style="font-size:2.2rem; font-family:'Orbitron'; font-weight:900; line-height:1.1; margin-bottom:25px;">${p.headline || 'BERICHT'}</h2>
                ${p.img ? `<img src="${p.img}" style="width:100%; border-radius:5px; margin-bottom:25px;">` : ''}
                <p style="font-size:1.1rem; line-height:1.8; white-space:pre-wrap; color:#333;">${p.text || 'Inhalt hier einfügen...'}</p>
            </div>`;
    },

    openEditor(idx) {
        const p = window.Database.magazine.pages[idx];
        const modal = document.getElementById('mag-editor-modal');
        const content = document.getElementById('mag-editor-content');
        modal.classList.remove('hidden');

        let inputs = `<label style="font-size:0.5rem; color:#666;">SEITENTYP: ${p.type.toUpperCase()}</label><br><br>`;
        
        if (p.type === 'cover') {
            inputs += `
                <label>MAGAZIN TITEL</label><input type="text" id="edit-mag-title" value="${p.title}" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; margin-bottom:20px; font-family:'Orbitron';">
                <label>UNTERTITEL</label><input type="text" id="edit-mag-subtitle" value="${p.subtitle}" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; margin-bottom:20px;">
                <label>TITELBILD (URL)</label><input type="text" id="edit-mag-img" value="${p.img}" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; margin-bottom:20px;">
            `;
        } else {
            inputs += `
                <label>ÜBERSCHRIFT</label><input type="text" id="edit-mag-headline" value="${p.headline || ''}" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; margin-bottom:20px; font-family:'Orbitron';">
                <label>BILD URL (OPTIONAL)</label><input type="text" id="edit-mag-img" value="${p.img || ''}" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; margin-bottom:20px;">
                <label>TEXTINHALT</label><textarea id="edit-mag-text" style="width:100%; height:180px; background:#000; color:#fff; border:1px solid #333; padding:12px; margin-bottom:20px; font-family:sans-serif;">${p.text || ''}</textarea>
            `;
        }

        content.innerHTML = `
            <h3 style="color:var(--neon-green); font-size:0.9rem; margin-bottom:25px; letter-spacing:1px;">REDAKTION S.${idx+1}</h3>
            ${inputs}
            <div style="display:flex; gap:15px; margin-top:10px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorStadionzeitung.savePage(${idx})">SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('mag-editor-modal').classList.add('hidden')">STOP</button>
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
        if(window.ToniVoice) window.ToniVoice.speak("Redaktionsänderungen gespeichert.");
    },

    addPage() {
        window.Database.magazine.pages.push({
            type: 'article',
            headline: 'NEUE STORY',
            text: 'Hier den Inhalt für die Jungs eingeben...',
            img: ''
        });
        window.Database.save();
        this.render();
    },

    removePage(idx) {
        if (idx === 0) return alert("Das Cover ist Pflicht!");
        if (confirm("Soll diese Seite wirklich aus der Ausgabe entfernt werden?")) {
            window.Database.magazine.pages.splice(idx, 1);
            window.Database.save();
            this.render();
        }
    },

    triggerPrint() {
        if(window.ToniVoice) window.ToniVoice.speak("Druckauftrag wird vorbereitet. Bitte A4-Papier einlegen.");
        
        const printContent = document.getElementById('magazine-preview-container').innerHTML;
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>TONI 2.0 // STADIONZEITUNG PRINT</title>
                    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Inter:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
                    <style>
                        body { margin: 0; padding: 0; background: #fff; }
                        .print-page { page-break-after: always; margin: 0 auto !important; box-shadow: none !important; }
                        @media print {
                            @page { size: A4; margin: 0; }
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>${printContent}</body>
                <script>
                    setTimeout(() => { window.print(); window.close(); }, 500);
                </script>
            </html>
        `);
        printWindow.document.close();
    }
};
