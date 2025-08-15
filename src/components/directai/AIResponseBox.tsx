import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

/**
 * Composant pour afficher la réponse IA avec interprétation Markdown et défilement automatique
 * @param messages - Liste des messages structurés avec rôle
 */
export type AIMessage = { role: 'user' | 'assistant'; content: string };

interface AIResponseBoxProps {
  messages: AIMessage[];
  className?: string; // Permettre de surcharger la hauteur via le parent
  loading?: boolean; // Indique si une réponse est en cours de streaming
}

const AIResponseBox: React.FC<AIResponseBoxProps> = ({ messages, className = '', loading = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau chunk
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch (e) {
      // Silent fail – could add toast later
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col flex-1 min-h-0 overflow-y-auto gap-4 pb-2 pr-1` + (className ? ` ${className}` : '')}
    >
      {messages.length === 0 && (
        <div className="opacity-60 text-center italic">Posez votre première question…</div>
      )}
    {messages.map((m, idx) => {
        const isUser = m.role === 'user';
        const copied = copiedIndex === idx;
        return (
          <div
            key={idx}
            className={isUser ? 'flex justify-end group' : 'flex justify-start group'}
          >
            <div
              className={
                'rounded-xl px-4 py-2 shadow-sm max-w-[85%] whitespace-pre-wrap break-words' +
                (isUser
                  ? ' bg-blue-500/90 text-white'
                  : ' bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-600')
              }
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    components={{
                      code(codeProps) {
                        const { children, className } = codeProps as { children: React.ReactNode; className?: string };
                        const content = String(children || '');
                        const isBlock = content.includes('\n');
                        if (isBlock) {
                          return (
                            <code className={`block rounded-md px-3 py-2 text-sm overflow-x-auto bg-zinc-900/80 text-zinc-100 mt-2 mb-2 ${className || ''}`}>{children}</code>
                          );
                        }
                        return <code className="px-1 py-0.5 rounded bg-zinc-800/70 text-zinc-100 text-[0.85em]">{children}</code>;
                      }
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
                <button
                  type="button"
                  aria-label="Copier le message"
                  onClick={() => handleCopy(m.content, idx)}
                  className={'shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md border text-xs transition ' + (isUser ? 'bg-white/15 border-white/30 text-white hover:bg-white/25' : 'bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600')}
                >
                  {copied ? (
                    <span className="text-[10px] font-semibold">OK</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {loading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pl-1">
            <svg
              className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
              />
            </svg>
            <span className="italic select-none">Génération…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResponseBox;
