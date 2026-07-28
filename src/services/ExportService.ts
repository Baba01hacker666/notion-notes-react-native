import { Note } from '../types';

export class ExportService {
  public static exportAsMarkdown(note: Note): string {
    let md = `# ${note.title}\n\n`;
    md += `*Last edited: ${new Date(note.updatedAt).toLocaleString()}*\n\n`;
    if (note.tags && note.tags.length > 0) {
      md += `**Tags:** ${note.tags.join(', ')}\n\n`;
    }
    md += note.content;
    return md;
  }

  public static exportAsHTML(note: Note): string {
    const markdownContent = this.exportAsMarkdown(note);
    // Simple clean HTML wrapper
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${note.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; background: #ffffff; }
    h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; color: #0f172a; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; color: #475569; font-style: italic; }
    code { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="note-container">
    <pre style="white-space: pre-wrap; font-family: inherit; background: none; color: inherit; padding: 0;">${markdownContent}</pre>
  </div>
</body>
</html>`;
  }

  public static exportAsTXT(note: Note): string {
    return `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}`;
  }

  public static exportAsJSON(notes: Note[]): string {
    return JSON.stringify(notes, null, 2);
  }

  public static downloadFile(content: string, filename: string, mimeType: string) {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  public static printOrSavePDF(note: Note) {
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof window.open === 'function') {
      const htmlContent = this.exportAsHTML(note);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  }
}
