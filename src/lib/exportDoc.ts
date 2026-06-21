import type { SpecData, Section } from '../types';

export function exportDoc(data: SpecData, sections: Section[]): void {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  const body = sections
    .map((s) => `<h2>${s.number} ${esc(s.title)}</h2><p>${esc(s.content)}</p>`)
    .join('');
  const html = `<html><head><meta charset="utf-8"><style>body{font-family:Arial;color:#172554;margin:48px;line-height:1.6}h1{font-size:28px}h2{font-size:18px;border-bottom:1px solid #ccd3df;padding-bottom:8px;margin-top:30px}p{font-size:11pt}</style></head><body><h1>${esc(data.title)}</h1><p><b>Project:</b> ${esc(data.project)}<br><b>Module:</b> ${esc(data.module)}<br><b>Version:</b> ${esc(data.version)}<br><b>Author:</b> ${esc(data.author)}</p>${body}</body></html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'application/msword' }));
  a.download = `${data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-fsd.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
}
