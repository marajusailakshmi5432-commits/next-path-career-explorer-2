import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { GeneratedCompany } from './autoGenerate';

const NAVY = rgb(0.06, 0.09, 0.17);
const TEAL = rgb(0.05, 0.58, 0.55);
const DARK_GRAY = rgb(0.2, 0.2, 0.2);
const LIGHT_GRAY = rgb(0.55, 0.55, 0.55);

export async function downloadCompanyInterviewPDF(company: GeneratedCompany): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = pageHeight - margin;

  function addPage() {
    return pdfDoc.addPage([pageWidth, pageHeight]);
  }

  let page = addPage();

  function ensureSpace(needed: number) {
    if (y - needed < margin) {
      page = addPage();
      y = pageHeight - margin;
    }
  }

  function drawText(text: string, size: number, fontType: typeof font, color: rgb, indent = 0) {
    const lines = wrapText(text, fontType, size, contentWidth - indent);
    for (const line of lines) {
      ensureSpace(size + 6);
      page.drawText(line, { x: margin + indent, y, size, font: fontType, color });
      y -= size + 6;
    }
  }

  function drawHeading(text: string, size = 14) {
    y -= 8;
    ensureSpace(size + 16);
    page.drawText(text, { x: margin, y, size, font: boldFont, color: NAVY });
    y -= size + 8;
    ensureSpace(2);
    page.drawRectangle({ x: margin, y, width: contentWidth, height: 1.5, color: TEAL });
    y -= 12;
  }

  function wrapText(text: string, fontType: typeof font, size: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      try {
        const width = fontType.widthOfTextAtSize(testLine, size);
        if (width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      } catch {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length > 0 ? lines : [text];
  }

  // Title
  drawText('NexPath - Company Interview Prep', 20, boldFont, NAVY);
  y -= 6;
  page.drawRectangle({ x: margin, y, width: contentWidth, height: 2, color: TEAL });
  y -= 22;

  drawText(company.name, 14, boldFont, TEAL);
  y -= 8;

  // Company Details
  drawHeading('Company Details');
  drawText(`Name: ${company.name}`, 11, font, DARK_GRAY);
  drawText(`Sector: ${company.category}`, 11, font, DARK_GRAY);
  drawText(`Founded: ${company.foundedYear}`, 11, font, DARK_GRAY);
  drawText(`Headquarters: ${company.hq}`, 11, font, DARK_GRAY);
  drawText(`Website: ${company.website}`, 11, font, DARK_GRAY);
  drawText(`Salary Range: ${company.salaryRange}`, 11, font, DARK_GRAY);
  y -= 4;
  drawText('About:', 11, boldFont, DARK_GRAY);
  drawText(company.about, 11, font, DARK_GRAY, 10);

  // Top Skills
  drawHeading('Top 8 Skills They Look For');
  drawText(company.topSkills.join(', '), 11, font, DARK_GRAY);

  // Hiring Process
  drawHeading('5-Step Hiring Process');
  company.hiringProcess.forEach((step, i) => {
    drawText(`${i + 1}. ${step}`, 11, font, DARK_GRAY, 10);
  });

  // Interview Questions
  drawHeading('Top 15 Interview Questions (8 Technical + 7 HR)');
  company.interviewQuestions.forEach((q, i) => {
    drawText(`Q${i + 1} [${q.type}]: ${q.question}`, 11, boldFont, DARK_GRAY);
    drawText(`Answer: ${q.answer}`, 10, font, LIGHT_GRAY, 10);
    y -= 4;
  });

  // Previous Year Questions
  drawHeading('Previous Year Questions');
  company.previousYearQuestions.forEach((q, i) => {
    drawText(`${i + 1}. ${q}`, 11, font, DARK_GRAY, 10);
  });

  // Resume Tips
  drawHeading('3 Resume Tips for This Company');
  company.resumeTips.forEach((tip, i) => {
    drawText(`${i + 1}. ${tip}`, 11, font, DARK_GRAY, 10);
  });

  // Footer
  y -= 20;
  drawText('Generated with NexPath - Universal Career Explorer', 9, font, LIGHT_GRAY);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `NexPath-${company.name.replace(/[^a-zA-Z0-9]/g, '')}-Interview-Prep.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── ATS Report PDF ────────────────────────────────────────

export async function downloadATSReportPDF(data: {
  score: number;
  matchedSkills: string[];
  missingKeywords: string[];
  tips: string[];
  targetRole: string;
}): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = pageHeight - margin;
  let page = pdfDoc.addPage([pageWidth, pageHeight]);

  function ensureSpace(needed: number) {
    if (y - needed < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function drawText(text: string, size: number, fontType: typeof font, color: rgb, indent = 0) {
    const words = text.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      try {
        if (fontType.widthOfTextAtSize(testLine, size) > contentWidth - indent && currentLine) {
          ensureSpace(size + 6);
          page.drawText(currentLine, { x: margin + indent, y, size, font: fontType, color });
          y -= size + 6;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      } catch {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      ensureSpace(size + 6);
      page.drawText(currentLine, { x: margin + indent, y, size, font: fontType, color });
      y -= size + 6;
    }
  }

  function drawHeading(text: string, size = 14) {
    y -= 8;
    ensureSpace(size + 16);
    page.drawText(text, { x: margin, y, size, font: boldFont, color: NAVY });
    y -= size + 8;
    page.drawRectangle({ x: margin, y, width: contentWidth, height: 1.5, color: TEAL });
    y -= 12;
  }

  const NAVY = rgb(0.06, 0.09, 0.17);
  const TEAL = rgb(0.05, 0.58, 0.55);
  const DARK_GRAY = rgb(0.2, 0.2, 0.2);
  const LIGHT_GRAY = rgb(0.55, 0.55, 0.55);

  drawText('NexPath - ATS Resume Score Report', 20, boldFont, NAVY);
  y -= 6;
  page.drawRectangle({ x: margin, y, width: contentWidth, height: 2, color: TEAL });
  y -= 20;

  drawHeading('ATS Score');
  drawText(`Score: ${data.score} / 100`, 16, boldFont, data.score >= 70 ? TEAL : data.score >= 40 ? rgb(0.8, 0.6, 0) : rgb(0.7, 0.2, 0.2));
  drawText(`Target Role: ${data.targetRole}`, 11, font, DARK_GRAY);

  drawHeading('Matched Skills');
  drawText(data.matchedSkills.length > 0 ? data.matchedSkills.join(', ') : 'None found', 11, font, DARK_GRAY);

  drawHeading('Missing Keywords');
  drawText(data.missingKeywords.length > 0 ? data.missingKeywords.join(', ') : 'None - all keywords matched!', 11, font, DARK_GRAY);

  drawHeading('Tips to Improve Your Score');
  data.tips.forEach((tip, i) => {
    drawText(`${i + 1}. ${tip}`, 11, font, DARK_GRAY, 10);
  });

  y -= 20;
  drawText('Generated with NexPath - Universal Career Explorer', 9, font, LIGHT_GRAY);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'NexPath-ATS-Resume-Report.pdf';
  link.click();
  URL.revokeObjectURL(url);
}
