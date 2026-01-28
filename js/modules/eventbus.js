/**
 * TONI 2.0 - EventBus
 * Das zentrale Nervensystem für die Kommunikation
 */
window.ToniEvents = {
    events: {},

    /**
     * Ein Event abonnieren (Zuhören)
     */
    on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
        console.log(`[EventBus] Abo für: ${eventName}`);
    },

    /**
     * Ein Event auslösen (Senden)
     */
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => fn(data));
            console.log(`[EventBus] Sende: ${eventName}`, data);
        }
    }
};
