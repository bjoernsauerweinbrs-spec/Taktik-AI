/**
 * =========================================
 * TONI 2.0 – STADIONZEITUNG MASTER MODULE
 * Strategischer Berater & Redaktions-System
 * =========================================
 */

(function() {
    window.Stadionzeitung = {
        // Der Daten-Speicher für die aktuelle Ausgabe
        draft: {
            title: "MATCHDAY REPORT",
            edition: "AUSGABE #01 // FEBRUAR 2026",
            opponent: "Gegner FC",
            date: "02.02.2026",
            stadium: "Arena of Excellence",
            blocks: [] 
        },

        // Initialisiert die Zeitung und lädt gespeicherte Daten
        init() {
            const saved = localStorage.getItem('toni2_stadionzeitung_master');
            if (saved) {
                this.draft = JSON.parse(saved);
            } else {
                this.resetToTemplate();
            }
        },

        // Erstellt das Grundmuster für eine Profi-Zeitung
        resetToTemplate() {
            this.draft.blocks = [
                { id: 1, type: 'cover', content: 'DERBY-FIEBER: HEUTE GEHT ES UM ALLES!' },
                { id: 2, type: 'editorial', content: 'Liebe Fans, Björn hier. Wir haben die Trainingswoche genutzt, um an unserer Kompaktheit zu arbeiten.' },
                { id: 3, type: 'toni-tip', content: 'STRATEGISCHE ANALYSE (CO-TRAINER TONI): Die Daten zeigen, dass der Gegner Probleme bei schnellen Umschaltmomenten hat. Wir agieren heute mutig!' },
                { id: 4, type: 'sponsor', content: 'PRÄSENTIERT VON: NEON ENERGY // DEIN TREIBSTOFF.' }
            ];
            this.save();
        },

        save() {
            localStorage.setItem('toni2_stadionzeitung_master', JSON.stringify(this.draft));
            console.log("⚽ Stadionzeitung: Entwurf gesichert.");
        },

        // Toni fügt strategische Blöcke hinzu oder löscht sie
        addBlock(type) {
            let newContent = "Klicken zum Bearbeiten...";
            if (type === 'toni-tip') {
                newContent = "TONI'S TAKTIK-CHECK: " + (window.arena.mode === 'funinho' ? "Funinho-Modus aktiv. Wir provozieren viele 3vs3 Situationen." : "Standard-Modus. Wir halten die Abstände in der Kette bei 10 Metern.");
            }
            this.draft.blocks.push({ id: Date.now(), type: type, content: newContent });
            this.render();
            this.save();
        },

        removeBlock(id) {
            this.draft.blocks = this.draft.blocks.filter(b => b.id !== id);
            this.render();
            this.save();
        },

        updateBlockContent(id, newText) {
            const block = this.draft.blocks.find(b => b.id === id);
            if (block) {
                block.content = newText;
                this.save();
            }
        },

        updateMeta(field, value) {
            this.draft[field] = value;
            this.save();
        },

        // Das visuelle Finish der Zeitung
        render() {
            const target = document.getElementById('sub-content');
            if (!target) return;

            target.innerHTML = `
                <div class="newspaper-editor animate-fadeIn">
                    <div class="editor-top-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                        <h2 style="color:var(--accent-orange); margin:0;">📰 REDAKTION: STADIONZEITUNG</h2>
                        <div style="display:flex; gap:10px;">
                            <button class="tool-btn" onclick="Stadionzeitung.addBlock('text')">+ TEXT</button>
                            <button class="tool-btn" onclick="Stadionzeitung.addBlock('toni-tip')" style="color:var(--data-cyan);">+ TONI TAKTIK</button>
                            <button class="tool-btn" onclick="Stadionzeitung.exportPDF()" style="background:var(--success-green); color:white; border:none;">💾 PDF EXPORT</button>
                        </div>
                    </div>

                    <div class="newspaper-canvas" id="print-zone">
                        <header class="mag-header" style="border-bottom: 4px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 30px;">
                            <h1 contenteditable="true" onblur="Stadionzeitung.updateMeta('title', this.innerText)" style="font-size:48px; font-weight:900;">${this.draft.title}</h1>
                            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:12px; margin-top:10px;">
                                <span contenteditable="true" onblur="Stadionzeitung.updateMeta('edition', this.innerText)">${this.draft.edition}</span>
                                <span>${this.draft.date} // ${this.draft.stadium}</span>
                            </div>
                        </header>

                        <div class="mag-body">
                            ${this.draft.blocks.map(block => `
                                <div class="page-block ${block.type}-type">
                                    <div class="delete-btn" onclick="Stadionzeitung.removeBlock(${block.id})">×</div>
                                    <div contenteditable="true" class="edit-area" onblur="Stadionzeitung.updateBlockContent(${block.id}, this.innerText)">
                                        ${block.content}
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <footer style="margin-top:50px; border-top:1px solid #ddd; padding-top:15px; font-size:10px; text-align:center; color:#888;">
                            TONI 2.0 // BJÖRN'S MANAGEMENT SYSTEM // OFFIZIELLES MATCHDAY-PROGRAMM
                        </footer>
                    </div>
                </div>
            `;
        },

        // Exportiert die Zeitung in den lokalen Ordner
        exportPDF() {
            if (window.toniSpeak) toniSpeak("Björn, die Stadionzeitung wird nun als PDF in deinen lokalen Dokumenten-Ordner exportiert.");
            window.print();
        }
    };

    // Auto-Init beim Laden
    window.Stadionzeitung.init();
})();
