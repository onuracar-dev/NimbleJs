import type { ReactNode } from 'react';

// Just enough highlighting for the short snippets on this page.
const TOKEN = /(\/\/[^\n]*)|('[^']*')|\b(const|let|return|if|import|from|export)\b|\b(signal|computed|effect|batch|createStore|persist|withHistory)\b/g;

export function Code({ source }: { source: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(source.slice(last, index));
    const [text, comment, string, keyword] = match;
    const cls = comment ? 'c' : string ? 's' : keyword ? 'k' : 'f';
    parts.push(
      <span key={index} className={`t-${cls}`}>
        {text}
      </span>,
    );
    last = index + text.length;
  }
  parts.push(source.slice(last));

  return (
    <pre className="code">
      <code>{parts}</code>
    </pre>
  );
}
