import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
} from 'docx'
import type { MinutaAssistida } from './types'
import { TIPO_DOCUMENTO_MINUTA_LABELS, MINUTA_ENTITY_TYPE_LABELS, STATUS_MINUTA_LABELS } from './types'

// Linha separadora pesada (═══)
const SEP_CHAR = '═'
// Linha separadora leve (─── )
const DIV_CHAR = '─'

function isSepLine(line: string): boolean {
  const t = line.trim()
  return t.length >= 10 && (t.split('').every((c) => c === SEP_CHAR) || t.split('').every((c) => c === DIV_CHAR))
}

function isSectionHeader(line: string): boolean {
  return /^\d+\.\s+[A-ZÀÁÂÃÉÊÍÓÔÕÚÇ\s—–]+$/.test(line.trim()) || /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s—–]{6,}$/.test(line.trim())
}

export function formatarConteudoMinutaParaDocx(conteudo: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const lines = conteudo.split('\n')

  for (const raw of lines) {
    const line = raw // preserve leading spaces for monospace items

    // Skip heavy separator lines — replaced by spacing
    if (isSepLine(line)) {
      paragraphs.push(new Paragraph({ spacing: { before: 80, after: 80 } }))
      continue
    }

    // Light divider — thin horizontal rule approximated by underscored text
    if (line.trim().length >= 10 && line.trim().split('').every((c) => c === DIV_CHAR)) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '─'.repeat(40),
              color: 'AAAAAA',
              size: 14,
            }),
          ],
          spacing: { before: 60, after: 60 },
        })
      )
      continue
    }

    // Empty line → spacing paragraph
    if (line.trim() === '') {
      paragraphs.push(new Paragraph({ spacing: { before: 60, after: 60 } }))
      continue
    }

    // All-caps section header (e.g. "1. MODELO BASE", "CONTEXTO DA ORIGEM")
    if (isSectionHeader(line.trim())) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              bold: true,
              size: 22,
              color: '1F2346',
            }),
          ],
          spacing: { before: 200, after: 80 },
        })
      )
      continue
    }

    // First line — document title (MINUTA ASSISTIDA — ...)
    if (line.startsWith('MINUTA ASSISTIDA —')) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              bold: true,
              size: 28,
              color: '1F2346',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 0, after: 120 },
        })
      )
      continue
    }

    // Aviso ⚠
    if (line.startsWith('⚠')) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              bold: true,
              italics: true,
              color: 'B45309',
              size: 18,
            }),
          ],
          spacing: { before: 160, after: 80 },
        })
      )
      continue
    }

    // Checklist item [ ]
    if (line.trim().startsWith('[ ]')) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              font: 'Courier New',
              size: 18,
            }),
          ],
          indent: { left: 360 },
          spacing: { before: 40, after: 40 },
        })
      )
      continue
    }

    // Clause marker § or orientation ▸
    if (line.trim().startsWith('§') || line.trim().startsWith('▸')) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              bold: true,
              size: 20,
            }),
          ],
          spacing: { before: 120, after: 40 },
        })
      )
      continue
    }

    // Risk line ⚠ Riscos:
    if (line.trim().startsWith('⚠ Riscos:') || line.trim().startsWith('Aplicação:')) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              italics: true,
              color: '92400E',
              size: 18,
            }),
          ],
          indent: { left: 360 },
          spacing: { before: 40, after: 40 },
        })
      )
      continue
    }

    // Metadata lines (key : value pattern)
    if (/^[A-Za-záàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ\s]+\s{2,}:\s/.test(line)) {
      const colonIdx = line.indexOf(':')
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${key}: `, bold: true, size: 18 }),
            new TextRun({ text: value, size: 18 }),
          ],
          spacing: { before: 40, after: 40 },
        })
      )
      continue
    }

    // Default: regular paragraph
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 20 })],
        spacing: { before: 40, after: 40 },
      })
    )
  }

  return paragraphs
}

function slugifyTitulo(titulo: string): string {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export function nomeArquivoDocx(minuta: MinutaAssistida): string {
  const slug = slugifyTitulo(minuta.titulo)
  return slug ? `minuta-${slug}.docx` : `minuta-${minuta.id}.docx`
}

function metadataRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18 })] })],
        width: { size: 30, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 18 })] })],
        width: { size: 70, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      }),
    ],
  })
}

export async function gerarDocxMinuta(minuta: MinutaAssistida): Promise<Buffer> {
  const criado = new Date(minuta.createdAt).toLocaleDateString('pt-BR')
  const atualizado = new Date(minuta.updatedAt).toLocaleDateString('pt-BR')

  const metaRows: TableRow[] = [
    metadataRow('Status', STATUS_MINUTA_LABELS[minuta.status] ?? minuta.status),
    metadataRow('Tipo de documento', TIPO_DOCUMENTO_MINUTA_LABELS[minuta.tipoDocumento] ?? minuta.tipoDocumento),
    metadataRow('Responsável', minuta.responsavel),
    metadataRow('Criado em', criado),
    metadataRow('Atualizado em', atualizado),
  ]

  if (minuta.entityType) {
    const origemLabel = minuta.entityLabel
      ? `${minuta.entityLabel} (${MINUTA_ENTITY_TYPE_LABELS[minuta.entityType]})`
      : MINUTA_ENTITY_TYPE_LABELS[minuta.entityType]
    metaRows.push(metadataRow('Origem', origemLabel))
  }
  if (minuta.modeloTitulo) metaRows.push(metadataRow('Modelo base', minuta.modeloTitulo))
  if (minuta.clausulaIds.length > 0) metaRows.push(metadataRow('Cláusulas', `${minuta.clausulaIds.length} selecionada(s)`))
  if (minuta.checklistTitulo) metaRows.push(metadataRow('Checklist', minuta.checklistTitulo))
  if (minuta.orientacaoIds.length > 0) metaRows.push(metadataRow('Orientações', `${minuta.orientacaoIds.length} selecionada(s)`))
  if (minuta.observacoes) metaRows.push(metadataRow('Observações', minuta.observacoes))

  const doc = new Document({
    creator: 'PIPE OS — Vieira da Silva Advocacia',
    title: minuta.titulo,
    description: `Pré-minuta assistida gerada pelo PIPE OS`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          // ── Cabeçalho do sistema ──────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({
                text: 'PIPE OS — Pré-Minuta Assistida',
                bold: true,
                size: 20,
                color: 'AAAAAA',
              }),
            ],
            spacing: { after: 40 },
          }),

          // ── Título da minuta ──────────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({
                text: minuta.titulo,
                bold: true,
                size: 36,
                color: '1F2346',
              }),
            ],
            spacing: { before: 40, after: 240 },
          }),

          // ── Tabela de metadados ───────────────────────────────────────
          new Paragraph({
            children: [new TextRun({ text: 'Metadados', bold: true, size: 22, color: '1F2346' })],
            spacing: { before: 0, after: 120 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: metaRows,
          }),

          // ── Separador ─────────────────────────────────────────────────
          new Paragraph({ spacing: { before: 240, after: 80 } }),

          new Paragraph({
            children: [new TextRun({ text: 'Conteúdo da Minuta', bold: true, size: 22, color: '1F2346' })],
            spacing: { before: 0, after: 160 },
          }),

          // ── Conteúdo gerado ───────────────────────────────────────────
          ...formatarConteudoMinutaParaDocx(minuta.conteudo),

          // ── Aviso final ───────────────────────────────────────────────
          new Paragraph({ spacing: { before: 400, after: 80 } }),

          new Paragraph({
            children: [
              new TextRun({
                text: '⚠ AVISO — DOCUMENTO DE TRABALHO',
                bold: true,
                size: 20,
                color: 'B45309',
              }),
            ],
            spacing: { before: 0, after: 80 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Este documento é uma pré-minuta assistida, gerada a partir da Base de Conhecimento interna do escritório, e exige revisão jurídica integral antes de qualquer envio, assinatura ou utilização. Não constitui instrumento jurídico finalizado.',
                italics: true,
                size: 18,
                color: '92400E',
              }),
            ],
            spacing: { before: 0, after: 80 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'DFA568' },
            },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Gerado pelo PIPE OS em ${new Date().toLocaleDateString('pt-BR')} — Vieira da Silva Advocacia`,
                size: 16,
                color: 'AAAAAA',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 160, after: 0 },
          }),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

