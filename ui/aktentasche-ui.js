window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI initialized");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            overlay.style.display = 'flex';
            this.renderMainGrid();
        } else {
            overlay.style.display = 'none';
        }
    },

    renderMainGrid() {
        const content = document.getElementById('active-content');
        content.innerHTML = `
            <h1 style="color: var(--neon-green); text-align:center; letter-spacing:5px;">ZENTRALE</h1>
            <div class="management-grid">
                <div class="mgmt-card" onclick="window.SektorKabine.open()">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Spieler & FIFA Karten</p>
                </div>
                <div class="mgmt-card" onclick="window.SektorAnalyse.open()">
                    <div class="card-header"><i class="fas fa-heartbeat"></i> ANALYSE</div>
                    <p>Vitals & Fitness</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-briefcase"></i> BUSINESS</div>
                    <p>Management</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-print"></i> STADION</div>
                    <p>Nino Print Engine</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>Equipment</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-video"></i> SKILLS</div>
                    <p>Tutorials</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-search"></i> SCOUTING</div>
                    <p>Suche</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formationen</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-cog"></i> SETTINGS</div>
                    <p>Ollama Config</p>
                </div>
            </div>
            <button class="pro-btn-gold" onclick="window.BriefcaseUI.toggle()" style="margin-top:20px; width:auto; padding: 10px 40px;">X SCHLIESSEN</button>
        `;
    }
};
