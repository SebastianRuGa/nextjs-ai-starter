import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

// server-only makes the build fail if a client component imports this file,
// so your API key can never reach the browser.
export const claude = new Anthropic();

export const model = process.env.LLM_MODEL ?? 'claude-haiku-5-5';
