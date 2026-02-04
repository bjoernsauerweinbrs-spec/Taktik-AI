/**
 * TONI 2.0 - SEKTOR STADIONHEFT & TRAINING
 * Erstellung von druckfähigen DIN A5 Dokumenten im WYSIWYG-Editor.
 */

window.SektorTemplates = {
    pages: [
        { title: "COVER / MATCHDAY", content: "", type: "cover" },
        { title: "DER KADER", content: "", type: "squad" },
        { title: "TRAINER-WORT", content: "Herzlich willkommen zum heutigen Spiel...", type: "text" }
    ],

    render: function() {
        const club = BriefcaseUI.clubData;
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h3 style="color:#fff; margin:0;">STADIONZEITUNG & TRAINING</h3>
                        <p style="font-size:0.7rem; color:var(--text-dim);">Format: DIN A5 Hochkant | Druckoptimiert</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="tactic-btn" style="width:auto; padding:8px 15px;" onclick="window.print()">
                            <i class="fas fa-print"></i> DRUCKEN / PDF
                        </button>
                        <button class="login-btn" style="width:auto; padding:8px 15px; background:var(--data-cyan); color:#000;" onclick="SektorTemplates.autoFill()">
                            <i class="fas fa-magic"></i> TONI AUTO-FILL
                        </button>
                    </div>
                </div>

                <div class="magazine-view">
                    ${this.pages.map((page, index) => this.renderPage(page, index)).join('')}
                </div>
            </div>
        `;
    },

    renderPage: function(page, index) {
        return `
            <div class="mag-page" id="page-${index}">
                <div style="border-bottom: 2px solid #000; padding-bottom:10px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:900; font-size:0.8rem; letter-spacing:2px;">${page.title}</span>
                    <span style="font-size:0.6rem;">SEITE ${index + 1}</span>
                </div>
                
                <textarea class="mag-area" 
                    id="page-content-${index}" 
                    oninput="SektorTemplates.updateContent(${index}, this.value)"
                    placeholder="Inhalt hier eingeben...">${page.content}</textarea>
                
                <div style="margin-top:auto; font-size:0.5rem; text-align:center; border-top:1px solid #eee; pt-5px;">
                    Powered by Toni 2.0 - Coach Björn Edition
                </div>
            </div>
        `;
    },

    updateContent: function(index, val) {
        this.pages[index].content = val;
    },

    autoFill: function() {
        if(window.ToniTTS) ToniTTS.speak("Ich erstelle das Layout basierend auf deinem aktuellen Kader und den Club-Daten.", "warm");
        
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const club = BriefcaseUI.clubData;

        // Seite 0: Cover
        this.pages[0].content = `\n\n\n\n\n\n\n\nHEUTE IM STADION:\n${club.name.toUpperCase()}\nvs\nGASTMANNSCHAFT\n\n-------------------\nLiga: ${club.league}`;
        
        // Seite 1: Kader
        let squadList = players.map(p => `#${p.number} ${p.name} (${p.pos})`).join('\n');
        this.pages[1].content = `UNSER KADER FÜR HEUTE:\n\n${squadList}`;

        this.render(); // UI Refresh
    }
};
