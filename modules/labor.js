window.SektorLabor = {
    render() {
        const g = document.getElementById('briefcase-content');
        g.innerHTML = `<h1 style="font-family:'Orbitron'; color:var(--cyan); margin-bottom:40px;">ELITE ANALYSEZENTRUM</h1>
                       <div class="lab-grid" id="lab-grid"></div>`;
        
        const grid = document.getElementById('lab-grid');
        const bio = window.ToniDatabase.biometrics;
        
        Object.keys(bio).forEach(k => {
            const i = bio[k]; const p = (i.val / i.max) * 100;
            grid.innerHTML += `
                <div class="lab-card">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-family:'Orbitron';">
                        <span>${i.label}</span><span style="color:var(--neon)">${i.val}${i.unit}</span>
                    </div>
                    <div class="bar-bg"><div class="bar-fill" style="width:${p}%"></div></div>
                </div>`;
        });
    }
};
 
