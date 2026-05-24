function escapePdfText(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapLine(line, maxLength = 88) {
  const words = String(line).split(' ');
  const lines = [];
  let current = '';

  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > maxLength) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  });

  if (current) lines.push(current);
  return lines;
}

function buildSimplePdf(lines) {
  const safeLines = lines.flatMap((line) => wrapLine(line));
  const textCommands = safeLines
    .map((line, index) => {
      const command = `(${escapePdfText(line)}) Tj`;
      return index === 0 ? command : `0 -16 Td ${command}`;
    })
    .join('\n');

  const content = `BT
/F1 18 Tf
50 790 Td
${textCommands}
ET`;

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdf;
}

export function downloadMeetingReport({ meeting, attendees, agendas, summary }) {
  const lines = [
    'ADRDE Agra - MAC Meeting Report',
    '',
    `Meeting Title: ${meeting.title}`,
    `Meeting ID: ${meeting.id}`,
    `Date and Time: ${meeting.date} ${meeting.time}`,
    `Venue: ${meeting.venue}`,
    '',
    'Attendees:',
    attendees.join(', '),
    '',
    'Agenda:',
    ...agendas.map((agenda, index) => `${index + 1}. ${agenda.topic} - ${agenda.status}`),
    '',
    'Summary:',
    summary,
  ];

  const pdf = buildSimplePdf(lines);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${meeting.id}-mac-report.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
