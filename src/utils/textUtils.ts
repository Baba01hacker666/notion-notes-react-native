/**
 * Text & Markdown analysis helper utilities
 */

export const calculateStats = (text: string) => {
  const cleanText = text.trim();
  const characterCount = cleanText.length;
  
  // Split by whitespace to compute word count
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    characterCount,
    wordCount,
    readingTimeMinutes,
  };
};

export const extractHeader = (markdownContent: string): { title: string; body: string } => {
  const lines = markdownContent.split('\n');
  let title = '';
  const bodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!title && line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
    } else {
      bodyLines.push(lines[i]);
    }
  }

  if (!title && lines.length > 0) {
    title = lines[0].replace(/^#+\s*/, '').trim() || 'Untitled Note';
  }

  return {
    title: title || 'Untitled Note',
    body: bodyLines.join('\n'),
  };
};
