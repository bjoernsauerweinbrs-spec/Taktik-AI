window.SektorZeitung = {
    render() {
        const g = document.getElementById('briefcase-content');
        const d = window.ToniDatabase.management;
        
        g.innerHTML = `
            <div class="paper-page">
                <header style="border-bottom:4px solid #111; padding-bottom:20px; text-align:center; margin-bottom:40px;">
                    <h1 style="font-family:'Orbitron'; font-size:2.5rem; letter-spacing:-2px;">ELITE KURIER</h1>
                    <small>AUSGABE MÄRZ 2026 | COACH: BJÖRN</small>
                </header>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:50px;">
                    <article>
                        <h2 style="font-family:'Orbitron'; font-size:1rem; border-bottom:1px solid #ddd; padding-bottom:10px;">WORT DES TRAINERS</h2>
                        <p style="font-family:'serif'; line-height:1.6; padding-top:20px;">${d.newsGreeting}</p>
                    </article>
                    <aside>
                        <h2 style="font-family:'Orbitron'; font-size:1rem; border-bottom:1px solid #ddd; padding-bottom:10px;">SPONSOREN</h2>
                        <div id="news-sponsors" style="padding-top:20px;"></div>
                        <button onclick="window.print()" style="margin-top:40px; width:100%; padding:10px; background:#111; color:#fff; border:none; cursor:pointer; font-family:'Orbitron'; font-size:0.6rem;">EXPORT ALS PDF</button>
                    </aside>
                </div>
            </div>
        `;

        const sp = document.getElementById('news-sponsors');
        d.sponsors.forEach(s => {
            sp.innerHTML += `<img src="${s.logo}" style="width:100%; margin-bottom:20px; filter:grayscale(1);">`;
        });
    }
};
