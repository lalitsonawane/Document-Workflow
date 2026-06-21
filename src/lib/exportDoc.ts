import type { SpecData, Section } from '../types';

function slugify(s: string): string {
  return s.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportDoc(data: SpecData, sections: Section[]): Promise<void> {
  const { generateDocxBlob } = await import('./docxGenerator');
  const blob = await generateDocxBlob(data, sections);
  downloadBlob(blob, `${slugify(data.title)}-fsd.docx`);
}
