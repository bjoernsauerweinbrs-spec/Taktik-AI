// tools/test-scripts.js
// Kleine Hilfsfunktionen, die du in der Browser-Konsole ausführen kannst
// Kopiere den Inhalt in die DevTools Console oder speichere als Datei und lade sie temporär

window.ToniTests = {
    // Test 1: Force seed reset and check emit
    resetSeed() {
        localStorage.removeItem('toni_players');
        if (window.ToniDB && typeof window.ToniDB.init === 'function') {
            window.ToniDB.init();
            console.log('[ToniTests] Seed reset and init called');
        } else {
            console.warn('[ToniTests] ToniDB not available');
        }
    },

    // Test 2: Toggle presence for a player id
    togglePresence(id) {
        const p = window.ToniDB && window.ToniDB.getPlayers().find(x => x.id === id);
        if (!p) { console.warn('[ToniTests] player not found', id); return; }
        window.ToniDB.updatePlayer(id, { isPresent: !p.isPresent });
        console.log('[ToniTests] toggled presence for', id);
    },

    // Test 3: Simulate gateway failure by calling ask with unreachable local and no cloud proxy
    async simulateGatewayFail() {
        // Temporarily override endpoints to invalid ones if you want to force failure
        console.log('[ToniTests] calling ToniCore.processMessage with simulated failure');
        await window.ToniCore.processMessage('Simulate gateway failure test');
    },

    // Test 4: Resize canvas programmatically
    triggerResize() {
        window.dispatchEvent(new Event('resize'));
        console.log('[ToniTests] resize event dispatched');
    },

    // Test 5: Quick health check
    health() {
        console.log('ToniEvents', !!window.ToniEvents);
        console.log('ToniDB', !!window.ToniDB);
        console.log('Arena', !!window.arena);
        console.log('SektorSporttasche', !!window.SektorSporttasche);
        console.log('ToniGateway', !!window.ToniGateway, 'status:', window.ToniGateway?.status);
        console.log('ToniCore', !!window.ToniCore);
        console.log('ToniTTS', !!window.ToniTTS, 'available:', window.ToniTTS?.isAvailable?.());
    }
};
