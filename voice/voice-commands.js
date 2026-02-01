// =========================================
// Toni 2.0 – Voice Command Routing
// =========================================

function handleVoiceCommand(text) {
    const cmd = text.toLowerCase();

    // Navigation
    if (cmd.includes("aktentasche")) {
        toniSpeak("Ich öffne die Aktentasche.");
        document.getElementById("open-aktentasche").click();
        return;
    }

    if (cmd.includes("kader")) {
        toniSpeak("Kader wird geöffnet.");
        initKaderUI();
        return;
    }

    if (cmd.includes("analyse")) {
        toniSpeak("Analysezentrum wird geöffnet.");
        initAnalysisCenterUI();
        return;
    }

    if (cmd.includes("sportwatch") || cmd.includes("fitness")) {
        toniSpeak("Sportwatch wird geöffnet.");
        initSportwatchUI();
        return;
    }

    if (cmd.includes("stadionzeitung") || cmd.includes("zeitung")) {
        toniSpeak("Stadionzeitung wird geöffnet.");
        initStadionzeitungUI();
        return;
    }

    if (cmd.includes("beratung")) {
        toniSpeak("Beratung wird geöffnet.");
        initBeratungUI();
        return;
    }

    // Tools
    if (cmd.includes("passweg")) {
        toniSpeak("Passweg-Tool aktiviert.");
        TONI.tools.activate("pass");
        return;
    }

    if (cmd.includes("laufweg")) {
        toniSpeak("Laufweg-Tool aktiviert.");
        TONI.tools.activate("run");
        return;
    }

    // Fallback
    toniSpeak("Ich habe dich verstanden, aber der Befehl ist noch nicht hinterlegt.");
}