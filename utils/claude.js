// Helper for calling Claude from inside the artifact.
// Usage:
//   const text = await window.askClaude("...", { onToken: t => ... });
//   const json = await window.askClaudeJSON("Return JSON with shape ...");

(function () {
  async function askClaude(prompt, opts = {}) {
    if (!window.claude || !window.claude.complete) {
      return '[AI is unavailable — try again or use the built-in generators]';
    }
    try {
      const text = await window.claude.complete(prompt);
      return text;
    } catch (e) {
      console.error('Claude error', e);
      return '[AI request failed: ' + (e?.message || 'unknown error') + ']';
    }
  }

  async function askClaudeJSON(prompt, fallback = null) {
    const wrapped = prompt + '\n\nRespond with ONLY a single valid JSON object (no markdown fences, no commentary).';
    const text = await askClaude(wrapped);
    // Try to extract a JSON object.
    let s = text.trim();
    // Strip code fences if present
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    // Find first { and last }
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start >= 0 && end > start) s = s.slice(start, end + 1);
    try {
      return JSON.parse(s);
    } catch (e) {
      console.warn('JSON parse failed, returning fallback', e, text);
      return fallback;
    }
  }

  window.askClaude = askClaude;
  window.askClaudeJSON = askClaudeJSON;
})();
