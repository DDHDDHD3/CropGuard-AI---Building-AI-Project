import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  isStreaming = false
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className="chatgpt-markdown text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2.5 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-1.5 pb-1 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-2.5 mb-1 pb-0.5 border-b border-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mt-2 mb-1 text-emerald-900 flex items-center gap-1.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mt-1.5 mb-0.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-1.5 leading-relaxed text-slate-700">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-700">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 ml-4 list-disc space-y-1 text-slate-700 marker:text-emerald-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-4 list-decimal space-y-1 text-slate-700 marker:text-emerald-700 font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed text-slate-700">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 pl-3 py-1.5 border-l-3 border-emerald-500 bg-emerald-50/60 rounded-r-lg text-slate-700 text-xs italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/90 text-slate-800 font-semibold uppercase tracking-wider text-[10px]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/80 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-slate-700 font-semibold border-b border-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-slate-600 align-top">
              {children}
            </td>
          ),
          hr: () => <hr className="my-3 border-slate-200" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors font-medium inline-flex items-center gap-0.5"
            >
              {children}
            </a>
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const codeString = String(children).replace(/\n$/, '');
            const isMultiline = !inline && codeString.includes('\n');

            if (isMultiline) {
              const codeIdx = Math.abs(codeString.length * 31);
              return (
                <div className="my-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-xs shadow-xs">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/80 text-[11px] text-slate-400 font-mono">
                    <span>Code / Protocol</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeString, codeIdx)}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 hover:bg-slate-700"
                    >
                      {copiedCodeIndex === codeIdx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto font-mono leading-relaxed text-emerald-300">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code
                className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-200"
                {...props}
              >
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Blinking ChatGPT streaming cursor at the end of generated content */}
      {isStreaming && (
        <span
          className="inline-block w-2 h-4 ml-1 -mb-0.5 bg-emerald-600 animate-pulse rounded-xs align-baseline"
          aria-label="typing cursor"
          title="Streaming response..."
        />
      )}
    </div>
  );
};