// ── PDF ───────────────────────────────────────────────────────────────────────

// pdfkit uses built-in fonts (Helvetica) that only cover Latin-1.
// Replace characters outside that range with safe equivalents.
function sanitizarParaPdf(text: string): string {
  return text
    // Separadores de linha (múltiplos chars repetidos)
    .replace(/[═]{2,}/g, '='.repeat(60))
    .replace(/[─]{2,}/g, '-'.repeat(60))
    // Chars individuais usados no conteúdo das minutas
    .replace(/═/g, '=')
    .replace(/─/g, '-')
    .replace(/▸/g, '>')
    .replace(/⚠/g, '(!)')
    .replace(/✓/g, '[OK]')
    // Dashes tipográficos comuns (fora Latin-1)
    .replace(/—/g, ' - ') // em dash —
    .replace(/–/g, '-')   // en dash –
    .replace(/‒/g, '-')   // figure dash ‒
    // Aspas tipográficas (fora Latin-1)
    .replace(/[‘’]/g, "'") // '' → '
    .replace(/[“”]/g, '"') // "" → "
    // Reticências (fora Latin-1)
    .replace(/…/g, '...')
    // Fallback: qualquer outro char fora Latin-1 → ?
    .replace(/[^\x00-\xFF]/g, '?')
}

