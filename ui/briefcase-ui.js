(function() {
    window.BriefcaseUI = {
        init() { /* Kader laden */ },
        toggle() { document.getElementById('briefcase-overlay').classList.toggle('hidden'); },
        switchSektor(s) {
            document.getElementById('briefcase-nav').classList.add('hidden');
            document.getElementById('briefcase-content').classList.remove('hidden');
            const target = document.getElementById('active-content');
            if(s === 'sport') {
                target.innerHTML = `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px;">
                    <div class="nav-card">📋 Kader & Rating</div>
                    <div class="nav-card">📖 Trainingsbuch</div>
                    <div class="nav-card">🏟️ Spieltagsplanung</div>
                </div>`;
            } else if(s === 'orga') {
                target.innerHTML = `<div class="nav-card" onclick="Stadionzeitung.open()">📰 Stadionzeitung Editor</div>`;
            }
        }
    };
})();
