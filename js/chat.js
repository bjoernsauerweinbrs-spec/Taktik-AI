/**
 * Toni 2.0 - Männerstimme & KI-Logik
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

function toniSpeak(message) {
    if (!outputContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = "toni-msg";
    msgDiv.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        
        // --- MÄNNERSTIMME FIX ---
        utter.pitch = 0.8; // Tieferer Tonfall
        utter.rate = 0.9;  // Etwas bedächtiger
        
        const voices = window.speechSynthesis.getVoices();
        // Sucht gezielt nach männlichen Profilen im System
        const male = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Male'));
        if (male) utter.voice = male;
        
        window.speechSynthesis.speak(utter);
    }
}

// Funktion, um Übungen in die Aktentasche zu schieben
function saveExerciseToPlan(title, description) {
    let plans = JSON.parse(localStorage.getItem('toni_training_plans') || '[]');
    const newPlan = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: title,
        desc: description,
        notes: "",
        boardSnap: document.getElementById('pitch').innerHTML // Speichert das Board-Layout
    };
    plans.push(newPlan);
    localStorage.setItem('toni_training_plans', JSON.stringify(plans));
    toniSpeak("Sensationell! Ich habe die Übung in deine Aktentasche unter 'Trainingspläne' abgeheftet.");
}
