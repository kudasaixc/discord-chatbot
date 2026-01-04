export const DEFAULT_MODEL = "gpt-4o-mini";

export const ALLOWED_MODELS = [
  "gpt-5.2",
  "gpt-5.2-pro",
  "gpt-5.2-chat-latest",
  "gpt-5.1",
  "gpt-5.1-chat-latest",
  "gpt-5.1-codex",
  "gpt-5.1-codex-max",
  "gpt-5.1-codex-mini",
  "gpt-5",
  "gpt-5-pro",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5-codex",
  "gpt-5-chat-latest",
  "gpt-4.5-preview",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4o-mini-search-preview",
  "gpt-4o-search-preview",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4-turbo-preview",
  "gpt-3.5-turbo",
  "o1",
  "o1-mini",
  "o1-preview",
  "o1-pro",
  "o3",
  "o3-mini",
  "o3-pro",
  "o3-deep-research",
  "o4-mini",
  "o4-mini-deep-research",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "computer-use-preview",
  "chatgpt-4o-latest"
];

export const DEPRECATED_MODELS = [
  "text-davinci-001",
  "text-davinci-002",
  "text-davinci-003",
  "text-curie-001",
  "text-babbage-001",
  "text-ada-001"
];

export const BENCHMARK_MODELS = Array.from(new Set([...ALLOWED_MODELS, ...DEPRECATED_MODELS]));

export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif"
];

export const IMAGE_CAPABLE_MODELS = new Set([
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4o-search-preview",
  "gpt-4o-mini-search-preview",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano"
]);

export const MAX_CONTEXT_MESSAGES = 15;

export const COST_PER_TOKEN_USD = 0.0000003; // approximate blended cost for estimation only

export const DEFAULT_PERSONA_PARAMETERS = {
  max_completion_tokens: 500
};
