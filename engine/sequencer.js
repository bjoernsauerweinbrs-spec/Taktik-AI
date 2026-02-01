// =========================================
// Toni 2.0 – Sequencer Engine
// Animierte Taktiksequenzen (Step-by-Step)
// =========================================

let sequencer = {
    steps: [],
    currentStep: 0,
    playing: false,
    speed: 800, // ms pro Schritt
    loop: false
};

// -----------------------------------------
// Sequenz hinzufügen
// -----------------------------------------
function addSequenceStep(x, y, color = "rgba(255,106,0,0.9)", size = 14) {
    sequencer.steps.push({ x, y, color, size });
    renderArena();
}

// -----------------------------------------
// Sequenz starten
// -----------------------------------------
function playSequence(loop = false) {
    if (sequencer.steps.length === 0) return;

    sequencer.loop = loop;
    sequencer.playing = true;
    sequencer.currentStep = 0;

    runSequenceStep();
}

// -----------------------------------------
// Sequenz stoppen
// -----------------------------------------
function stopSequence() {
    sequencer.playing = false;
    sequencer.currentStep = 0;
    arena.sequences = [];
    renderArena();
}

// -----------------------------------------
// Einzelnen Schritt abspielen
// -----------------------------------------
function runSequenceStep() {
    if (!sequencer.playing) return;

    const step = sequencer.steps[sequencer.currentStep];
    if (!step) {
        if (sequencer.loop) {
            sequencer.currentStep = 0;
            runSequenceStep();
        } else {
            sequencer.playing = false;
        }
        return;
    }

    // Schritt anzeigen
    arena.sequences = [step];
    renderArena();

    sequencer.currentStep++;

    setTimeout(() => {
        runSequenceStep();
    }, sequencer.speed);
}

// -----------------------------------------
// Sequenz löschen
// -----------------------------------------
function clearSequence() {
    sequencer.steps = [];
    sequencer.currentStep = 0;
    sequencer.playing = false;
    arena.sequences = [];
    renderArena();
}