/**
 * Monitoring: Punktevergabe mit Zeitstempel für die Saison-Statistik
 */
function addPerformancePoint(id, category) {
    const player = squad.find(p => p.id === id);
    if (player) {
        // Punkt hinzufügen
        player.points[category]++;
        
        // Historie für das Dashboard erstellen (NEU)
        if (!player.history) player.history = [];
        player.history.push({
            date: new Date().toISOString(),
            category: category
        });

        renderSquad();
        if (typeof saveSquadData === "function") saveSquadData();
        
        if (typeof toniSpeak === "function") {
            const catName = category === 'tech' ? 'Technik' : (category === 'scan' ? 'Scanning' : 'Teamplay');
            toniSpeak(`Sensationell! ${player.name} sammelt Punkte für die Saison-Statistik im Bereich ${catName}.`);
        }
    }
}
