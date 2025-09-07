/**
 * Génère un ID Mermaid valide pour l'injection SVG
 * @returns string - ID commençant par une lettre et sans caractères spéciaux
 */
function generateMermaidId(): string {
  return 'mermaidGraph_' + Math.random().toString(36).substring(2, 10);
}

/**
 * Composant MermaidGraph pour le rendu SVG Mermaid
 * @param code - Code Mermaid à interpréter
 * Adapte le thème Mermaid au mode light/dark
 */
const MermaidGraph: React.FC<{ code: string }> = ({ code }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Détection du mode dark/light via media query
  const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setError(null);
    // Configuration du thème Mermaid selon le mode
    mermaid.initialize({
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark
        ? {
            background: '#18181b',
            fontFamily: 'inherit',
            primaryColor: '#a78bfa',
            edgeLabelBackground: '#18181b',
            nodeTextColor: '#e0e7ff',
            clusterBkg: '#27272a',
            clusterBorder: '#a78bfa',
            lineColor: '#e0e7ff', // Couleur des lignes et flèches
            arrowheadColor: '#a78bfa', // Couleur des têtes de flèche
            edgeStrokeWidth: 2, // Épaisseur des lignes
            edgeColor: '#e0e7ff',
            edgeLabelColor: '#e0e7ff',
          }
        : {
            background: '#f8fafc',
            fontFamily: 'inherit',
            primaryColor: '#6366f1',
            edgeLabelBackground: '#f8fafc',
            nodeTextColor: '#312e81',
            clusterBkg: '#e0e7ff',
            clusterBorder: '#6366f1',
            lineColor: '#312e81', // Couleur des lignes et flèches
            arrowheadColor: '#6366f1', // Couleur des têtes de flèche
            edgeStrokeWidth: 2, // Épaisseur des lignes
            edgeColor: '#312e81',
            edgeLabelColor: '#312e81',
          }
    });
    const safeId = generateMermaidId();
    try {
      mermaid.parse(code); // validation
      mermaid.render(safeId, code).then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      }).catch(e => {
        if (!cancelled) setError(String(e));
      });
    } catch (e) {
      setError(String(e));
    }
    return () => { cancelled = true; };
  }, [code, isDark]);
  if (error) return <pre style={{ color: 'red' }}>Erreur Mermaid: {error}</pre>;
  if (!svg) return <div>Chargement du graphe…</div>;
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};
import 'highlight.js/styles/github-dark.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

/**
 * Composant pour afficher la réponse IA avec interprétation Markdown et défilement automatique
 * @param messages - Liste des messages structurés avec rôle
 */
export type AIMessage = { id: string; role: 'user' | 'assistant'; content: string };

interface AIResponseBoxProps {
  messages: AIMessage[];
  className?: string; // Permettre de surcharger la hauteur via le parent
  loading?: boolean; // Indique si une réponse est en cours de streaming
  compact?: boolean; // Mode compact pour réduire les espacements
  onScrollStateChange?: (state: { atBottom: boolean }) => void; // Notification scroll
  onContainerRef?: (el: HTMLDivElement | null) => void; // Accès ref externe
}

