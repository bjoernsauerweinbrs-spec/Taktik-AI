window.SektorLabor = {
    render() {
        const g = document.getElementById('briefcase-grid');
        g.innerHTML = `<h2 style="font-family:'Orbitron'; color:#00D1FF; margin-bottom:40px;">BIOMETRIE LABOR</h2>`;
        g.className = '';
        const b = window.ToniDatabase.biometrics;
        Object.keys(b).forEach(k => {
            const i = b[k]; const p = (i.val / i.max) * 100;
            g.innerHTML += `
                <div style="margin-bottom:20px; max-width:500px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem;"><span>${k.toUpperCase()}</span><span>${i.val}${i.unit}</span></div>
                    <div class="bar-bg"><div class="bar-fill" style="width:${p}%"></div></div>
                </div>`;
        });
    }
};
