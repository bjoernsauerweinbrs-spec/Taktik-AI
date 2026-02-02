(function() {
    window.Stadionzeitung = {
        draft: { title: "MATCHDAY REPORT", blocks: [] },
        
        init() {
            const saved = localStorage.getItem('toni2_zeitung');
            if(saved) this.draft = JSON.parse(saved);
            else this.loadMuster();
        },

        loadMuster() {
            this.draft.blocks = [
                { id: 1, type: 'h1', content: 'FOKUS AUF DEN SIEG' },
                { id: 2, type: 'p', content: 'Liebe Fans, Björn hier. Heute zählt nur die Einstellung auf dem Platz...' },
                { id: 3, type: 'toni', content: 'TONI ANALYSE: Der Gegner schwächelt bei Kontern. Wir nutzen heute den Speed!' }
            ];
            this.save();
        },

        save() { localStorage.setItem('toni2_zeitung', JSON.stringify(this.draft)); },

        toggleControls() {
            document.getElementById('editor-btns').classList.toggle('controls-collapsed');
            const btn = document.getElementById('toggle-fold-btn');
            btn.innerText = btn.innerText === "PLATZ SCHAFFEN" ? "MENÜ ZEIGEN" : "PLATZ SCHAFFEN";
        },

        render() {
            const t = document.getElementById('sub-content');
            t.innerHTML = `
                <div class="newspaper-editor">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; width:100%; max-width:850px; margin: 0 auto 20px auto;">
                        <button onclick="closeSub()" class="tool-btn">← ZURÜCK</button>
                        <button id="toggle-fold-btn" onclick="Stadionzeitung.toggleControls()" class="tool-btn" style="color:var(--data-cyan);">PLATZ SCHAFFEN</button>
                        <button onclick="window.print()" class="tool-btn" style="background:var(--success-green); color:white; border:none;">💾 PDF EXPORT</button>
                    </div>

                    <div id="editor-btns" class="editor-controls" style="justify-content:center;">
                        <button onclick="Stadionzeitung.addBlock('p')" class="tool-btn">+ TEXT</button>
                        <button onclick="Stadionzeitung.addBlock('toni')" class="tool-btn">+ TONI RAT</button>
                    </div>

                    <div class="newspaper-canvas">
                        <h1 contenteditable="true" onblur="Stadionzeitung.updateTitle(this.innerText)" style="font-size:48px; border-bottom:4px solid #000; margin-bottom:20px;">${this.draft.title}</h1>
                        <div id="blocks-container">
                            ${this.draft.blocks.map(b => `
                                <div class="page-block">
                                    <div contenteditable="true" class="edit-area" onblur="Stadionzeitung.updateBlock(${b.id}, this.innerText)">${b.content}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
        },

        updateTitle(txt) { this.draft.title = txt; this.save(); },
        updateBlock(id, txt) { 
            const b = this.draft.blocks.find(x => x.id === id);
            if(b) b.content = txt;
            this.save();
        },
        addBlock(type) {
            this.draft.blocks.push({ id: Date.now(), type: type, content: "Neuer Inhalt..." });
            this.render();
            this.save();
        }
    };
    window.Stadionzeitung.init();
})();
