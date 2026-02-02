/**
 * TONI 2.0 – STADIONZEITUNG MODUL
 * Strategischer Berater & PDF-Generator
 */
(function() {
    window.Stadionzeitung = {
        // Speicher für die aktuelle Ausgabe
        currentDraft: {
            title: "MATCHDAY REPORT",
            opponent: "Gegner FC",
            date: "02. Februar 2026",
            blocks: [
                { id: 1, type: 'header', content: 'WILLKOMMEN IM STADION' },
                { id: 2, type: 'toni-tip', content: 'Taktik-Vorschau: Fokus auf schnelles Umschaltspiel.' }
            ]
        },

        init() {
            // Lade gespeicherten Stand aus dem lokalen Speicher (Trainer-Ordner Simulation)
            const saved = localStorage.getItem('toni2_stadionzeitung');
            if (saved) this.currentDraft = JSON.parse(saved);
        },

        save() {
            localStorage.setItem('toni2_stadionzeitung', JSON.stringify(this.currentDraft));
            if (window.toniSpeak) toniSpeak("Björn, die Änderungen sind sicher im System hinterlegt.");
        },

        addBlock(type) {
            let newBlock = { id: Date.now() };
            if (type === 'tactics') {
                newBlock.content = "TONI'S ANALYSE: " + (arena.mode === 'funinho' ? "Vier Tore für maximale Spielintelligenz." : "Kompakte Defensive ist heute Pflicht.");
            } else {
                newBlock.content = "Neuer Bereich... (Hier klicken zum Bearbeiten)";
            }
            this.currentDraft.blocks.push(newBlock);
            this.render();
            this.save();
        },

        removeBlock(id) {
            this.currentDraft.blocks = this.currentDraft.blocks.filter(b => b.id !== id);
            this.render();
            this.save();
        },

        render() {
            const target = document.getElementById('sub-content');
            if (!target) return;

            target.innerHTML = `
                <div class="newspaper-editor">
                    <div class="editor-header">
                        <h2 contenteditable="true" onblur="Stadionzeitung.updateTitle(this.innerText)">${this.currentDraft.title}</h2>
                        <p>Gegner: <span contenteditable="true">${this.currentDraft.opponent}</span> // ${this.currentDraft.date}</p>
                    </div>

                    <div class="newspaper-canvas" id="newspaper-pages">
                        ${this.currentDraft.blocks.map(block => `
                            <div class="page-block">
                                <span class="delete-btn" onclick="Stadionzeitung.removeBlock(${block.id})">×</span>
                                <div contenteditable="true" class="edit-area">${block.content}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="editor-controls">
                        <button class="tool-btn" onclick="Stadionzeitung.addBlock('text')">+ TEXT</button>
                        <button class="tool-btn" onclick="Stadionzeitung.addBlock('tactics')" style="color:#00D1FF;">+ TONI'S TAKTIK</button>
                        <button class="tool-btn" onclick="Stadionzeitung.exportPDF()" style="background:#28C76F; color:white;">💾 PDF SPEICHERN</button>
                    </div>
                </div>
            `;
        },

        updateTitle(val) { this.currentDraft.title = val; this.save(); },

        exportPDF() {
            if (window.toniSpeak) toniSpeak("Ich bereite das Dokument für deinen lokalen Ordner vor, Björn. Weltklasse-Design wird exportiert.");
            // Simulation des PDF Exports für den Browser-Download
            window.print(); 
        }
    };
})();
