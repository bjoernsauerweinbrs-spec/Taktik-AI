/**
 * Die Aktentasche: Speichern und Laden von Übungen & Kaderzuständen
 */

function saveExerciseToArchive(exerciseName) {
    const snapshot = {
        id: Date.now(),
        title: exerciseName || "Unbenannte Übung",
        timestamp: new Date().toLocaleString('de-DE'),
        // Speichert den kompletten Kader-Zustand inklusive Punkten
        squadData: JSON.parse(JSON.stringify(squad)),
        // Speichert die exakten Positionen der Punkte auf dem Feld
        positions: Array.from(document.querySelectorAll('.player-dot')).map(dot => ({
            label: dot.querySelector('.player-label').innerText,
            x: dot.style.left,
            y: dot.style.top
        }))
    };

    let archive = JSON.parse(localStorage.getItem('toni_archive') || '[]');
    archive.push(snapshot);
    localStorage.setItem('toni_archive', JSON.stringify(archive));
    
    if (typeof toniSpeak === 'function') {
        toniSpeak(`Björn, ich habe die Übung "${snapshot.title}" sicher in der Aktentasche verstaut.`);
    }
}

function loadExerciseFromArchive(id) {
    let archive = JSON.parse(localStorage.getItem('toni_archive') || '[]');
    const exercise = archive.find(ex => ex.id === id);
    
    if (exercise) {
        squad = exercise.squadData;
        renderSquad(); // Liste aktualisieren
        drawBoard();   // Board neu zeichnen
        
        // Nach dem Zeichnen die gespeicherten Positionen erzwingen
        setTimeout(() => {
            exercise.positions.forEach(pos => {
                const dots = document.querySelectorAll('.player-dot');
                dots.forEach(dot => {
                    if (dot.querySelector('.player-label').innerText === pos.label) {
                        dot.style.left = pos.x;
                        dot.style.top = pos.y;
                    }
                });
            });
        }, 100);
    }
}
