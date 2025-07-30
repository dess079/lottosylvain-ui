// lottosylvain-ui
// TypeScript type pour la réponse Ollama /api/chat (streaming)
// Voir https://github.com/ollama/ollama/blob/main/docs/api.md

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message?: OllamaMessage;
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
  context?: number[];
}

export interface OllamaMessage {
  role: string;
  content: string;
  images?: string[];
  tool_calls?: Array<Record<string, any>>;
  tool_name?: string;
}
