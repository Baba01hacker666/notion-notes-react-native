import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { ThemeColors } from '../../theme/colors';

interface MarkdownRendererProps {
  content: string;
  themeColors: ThemeColors;
  accentColor: string;
}

type ListItem = { text: string; task?: boolean; checked?: boolean };

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: ListItem[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang: string; code: string }
  | { type: 'quote'; text: string }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'hr' };

/** Split a markdown line into inline segments: `code`, **bold**, *italic*, ~~strike~~, [link](url). */
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;

function renderInline(
  text: string,
  themeColors: ThemeColors,
  accentColor: string,
  keyBase: string
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const parts = text.split(INLINE_PATTERN);
  parts.forEach((part, idx) => {
    if (!part) return;
    const key = `${keyBase}-${idx}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      nodes.push(
        <Text key={key} style={[styles.inlineBold, { color: themeColors.textPrimary }]}>
          {part.slice(2, -2)}
        </Text>
      );
    } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      nodes.push(
        <Text
          key={key}
          style={[styles.inlineCode, { backgroundColor: themeColors.badgeBg, color: themeColors.textSecondary }]}
        >
          {part.slice(1, -1)}
        </Text>
      );
    } else if (part.startsWith('~~') && part.endsWith('~~') && part.length > 4) {
      nodes.push(
        <Text key={key} style={[styles.inlineStrike, { color: themeColors.textMuted }]}>
          {part.slice(2, -2)}
        </Text>
      );
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      nodes.push(
        <Text key={key} style={[styles.inlineItalic, { color: themeColors.textPrimary }]}>
          {part.slice(1, -1)}
        </Text>
      );
    } else {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <Text
            key={key}
            style={{ color: accentColor, fontWeight: '600' }}
            onPress={() => Linking.openURL(link[2]).catch(() => {})}
          >
            {link[1]}
          </Text>
        );
      } else {
        nodes.push(<Text key={key}>{part}</Text>);
      }
    }
  });
  return nodes;
}

function parseMarkdown(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code block
    const fence = trimmed.match(/^```(\w*)/);
    if (fence) {
      const lang = fence[1] || '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading
    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }

    // Blockquote (consecutive lines)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    // Pipe table (consecutive lines)
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.map(l =>
        l
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(c => c.trim())
      );
      const header = rows[0] || [];
      const bodyRows = rows.slice(1).filter(r => !r.every(c => /^:?-{2,}:?$/.test(c)));
      if (bodyRows.length > 0) {
        blocks.push({ type: 'table', header, rows: bodyRows });
      }
      continue;
    }

    // Unordered / task list (consecutive lines)
    const listMatch = trimmed.match(/^([-*+])\s+(.*)$/);
    if (listMatch) {
      const items: ListItem[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = t.match(/^([-*+])\s+(.*)$/);
        if (!m) break;
        const task = m[2].match(/^\[( |x|X)\]\s+(.*)$/);
        items.push(
          task
            ? { text: task[2], task: true, checked: task[1].toLowerCase() === 'x' }
            : { text: m[2] }
        );
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list (consecutive lines)
    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = t.match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Paragraph (consecutive plain lines)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break;
      if (
        /^```/.test(t) ||
        /^#{1,6}\s/.test(t) ||
        t.startsWith('>') ||
        t.startsWith('|') ||
        /^([-*+]|\d+\.)\s/.test(t) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(t)
      ) {
        break;
      }
      paraLines.push(t);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
    }
  }

  return blocks;
}

const headingStyle = (level: number, themeColors: ThemeColors) => {
  const base = { color: themeColors.textPrimary, fontWeight: '800' as const };
  switch (level) {
    case 1:
      return { ...base, fontSize: 24, letterSpacing: -0.5, marginBottom: 10, marginTop: 6 };
    case 2:
      return { ...base, fontSize: 20, letterSpacing: -0.3, marginBottom: 8, marginTop: 6 };
    case 3:
      return { ...base, fontSize: 17, marginBottom: 6, marginTop: 4 };
    default:
      return { ...base, fontSize: 15, marginBottom: 6, marginTop: 4 };
  }
};

function renderBlock(
  block: Block,
  index: number,
  themeColors: ThemeColors,
  accentColor: string
): React.ReactNode {
  const key = `block-${index}`;
  switch (block.type) {
    case 'heading':
      return (
        <Text key={key} style={headingStyle(block.level, themeColors)}>
          {renderInline(block.text, themeColors, accentColor, key)}
        </Text>
      );
    case 'paragraph':
      return (
        <Text key={key} style={[styles.paragraph, { color: themeColors.textPrimary }]}>
          {renderInline(block.text, themeColors, accentColor, key)}
        </Text>
      );
    case 'ul':
      return (
        <View key={key} style={styles.list}>
          {block.items.map((item, idx) => (
            <View key={`${key}-li-${idx}`} style={styles.listRow}>
              {item.task ? (
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: accentColor, backgroundColor: item.checked ? accentColor : 'transparent' },
                  ]}
                >
                  {item.checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
                </View>
              ) : (
                <Text style={[styles.bullet, { color: accentColor }]}>•</Text>
              )}
              <Text style={[styles.listText, { color: themeColors.textPrimary }]}>
                {renderInline(item.text, themeColors, accentColor, `${key}-li-${idx}`)}
              </Text>
            </View>
          ))}
        </View>
      );
    case 'ol':
      return (
        <View key={key} style={styles.list}>
          {block.items.map((item, idx) => (
            <View key={`${key}-li-${idx}`} style={styles.listRow}>
              <Text style={[styles.bullet, { color: accentColor }]}>{idx + 1}.</Text>
              <Text style={[styles.listText, { color: themeColors.textPrimary }]}>
                {renderInline(item, themeColors, accentColor, `${key}-li-${idx}`)}
              </Text>
            </View>
          ))}
        </View>
      );
    case 'code':
      return (
        <View key={key} style={[styles.codeBlock, { backgroundColor: themeColors.inputBg, borderColor: themeColors.cardBorder }]}>
          {block.lang ? (
            <Text style={[styles.codeLang, { color: accentColor }]}>{block.lang}</Text>
          ) : null}
          <Text style={[styles.codeText, { color: themeColors.textSecondary }]}>{block.code}</Text>
        </View>
      );
    case 'quote':
      return (
        <View key={key} style={[styles.quoteBlock, { borderLeftColor: accentColor, backgroundColor: themeColors.badgeBg }]}>
          <Text style={[styles.quoteText, { color: themeColors.textSecondary }]}>
            {renderInline(block.text, themeColors, accentColor, key)}
          </Text>
        </View>
      );
    case 'table':
      return (
        <View key={key} style={[styles.table, { borderColor: themeColors.divider }]}>
          <View style={[styles.tableRow, { backgroundColor: themeColors.badgeBg }]}>
            {block.header.map((cell, idx) => (
              <Text key={`h-${idx}`} style={[styles.tableCell, styles.tableHeaderCell, { color: themeColors.textPrimary }]}>
                {cell}
              </Text>
            ))}
          </View>
          {block.rows.map((row, rIdx) => (
            <View key={`r-${rIdx}`} style={[styles.tableRow, { borderTopColor: themeColors.divider }]}>
              {row.map((cell, cIdx) => (
                <Text key={`c-${cIdx}`} style={[styles.tableCell, { color: themeColors.textSecondary }]}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    case 'hr':
      return <View key={key} style={[styles.hr, { backgroundColor: themeColors.divider }]} />;
    default:
      return null;
  }
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, themeColors, accentColor }) => {
  if (!content || !content.trim()) return null;
  const blocks = parseMarkdown(content);
  return (
    <View style={styles.container}>
      {blocks.map((block, index) => renderBlock(block, index, themeColors, accentColor))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 10,
  },
  inlineBold: {
    fontWeight: '800',
  },
  inlineItalic: {
    fontStyle: 'italic',
  },
  inlineStrike: {
    textDecorationLine: 'line-through',
  },
  inlineCode: {
    fontFamily: 'monospace',
    fontSize: 13,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  list: {
    marginBottom: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 22,
    minWidth: 14,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxMark: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  codeBlock: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  codeLang: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
  },
  quoteBlock: {
    borderLeftWidth: 3,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  table: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  tableHeaderCell: {
    fontWeight: '800',
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    lineHeight: 17,
  },
  hr: {
    height: 1,
    marginVertical: 12,
  },
});
