/* ==========================================================
   PRESS CENTER | 3D PREVIEW & PRINT ENGINE
   ========================================================== */

const newspaper = {
    currentPage: 1,
    maxPages: 4,

    open: function() {
        document.getElementById('newspaper-overlay').style.display = 'flex';
        this.renderPreview();
    },

    close: function() {
        document.getElementById('newspaper-overlay').style.display = 'none';
    },

    /**
     * 3D PREVIEW ENGINE
     */
    renderPreview: function() {
        const container = document.getElementById('printable-newspaper');
        const mgmtData = mgmt.data;
        const players = eliteStore.players;

        container.innerHTML = `
            <div class="magazine-spread">
                <div class="magazine-page left">
                    <div class="page-content">
                        <h4>Premium Partner</h4>
                        <div class="sponsor-grid-press">
                            ${mgmtData.sponsors.map(s => `<div class="sponsor-box"><b>${s.name}</b><br><small>ROI: ${s.roi}%</small></div>`).join('')}
                        </div>
                        <div class="page-footer">Page 4 (Back)</div>
                    </div>
                </div>

                <div class="magazine-page right">
                    <div class="page-content cover">
                        <h1 style="font-size:38px; border-bottom:5px solid black;">${mgmtData.clubName}</h1>
                        <p style="font-weight:900; margin-top:10px;">ELITE PERFORMANCE ANALYTICS</p>
                        <div style="height:200px; background:#ddd; margin:20px 0; border:2px solid black; display:flex; align-items:center; justify-content:center; font-style:italic;">
                            [ MATCH ANALYSIS VISUAL ]
                        </div>
                        <h2>TOP PLAYER: ${players[0].name}</h2>
                        <p style="font-size:12px;">Der Elite-Analyse-Algorithmus stuft das heutige Training als bahnbrechend ein.</p>
                        <div class="page-footer">Page 1 (Cover)</div>
                    </div>
                </div>
            </div>
            
            <div class="press-actions" style="text-align:center; margin-top:30px;">
                <button class="control-btn" onclick="window.print()">PRINT SELECTION (A4 Landscape)</button>
            </div>
        `;
    }
};