const AIResponseBox: React.FC<AIResponseBoxProps> = ({ messages, className = '', loading = false, compact = false, onScrollStateChange, onContainerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);

  // Force le scroll vers le bas à chaque changement de contenu
  const forceScrollToBottom = () => {
    const el = containerRef.current;
    const anchor = scrollAnchorRef.current;
    
    if (anchor) {
      // Méthode privilégiée: scroll vers l'ancre invisible
      anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setTimeout(() => {
        anchor.scrollIntoView({ behavior: 'auto', block: 'end' });
      }, 10);
    }
    
    if (el) {
      // Méthode de fallback: scrollTop direct
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
        atBottomRef.current = true;
        onScrollStateChange?.({ atBottom: true });
      }, 20);
      
      // Triple vérification pour être absolument sûr
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 100);
    }
  };

  // Scroll automatique vers le bas à chaque nouveau message ou changement
  useEffect(() => {
    forceScrollToBottom();
  }, [messages, loading]);

  // Effet supplémentaire pour s'assurer du scroll après le rendu complet
  useEffect(() => {
    const timer = setTimeout(() => {
      forceScrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, messages[messages.length - 1]?.content]);

  // Scroll forcé au montage du composant et observer pour les changements DOM
  useEffect(() => {
    const timer = setTimeout(() => {
      forceScrollToBottom();
    }, 200);

    // Observer pour les changements dans le DOM
    const el = containerRef.current;
    if (el) {
      const observer = new MutationObserver(() => {
        // Petit délai pour laisser le DOM se stabiliser
        setTimeout(() => {
          forceScrollToBottom();
        }, 10);
      });

      observer.observe(el, {
        childList: true,
        subtree: true,
        characterData: true
      });

      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const tolerance = 50;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= tolerance;
    if (atBottomRef.current !== atBottom) {
      atBottomRef.current = atBottom;
      onScrollStateChange?.({ atBottom });
    }
  };

  useEffect(() => { 
    onContainerRef?.(containerRef.current); 
    return () => onContainerRef?.(null); 
  }, [onContainerRef]);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(messageId);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch (e) {
      // Silent fail – could add toast later
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      aria-live="polite"
      className={`scrollbar-primary flex flex-col min-h-0 overflow-y-auto scroll-smooth ${compact ? 'gap-2 py-1' : 'gap-4 pb-4'} px-2` + (className ? ` ${className}` : '')}
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 && (
        <div className="opacity-60 text-center italic">Posez votre première question…</div>
      )}
      <div className="w-full flex flex-col">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          const copied = copiedIndex === m.id;
          const prev = messages[idx - 1];
          const newGroup = !prev || prev.role !== m.role;
          const roleLabel = isUser ? 'Utilisateur' : 'IA';

          return (
            
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full ${compact ? 'py-0.5' : 'py-1.5'}`}>
              {m.content && (
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${compact ? 'max-w-[82%]' : 'max-w-[88%]'} `}>
                  {newGroup && (
                    <span className={`mb-1 text-[10px] font-semibold tracking-wide uppercase select-none ${isUser ? 'text-blue-500 dark:text-blue-400' : 'text-fuchsia-500 dark:text-fuchsia-400'}`}>{roleLabel}</span>
                  )}
                  <div
                    className={
                      'rounded-xl whitespace-pre-wrap break-words border-1 text-wrap  transition-colors leading-relaxed  ' +
                      (compact ? 'px-3 py-1.5 text-[13px] max-w-[82%]' : 'px-4 py-2 text-sm max-w-[88%]') + ' ' +
                      (isUser
                        ? 'bg-blue-200/90'
                        : '')
                    }
                  >

                    <div className={`flex items-start ${compact ? 'gap-1' : 'gap-2'}`}>
                      <div className="flex-1 min-w-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeHighlight]}
                          components={{
                            code(codeProps) {
                              const { children, className } = codeProps as { children: React.ReactNode; className?: string };
                              const content = String(children || '');
                              const isMermaid = className?.includes('language-mermaid');
                              const isBlock = content.includes('\n');

                              if (isMermaid && isBlock) {
                                return <MermaidGraph key={`mermaid-${m.id}`} code={content} />;
                              }
                              if (isBlock) {
                                return (
                                  <code key={`code-block-${m.id}-${idx}`} className={`block rounded-md px-3 py-2 text-[0.85rem] overflow-x-auto mt-2 mb-2 bg-zinc-900/80 text-zinc-100 ${className || ''}`}>
                                    {children}
                                  </code>
                                );
                              }
                              return  <code key={`code-inline-${m.id}-${idx}`} className="px-1 py-0.5 rounded bg-zinc-800/70 text-zinc-100 text-[0.75rem]">
                                        {children}
                                      </code>;
                            }
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    
                      <button
                        type="button"
                        aria-label="Copier le message"
                        onClick={() => handleCopy(m.content, m.id)}
                        className={'shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md border text-xs transition ' + (isUser ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600')}
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
            )} 
            </div>
              
          );
        })}
      </div>

      {/* Élément ancre invisible pour forcer le scroll vers le bas */}
      <div 
        ref={scrollAnchorRef} 
        className="h-1 w-full" 
        style={{ scrollMarginBottom: '20px' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default AIResponseBox;
