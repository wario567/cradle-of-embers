// Build the single listen-friendly campaign PDF (novel-structured, memory-aid).
//
// Regenerate after lore/story changes:
//   node tools/build-lore-pdf.js            # writes tools/lore.html
//   <chromium> --headless --no-sandbox --print-to-pdf=handouts/cradle-of-embers-lore.pdf \
//     --print-to-pdf-no-header file://$PWD/tools/lore.html
// (PDFs are .gitignored — the PDF is the deliverable, these .md files are the source.)
//
// Source of truth = the hand-written narrative companion + the two real player
// backgrounds. We deliberately do NOT dump gm-lore.js structured data here —
// that reads like a database. The companion IS the story; gm-lore stays the
// in-app reference.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Order of documents in the single PDF.
const DOCS = [
  { file: 'sessions/00-audio-companion.md', cover: true },
  { file: 'handouts/enkh-daniel-background.md', appendix: 'Appendix — The Players\' Own Words' },
  { file: 'handouts/west-kisa-background.md' },
];

const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
  .replace(/`(.+?)`/g, '$1');

function mdToHtml(md) {
  const out = [];
  let inList = false, inQuote = false;
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
  const closeQuote = () => { if (inQuote) { out.push('</blockquote>'); inQuote = false; } };
  md.split('\n').forEach(raw => {
    const t = raw.replace(/\s+$/,'');
    if (!t.trim()) { closeList(); closeQuote(); return; }
    if (/^#{1,6}\s/.test(t)) {
      closeList(); closeQuote();
      const m = t.match(/^(#{1,6})\s+(.*)/);
      const lvl = Math.min(m[1].length, 3);
      out.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`);
      return;
    }
    if (/^\s*[-*]\s+/.test(t)) { closeQuote(); if (!inList) { out.push('<ul>'); inList = true; } out.push(`<li>${inline(t.replace(/^\s*[-*]\s+/,''))}</li>`); return; }
    if (/^\d+\.\s+/.test(t)) { closeQuote(); if (!inList) { out.push('<ul>'); inList = true; } out.push(`<li>${inline(t.replace(/^\d+\.\s+/,''))}</li>`); return; }
    if (/^>\s?/.test(t)) { closeList(); if (!inQuote) { out.push('<blockquote>'); inQuote = true; } out.push(inline(t.replace(/^>\s?/,'')) + '<br/>'); return; }
    if (/^-{3,}$/.test(t.trim())) { closeList(); closeQuote(); out.push('<hr/>'); return; }
    closeList(); closeQuote();
    out.push(`<p>${inline(t)}</p>`);
  });
  closeList(); closeQuote();
  return out.join('\n');
}

let body = '';
DOCS.forEach(d => {
  const md = fs.readFileSync(path.join(ROOT, d.file), 'utf8');
  if (d.appendix) body += `<h1 class="appendix">${esc(d.appendix)}</h1>`;
  body += `<section>${mdToHtml(md)}</section>`;
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { margin: 24mm 22mm; }
body { font-family: Georgia, 'Times New Roman', serif; font-size: 13pt; line-height: 1.6; color: #1a1512; }
h1 { font-size: 24pt; color: #a2431f; border-bottom: 2px solid #a2431f; padding-bottom: 6px; margin: 34px 0 14px; page-break-before: always; page-break-after: avoid; }
h1.appendix { color: #6a5; border-color: #6a5; }
h2 { font-size: 17pt; color: #b4502c; margin: 24px 0 8px; page-break-after: avoid; }
h3 { font-size: 13.5pt; color: #333; margin: 18px 0 6px; page-break-after: avoid; }
p { margin: 9px 0; }
strong { color: #7a2e12; }
em { color: #333; }
ul { margin: 8px 0 8px 4px; }
li { margin: 5px 0; }
blockquote { margin: 12px 18px; padding: 8px 14px; border-left: 3px solid #b4502c; background: #faf6f2; font-style: italic; color: #4a3b32; }
hr { border: none; border-top: 1px solid #ddd0c8; margin: 18px 0; }
section:first-of-type h1:first-of-type { page-break-before: avoid; }
</style></head><body>${body}</body></html>`;

const HTML_PATH = path.join(__dirname, 'lore.html');
fs.writeFileSync(HTML_PATH, html);
console.log('HTML written:', HTML_PATH, '(' + Math.round(html.length/1024) + ' KB)');
