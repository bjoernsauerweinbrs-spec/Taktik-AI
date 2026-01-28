/**
 * Toni 2.0 - Math & Scout Engine
 * Korrekte BMI-Berechnung und Ginga-Score Logik.
 */

window.toniMath = {
    // Wandelt "1,80" sicher in "1.80" um
    parse: (val) => {
        if (!val) return 0;
        let c = String(val).replace(',', '.').replace(/[^\d.-]/g, '');
        return parseFloat(c) || 0;
    },

    // Die BMI-Formel
    calculateBMI: (weight, height) => {
        let w = toniMath.parse(weight);
        let h = toniMath.parse(height);
        if (h <= 0) return 0;
        if (h > 3) h = h / 100; // cm zu m
        return (w / (h * h)).toFixed(1);
    },

    // Ginga-Score: Technik (35%), Physis (25%), Taktik (25%), Spezial (15%)
    calculateGinga: (stats) => {
        const { tech, phys, tact, spec } = stats;
        let score = (tech * 0.35) + (phys * 0.25) + (tact * 0.25) + (spec * 0.15);
        return Math.round(score * 10) / 10;
    }
};
