const EXPANDLIST_RE = /^~~~expandlist\s*\n([\s\S]*?)\n~~~/gm;
const EXPAND_RE = /^```expand\s*\n([\s\S]*?)\n```/gm;
const EMBED_RE = /^```(event|jobpost|news)\s*\n([\s\S]*?)\n```/gm;

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ensureBlankLines = (html: string) => `\n\n${html}\n\n`;

export function preprocessMarkdown(md: string): string {
  if (!md) return '';
  let out = md;

  out = out.replace(EXPANDLIST_RE, (_match, inner: string) => {
    const items = inner.replace(EXPAND_RE, (_m, body: string) => {
      const idx = body.indexOf('::');
      const title = idx >= 0 ? body.slice(0, idx).trim() : body.trim();
      const content = idx >= 0 ? body.slice(idx + 2) : '';
      return `<div data-kvark-expand data-title="${escapeAttr(title)}" data-content="${escapeAttr(content)}"></div>`;
    });
    return ensureBlankLines(`<div data-kvark-expandlist>${items}</div>`);
  });

  out = out.replace(EMBED_RE, (_match, kind: string, id: string) => {
    return ensureBlankLines(`<div data-kvark-embed="${kind}" data-id="${escapeAttr(id.trim())}"></div>`);
  });

  return out;
}