export function nomeArquivoPdf(minuta: MinutaAssistida): string {
  const slug = slugifyTitulo(minuta.titulo)
  return slug ? `minuta-${slug}.pdf` : `minuta-${minuta.id}.pdf`
}

export async function gerarPdfMinuta(minuta: MinutaAssistida): Promise<Buffer> {
  // Dynamic import keeps pdfkit out of the static bundle analysis
  const { default: PDFDocument } = await import('pdfkit')

  const criado = new Date(minuta.createdAt).toLocaleDateString('pt-BR')
  const atualizado = new Date(minuta.updatedAt).toLocaleDateString('pt-BR')

  const MARGIN = 50
  const PAGE_WIDTH = 595.28 // A4 points
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

  const COR_MARINHO = '#1F2346'
  const COR_DOURADO = '#DFA568'
  const COR_CINZA = '#9CA3AF'
  const COR_AMBER = '#92400E'
  const COR_TEXTO = '#374151'

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: MARGIN,
      info: {
        Title: minuta.titulo,
        Author: 'PIPE OS — Vieira da Silva Advocacia',
        Subject: 'Pre-minuta assistida',
        Creator: 'PIPE OS',
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', (err: Error) => reject(err))

    // ── Cabeçalho ───────────────────────────────────────────────────────────
    doc.font('Helvetica').fontSize(9).fillColor(COR_CINZA)
      .text('PIPE OS — Pre-Minuta Assistida — Vieira da Silva Advocacia', MARGIN, MARGIN, {
        width: CONTENT_WIDTH,
        align: 'left',
      })

    doc.moveDown(0.3)
    doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).strokeColor(COR_DOURADO).lineWidth(1).stroke()
    doc.moveDown(0.6)

    // ── Título ───────────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(18).fillColor(COR_MARINHO)
      .text(sanitizarParaPdf(minuta.titulo), { width: CONTENT_WIDTH })
    doc.moveDown(0.3)

    const tipoLabel = TIPO_DOCUMENTO_MINUTA_LABELS[minuta.tipoDocumento] ?? minuta.tipoDocumento
    doc.font('Helvetica').fontSize(10).fillColor(COR_CINZA)
      .text(sanitizarParaPdf(tipoLabel), { width: CONTENT_WIDTH })
    doc.moveDown(1)

    // ── Metadados ────────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(10).fillColor(COR_MARINHO).text('Metadados')
    doc.moveDown(0.4)

    const metaItems: [string, string][] = [
      ['Status', STATUS_MINUTA_LABELS[minuta.status] ?? minuta.status],
      ['Responsavel', minuta.responsavel],
      ['Criado em', criado],
      ['Atualizado em', atualizado],
    ]
    if (minuta.entityType) {
      const origemLabel = minuta.entityLabel
        ? `${minuta.entityLabel} (${MINUTA_ENTITY_TYPE_LABELS[minuta.entityType]})`
        : MINUTA_ENTITY_TYPE_LABELS[minuta.entityType]
      metaItems.push(['Origem', origemLabel])
    }
    if (minuta.modeloTitulo) metaItems.push(['Modelo base', minuta.modeloTitulo])
    if (minuta.clausulaIds.length > 0) metaItems.push(['Clausulas', `${minuta.clausulaIds.length} selecionada(s)`])
    if (minuta.checklistTitulo) metaItems.push(['Checklist', minuta.checklistTitulo])
    if (minuta.orientacaoIds.length > 0) metaItems.push(['Orientacoes', `${minuta.orientacaoIds.length} selecionada(s)`])
    if (minuta.observacoes) metaItems.push(['Observacoes', minuta.observacoes])

    for (const [label, value] of metaItems) {
      const y = doc.y
      doc.font('Helvetica-Bold').fontSize(9).fillColor(COR_TEXTO)
        .text(`${label}:`, MARGIN, y, { width: 120, continued: false })
      doc.font('Helvetica').fontSize(9).fillColor(COR_TEXTO)
        .text(sanitizarParaPdf(value), MARGIN + 125, y, { width: CONTENT_WIDTH - 125 })
      doc.moveDown(0.15)
    }

    doc.moveDown(0.8)
    doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).strokeColor('#E5E7EB').lineWidth(0.5).stroke()
    doc.moveDown(0.8)

    // ── Conteúdo ─────────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(10).fillColor(COR_MARINHO).text('Conteudo da Minuta')
    doc.moveDown(0.6)

    const lines = minuta.conteudo.split('\n')
    for (const raw of lines) {
      const line = raw.trim()

      // Skip heavy separator lines — just add spacing
      if (line.length >= 10 && (line.split('').every((c) => c === '═') || line.split('').every((c) => c === '─'))) {
        doc.moveDown(0.4)
        continue
      }

      if (line === '') {
        doc.moveDown(0.3)
        continue
      }

      // Document title line
      if (line.startsWith('MINUTA ASSISTIDA')) {
        // Already shown as page title — skip to avoid duplicate
        continue
      }

      // Section header (all-caps pattern)
      if (isSectionHeader(line)) {
        if (doc.y > 700) doc.addPage()
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COR_MARINHO)
          .text(sanitizarParaPdf(line), { width: CONTENT_WIDTH })
        doc.moveDown(0.3)
        continue
      }

      // Aviso ⚠
      if (line.startsWith('⚠') || line.startsWith('(!)')) {
        doc.font('Helvetica-Oblique').fontSize(9).fillColor(COR_AMBER)
          .text(sanitizarParaPdf(line), { width: CONTENT_WIDTH })
        doc.moveDown(0.3)
        continue
      }

      // Checklist [ ]
      if (line.startsWith('[ ]')) {
        doc.font('Courier').fontSize(9).fillColor(COR_TEXTO)
          .text(sanitizarParaPdf(line), MARGIN + 20, doc.y, { width: CONTENT_WIDTH - 20 })
        doc.moveDown(0.15)
        continue
      }

      // Clause § or orientation >
      if (line.startsWith('§') || line.startsWith('▸') || line.startsWith('>')) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(COR_TEXTO)
          .text(sanitizarParaPdf(line), { width: CONTENT_WIDTH })
        doc.moveDown(0.3)
        continue
      }

      // Risk line
      if (line.startsWith('⚠ Riscos:') || line.startsWith('Aplicacao:')) {
        doc.font('Helvetica-Oblique').fontSize(9).fillColor(COR_AMBER)
          .text(sanitizarParaPdf(line), MARGIN + 20, doc.y, { width: CONTENT_WIDTH - 20 })
        doc.moveDown(0.15)
        continue
      }

      // Default
      doc.font('Helvetica').fontSize(9).fillColor(COR_TEXTO)
        .text(sanitizarParaPdf(line), { width: CONTENT_WIDTH })
      doc.moveDown(0.15)
    }

    // ── Aviso final ──────────────────────────────────────────────────────────
    if (doc.y > 680) doc.addPage()
    doc.moveDown(1)

    // Golden top border approximated with a line
    doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).strokeColor(COR_DOURADO).lineWidth(1.5).stroke()
    doc.moveDown(0.5)

    doc.font('Helvetica-Bold').fontSize(9).fillColor(COR_AMBER)
      .text('(!) AVISO — DOCUMENTO DE TRABALHO', { width: CONTENT_WIDTH })
    doc.moveDown(0.3)

    doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(COR_AMBER)
      .text(
        'Este documento e uma pre-minuta assistida, gerada a partir da Base de Conhecimento interna do escritorio, ' +
        'e exige revisao juridica integral antes de qualquer envio, assinatura ou utilizacao. ' +
        'Nao constitui instrumento juridico finalizado.',
        { width: CONTENT_WIDTH }
      )
    doc.moveDown(1)

    // ── Rodapé ───────────────────────────────────────────────────────────────
    doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).strokeColor(COR_CINZA).lineWidth(0.5).stroke()
    doc.moveDown(0.3)
    doc.font('Helvetica').fontSize(8).fillColor(COR_CINZA)
      .text(
        `Gerado pelo PIPE OS em ${new Date().toLocaleDateString('pt-BR')} — Vieira da Silva Advocacia`,
        { width: CONTENT_WIDTH, align: 'right' }
      )

    doc.end()
  })
}
