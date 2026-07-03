import type { ReactNode } from "react";

/* Minimal markdown renderer for posts I author myself.
   Supports: h2/h3, paragraphs, fenced code, ul/ol, blockquote,
   hr, inline code, bold, italic, links. */

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^\s)]+\))/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("`")) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("[")) {
      const link = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (link) {
        nodes.push(
          <a key={key++} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>
        );
      }
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <div key={key++} className="relative">
          {lang && (
            <span className="absolute top-3 right-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500 select-none">
              {lang}
            </span>
          )}
          <pre>
            <code>{code.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={key++}>{renderInline(line.slice(4))}</h3>);
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(<h2 key={key++}>{renderInline(line.slice(3))}</h2>);
      i++;
      continue;
    }

    if (/^(---|\*\*\*)\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote key={key++}>
          <p>{renderInline(quote.join(" "))}</p>
        </blockquote>
      );
      continue;
    }

    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // paragraph: consume consecutive plain lines
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{2,3} |```|- |\d+\. |> |---|\*\*\*)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key++}>{renderInline(para.join(" "))}</p>);
  }

  return <>{blocks}</>;
}
