/**
 * =========================================
 * TONI 2.0 – STADIONZEITUNG MASTER ENGINE
 * Strategischer Berater & Layout-Generator
 * =========================================
 */

(function() {
    window.Stadionzeitung = {
        // Der lokale Speicher für die aktuelle Ausgabe
        draft: {
            title: "MATCHDAY REPORT",
            edition: "Saison 2025/26 - Ausgabe #12",
            opponent: "VfB Taktik-Elite",
            date: "02. Februar 2026",
            stadium: "Arena of Excellence",
            blocks: [] // Hier werden die Blöcke gespeichert
        },

        init() {
            const saved = localStorage.getItem('toni2_stadionzeitung');
            if (saved) {
                this.draft = JSON.parse(saved);
            } else {
                this.createInitialTemplate();
            }
        },

        // Erstellt das Muster basierend auf Profi-Recherche
        createInitialTemplate() {
            this.draft.blocks = [
                { id: 1, type: 'cover', content: 'FOKUS AUF DEN DERBYSIEG' },
                { id: 2, type: 'editorial', content: 'Liebe Fans, heute zählen nur die drei Punkte. Wir haben hart gearbeitet.' },
                { id: 3, type: 'tactics', content: 'TONI ANALYSE: Der Gegner presst hoch. Wir kontern heute über die Halbräume.' },
                { id: 4, type: 'sponsor', content: 'Präsentiert von NeonEnergy - Dein Treibstoff für den Sieg.' }
            ];
            this.save();
        },

        save() {
            localStorage.setItem('toni2_stadionzeitung', JSON.stringify(this.draft));
            if (window.toniSpeak) toniSpeak("Björn, das Redaktions-System hat deine Änderungen im Trainer-Ordner gesichert.");
        },

        addBlock(type) {
            let content = "Neuer Inhalt...";
            if (type === 'tactics') {
                content = "STRATEGISCHER RAT (TONI): " + (window.arena.mode === 'funinho' ? "Funinho-Modus aktiv. Fokus auf 3vs3 Spielintelligenz." : "Standard-Formation. Kompakte Kette halten.");
            }
            this.draft.blocks.push({ id: Date.now(), type: type, content: content });
            this.render();
            this.save();
        },

        removeBlock(id) {
            this.draft.blocks = this.draft.blocks.filter(b => b.id !== id);
            this.render();
            this.save();
        },

        updateBlock(id, newContent) {
            const block = this.draft.blocks.find(b => b.id === id);
            if (block) {
                block.content = newContent;
                localStorage.setItem('toni2_stadionzeitung', JSON.stringify(this.draft));
            }
        },

        updateMeta(field, value) {
            this.draft[field] = value;
            this.save();
        },

        render() {
            const target = document.getElementById('sub-content');
            if (!target) return;

            target.innerHTML = `
                <div class="newspaper-editor animate-fadeIn">
                    <div class="editor-top-bar">
                        <h2 style="color:var(--accent-orange); margin:0;">📰 REDAKTION: STADIONZEITUNG</h2>
                        <div class="editor-actions">
                            <button onclick="Stadionzeitung.addBlock('text')" class="tool-btn">+ TEXT</button>
                            <button onclick="Stadionzeitung.addBlock('tactics')" class="tool-btn" style="color:var(--data-cyan);">+ TONI RAT</button>
                            <button onclick="Stadionzeitung.exportPDF()" class="tool-btn" style="background:var(--success-green); color:white;">💾 PDF EXPORT</button>
                        </div>
                    </div>

                    <div class="newspaper-canvas" id="printable-area">
                        <header class="mag-header">
                            <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:4px solid #1a1a1a; padding-bottom:10px;">
                                <div>
                                    <h1 contenteditable="true" onblur="Stadionzeitung.updateMeta('title', this.innerText)">${this.draft.title}</h1>
                                    <p contenteditable="true" onblur="Stadionzeitung.updateMeta('edition', this.innerText)">${this.draft.edition}</p>
                                </div>
                                <div style="text-align:right; font-size:12px; font-weight:bold;">
                                    ${this.draft.date} // ${this.draft.stadium}
                                </div>
                            </div>
                        </header>

                        <div class="mag-content-grid">
                            ${this.draft.blocks.map(block => `
                                <div class="page-block ${block.type}-type">
                                    <span class="delete-btn" onclick="Stadionzeitung.removeBlock(${block.id})">×</span>
                                    <div contenteditable="true" class="edit-area" onblur="Stadionzeitung.updateBlock(${block.id}, this.innerText)">
                                        ${block.content}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <footer class="mag-footer">
                            OFFIZIELLES DOKUMENT // BJÖRN COACHING TONI 2.0
                        </footer>
                    </div>
                </div>
            `;
        },

        exportPDF() {
            if (window.toniSpeak) toniSpeak("Björn, ich bereite den PDF-Export für deinen lokalen Rechner vor. Die Stadionzeitung wird nun gedruckt.");
            window.print();
        }
    };
})();
