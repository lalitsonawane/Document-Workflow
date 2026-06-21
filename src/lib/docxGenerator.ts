import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  type ISectionOptions,
} from 'docx';
import type { SpecData, Section } from '../types';

function splitParagraphs(text: string): string[] {
  return text.split('\n').filter((line) => line.trim());
}

function buildParagraphs(data: SpecData, sections: Section[]): Paragraph[] {
  const cover: Paragraph[] = [
    new Paragraph({
      text: data.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Functional Specification Document',
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Project: ', bold: true }), new TextRun(data.project)],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'SAP Module: ', bold: true }), new TextRun(data.module)],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Process Area: ', bold: true }), new TextRun(data.process)],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Version: ', bold: true }), new TextRun(data.version)],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Prepared by: ', bold: true }), new TextRun(data.author)],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Complete')],
      spacing: { after: 400 },
      border: {
        bottom: { color: '0b1739', space: 1, style: BorderStyle.SINGLE, size: 6 },
      },
    }),
  ];

  const body: Paragraph[] = [];
  for (const section of sections) {
    body.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${section.number} ${section.title}`, bold: true, size: 28 }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 120 },
        border: {
          bottom: { color: 'dbe0e9', space: 1, style: BorderStyle.SINGLE, size: 4 },
        },
      }),
    );
    for (const line of splitParagraphs(section.content)) {
      body.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 120 },
        }),
      );
    }
  }

  return [...cover, ...body];
}

export async function generateDocxBlob(data: SpecData, sections: Section[]): Promise<Blob> {
  const docSections: ISectionOptions[] = [
    {
      properties: {},
      children: buildParagraphs(data, sections),
    },
  ];
  const doc = new Document({ sections: docSections });
  return Packer.toBlob(doc);
}
