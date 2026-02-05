// logic/llm-gateway.js
// ToniGateway: versucht lokale Ollama-Instanz, fällt bei Fehlern auf Cloud-Fallback zurück
// Liefert immer ein normalisiertes Objekt: { text, source, error }

window.ToniGateway = {
    status: 'unknown', // 'local' | 'cloud' | 'error' | 'unknown'

    async ask(prompt) {
        // Try local Ollama first
        try {
            this.status = 'local';
            console.log('[ToniGateway] attempting local Ollama');
            const res = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'gemma', prompt: prompt, stream: false })
            });
            if (!res.ok) throw new Error('Ollama HTTP ' + res.status);
            const data = await res.json();
            const text = data?.response || data?.text || (typeof data === 'string' ? data : '');
            console.log('[ToniGateway] local response received');
            return { text: text || '', source: 'local', error: false };
        } catch (localErr) {
            console.warn('[ToniGateway] local Ollama failed:', localErr);
            // Try cloud fallback
            try {
                this.status = 'cloud';
                console.log('[ToniGateway] attempting cloud fallback');
                // NOTE: Replace '/api/openai-proxy' with your secure server endpoint that holds the API key.
                const cloudRes = await fetch('/api/openai-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                if (!cloudRes.ok) throw new Error('Cloud HTTP ' + cloudRes.status);
                const cloudData = await cloudRes.json();
                // Normalize common shapes: cloudData.text or cloudData.choices[0].message.content
                const text = cloudData?.text || cloudData?.choices?.[0]?.message?.content || cloudData?.choices?.[0]?.text || '';
                console.log('[ToniGateway] cloud response received');
                return { text: text || '', source: 'cloud', error: false };
            } catch (cloudErr) {
                console.error('[ToniGateway] cloud fallback failed:', cloudErr);
                this.status = 'error';
                return { text: 'Toni ist gerade nicht verfügbar.', source: 'none', error: true };
            }
        } finally {
            // Emit gateway status so UI can react if needed
            try {
                if (window.ToniEvents && typeof window.ToniEvents.emit === 'function') {
                    window.ToniEvents.emit('gateway:status', this.status);
                }
            } catch (e) {
                console.warn('[ToniGateway] failed to emit gateway:status', e);
            }
        }
    },

    isAvailable() {
        return this.status !== 'error';
    }
};
