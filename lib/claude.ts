import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

// new Anthropic() reads ANTHROPIC_API_KEY from the environment. Next.js loads it from
// .env.local, unless it's already set in your shell, which takes priority.
// server-only makes the build fail if a client component imports this file,
// so your API key can never reach the browser.
export const claude = new Anthropic();

// The model to use, which you can change in .env.local.
export const model = process.env.LLM_MODEL ?? 'claude-haiku-5-5';
