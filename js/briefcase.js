window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            console.log("Briefcase toggled"); [cite: 2026-02-02]
        }
    },
    switchSektor(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        const target = document.getElementById('active-content');
        if (sektor === 'sport') target.innerHTML = "<h3>👟 Sporttasche</h3><p>Kader wird geladen...</p>";
        if (sektor === 'orga') target.innerHTML = "<h3>🏢 Geschäftszimmer</h3><p>Redaktion bereit.</p>";
    },
    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
