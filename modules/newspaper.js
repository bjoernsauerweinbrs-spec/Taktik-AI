/* ==========================================================
   PRESS CENTER | 3D BRAND & PRINT ENGINE
   ========================================================== */

const newspaper = {
    open: function() {
        document.getElementById('press-center').classList.add('active');
        this.render();
    },

    render: function() {
        const container = document.getElementById('magazine-preview-container');
        if (!container) return;

        const players = typeof eliteStore !== 'undefined' ? eliteStore.players : [];
        const topPlayer = players.length > 0 ? players.reduce((prev, curr) => (prev.rating > curr.rating) ? prev : curr) : {name: "Elite Player", rating: 99};

        container.innerHTML = `
            <div class="newspaper-layout">
                <div class="magazine-3d-preview">
                    <div class="magazine-page cover">
                        <div class="mag-header">
                            <span class="mag-edition">EXKLUSIV // FEB 2026</span>
                            <h1>ELITE ANALYST</h1>
                        </div>
                        <div class="mag-feature">
                            <div class="mag-img-placeholder">
                                <span class="ovr-badge">${topPlayer.rating}</span>
                            </div>
                            <div class="mag-text">
                                <h2>ASSET FOCUS: ${topPlayer.name.toUpperCase()}</h2>
                                <p>Der Algorithmus bestätigt: Maximale Effizienz im 3D-Center. xG-Werte erreichen Saison-Rekord.</p>
                            </div>
                        </div>
                        <div class="mag-footer">
                            <span>Sponsoring ROI: +22.4%</span>
                            <span>Global Reach: 1.4M</span>
                        </div>
                    </div>
                </div>

                <div class="press-controls">
                    <button class="elite-btn-outline" onclick="window.print()">GENERATE PDF FOR BOARD</button>
                    <button class="elite-btn-outline" onclick="newspaper.close()">TERMINAL CLOSE</button>
                </div>
            </div>
        `;
    },

    close: function() {
        const sections = document.querySelectorAll('.module-section');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('vr-center').classList.add('active');
    }
};
