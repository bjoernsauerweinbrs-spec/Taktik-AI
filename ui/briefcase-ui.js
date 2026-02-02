window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },
    switchSektor(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        const target = document.getElementById('active-content');
        if (sektor === 'sport') target.innerHTML = "<h3>👟 Sporttasche</h3><p>Kader und Trainingsbuch sind bereit.</p>";
        if (sektor === 'orga') target.innerHTML = "<h3>🏢 Geschäftszimmer</h3><p>Redaktions-System für die Stadionzeitung läuft.</p>";
    },
    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
