/**
 * TONI 2.0 - EVENT BUS
 * Das zentrale Nervensystem für die Kommunikation der Module.
 */
window.ToniEvents = {
    listeners: {},
    on: function(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },
    emit: function(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
};
