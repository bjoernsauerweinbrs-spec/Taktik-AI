/* ==========================================================
   PRESS CENTER | 3D BRAND & MEDIA ENGINE
   ========================================================== */

const newspaper = {
    open: function() {
        document.getElementById('press-center').classList.add('active');
        this.render();
    },

    render: function() {
        const container = document.getElementById('magazine-preview-container');
        const players = eliteStore.players;
        const topPlayer = players.reduce((prev, current) => (prev.rating > current.rating) ? prev : current);

        container.innerHTML = `
            <div class="newspaper-elite-view">
                <div class="magazine-3d-wrap">
                    <div class="magazine-page-3d main-cover">
                        <div class="press-header">
                            <span class="edition">EDITION 2026 // FEB</span>
                            <h1>ELITE ANALYST</h1>
                        </div>
                        <div class="cover-feature">
                            <div class="feature-img" style="background: url('${topPlayer.img || 'https://via.placeholder.com/400'}') center/cover;"></div>
                            <div class="feature-text">
                                <h2>ASSET FOCUS: ${topPlayer.name}</h2>
                                <p>Performance Index: ${topPlayer.rating} OVR</p>
                                <p>Market Value: ${(topPlayer.rating * 1.2).toFixed(1)}M €</p>
                            </div>
                        </div>
                        <div class="press-footer">
                            <span>REICHWEITE: 1.2M</span>
                            <span>SPONSOR-ROI: +18.4%</span>
                        </div>
                    </div>
                </div>
                <div class="press-actions">
                    <button class="elite-btn-outline" onclick="window.print()">GENERATE PDF FOR BOARD</button>
                    <button class="elite-btn-outline" onclick="newspaper.close()">BACK TO COMMAND</button>
                </div>
            </div>
        `;
    },

    close: function() {
        showModule('vr-center');
    }
};
