/**
 * Toni 2.0 - Command Processor
 * Verarbeitet die JSON-Befehle zur Board-Steuerung.
 */

window.toniCommander = {
    execute: (jsonCommand) => {
        try {
            const cmd = typeof jsonCommand === 'string' ? JSON.parse(jsonCommand) : jsonCommand;
            console.log("📥 Toni-Befehl empfangen:", cmd.type);

            switch(cmd.type) {
                case 'movePlayer':
                    // Spätere Verknüpfung mit der board.js
                    console.log(`Bewege Spieler ${cmd.payload.playerId} zu Position X:${cmd.payload.x} Y:${cmd.payload.y}`);
                    break;
                case 'setFormation':
                    console.log(`Ändere Grundordnung auf: ${cmd.payload.formation}`);
                    break;
                case 'highlightZone':
                    console.log(`Markiere Zone: ${cmd.payload.zone}`);
                    break;
                default:
                    console.warn("Unbekannter Befehl von Toni:", cmd.type);
            }
        } catch (e) {
            console.error("Fehler im Commander-Modul:", e);
        }
    }
};
