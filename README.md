# AI Notes

A small Next.js notes app to add AI features to. The basic app is finished: you can list, read, create, edit and delete notes, and they're saved in a local SQLite database. You don't need to set up or learn anything about the database. Your job is to add the AI.

## Get started

You need Node.js 24 or later, and an Anthropic API key from your instructor. Follow the school's fair-usage rules for your key.

```bash
git clone https://github.com/WebDev-WBSCodingSchool/nextjs-ai-starter.git ai-notes
cd ai-notes
rm -rf .git
git init
npm install
cp .env.example .env.local
```

Add your API key to `.env.local`, then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first run creates the database, with three sample notes.

If your editor can't find `PageProps` before you've started the app, run `npx next typegen` once.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the app in development |
| `npm run build` | Builds the app and checks the types |
| `npm start` | Runs the built app |
| `npm run db:reset` | Deletes the database, so the next run starts again with the sample notes. Stop the app first |

## Where things are

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | List of notes |
| `app/notes/[id]/page.tsx` | One note, with the AI tools below it |
| `app/notes/new/page.tsx` | Create a note |
| `app/notes/[id]/edit/page.tsx` | Edit a note |
| `app/notes/note-actions.ts` | Server Actions that create, update and delete notes |
| `components/ai-tools.tsx` | **Where your AI features go** |
| `components/note-form.tsx` | The form for creating and editing |
| `lib/claude.ts` | **The Claude client** |
| `lib/notes.ts` | Functions for reading and changing notes |
| `lib/db.ts` | Opens the database and creates its table |
| `data/sample-notes.ts` | The sample notes |

## Use the notes

Import these functions from `@/lib/notes`, in server code only:

| Function | Returns | What it does |
| --- | --- | --- |
| `getNotes()` | `Note[]` | All notes, newest first |
| `getNote(id)` | `Note` or `undefined` | One note |
| `createNote(title, body)` | The new note's ID | Creates a note |
| `updateNote(id, title, body)` | Nothing | Changes a note |
| `deleteNote(id)` | Nothing | Deletes a note |

A `Note` has `id`, `title`, `body`, `createdAt` and `updatedAt`.

```typescript
import { getNote } from '@/lib/notes';

const note = getNote('office-move');
```

These functions are synchronous, so there's no `await`. The database is a single file, `data/ai-notes.db`, and Git ignores it.

### The database

The app uses SQLite through `node:sqlite`, which is built into Node.js, so there's nothing to install or run. If you'd like to save something new, such as generated summaries, here's how:

1. Add the table to the `db.exec` call in `lib/db.ts`:

   ```sql
   CREATE TABLE IF NOT EXISTS summaries (
     note_id TEXT PRIMARY KEY REFERENCES notes(id) ON DELETE CASCADE,
     summary TEXT NOT NULL
   );
   ```

2. Read and write it with `getDb()` from `@/lib/db`, using `?` placeholders for values. Never build SQL by joining strings, because that allows SQL injection.

   ```typescript
   import { getDb } from '@/lib/db';

   getDb()
     .prepare('INSERT OR REPLACE INTO summaries (note_id, summary) VALUES (?, ?)')
     .run(noteId, summary);

   const row = getDb().prepare('SELECT summary FROM summaries WHERE note_id = ?').get(noteId);
   ```

Rows come back as objects with no prototype, which Next.js refuses to pass to client components. Copy the values into a normal object first, as `toNote` does in `lib/notes.ts`.

## Use the Claude client

Import `claude` and `model` from `@/lib/claude`:

```typescript
import { claude, model } from '@/lib/claude';
```

### Keep model calls on the server

Your API key must never reach the browser. Call Claude only from Server Actions, Route Handlers and Server Components, and never name a key with the `NEXT_PUBLIC_` prefix. `lib/claude.ts` imports `server-only`, so using it from a client component fails the build.

Which should you use?

- **Server Action:** when a button or form needs one result back, such as a summary.
- **Route Handler:** when you need to stream the response, or to accept an upload over HTTP.

A Server Action is a public endpoint that anyone can call with any arguments. Validate what it receives, and don't accept arbitrary text to send to the model on your budget.

### Get a response

`message.content` is a list of blocks, and models that think can return a `thinking` block before the text. Check `stop_reason`, too: `max_tokens` means the text was cut off.

```typescript
const message = await claude.messages.create({
  model,
  max_tokens: 1024,
  system: 'Summarise the note in one sentence.',
  messages: [{ role: 'user', content: `<note>${note.body}</note>` }]
});

if (message.stop_reason !== 'end_turn') {
  throw new Error(`Stopped early: ${message.stop_reason}`);
}

const text = message.content.flatMap((block) => (block.type === 'text' ? [block.text] : [])).join('');
```

### Get structured data

Give the API a Zod schema, and read the typed result from `parsed_output`. `parse()` throws if the text can't be read, for example when `max_tokens` cuts it off, and `parsed_output` is `null` if there's no text.

```typescript
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';

const Summary = z.object({
  headline: z.string(),
  keyPoints: z.array(z.string())
});

const message = await claude.messages.parse({
  model,
  max_tokens: 1024,
  system: 'Summarise the note.',
  messages: [{ role: 'user', content: `<note>${note.body}</note>` }],
  output_config: { format: zodOutputFormat(Summary) }
});

console.log(message.parsed_output?.headline);
```

### Stream a response

Use `claude.messages.stream()` in a Route Handler. `text` events give you each piece of the answer, and `finalMessage()` waits for the end and rejects if something went wrong.

```typescript
const stream = claude.messages.stream({
  model,
  max_tokens: 2048,
  messages: [{ role: 'user', content: 'Write a short story.' }]
});

stream.on('text', (text) => console.log(text));

const message = await stream.finalMessage();
```

### Send an image

Put an `image` block before your text. Supported types are JPEG, PNG, GIF and WebP.

```typescript
const data = Buffer.from(await file.arrayBuffer()).toString('base64');

const message = await claude.messages.create({
  model,
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/png', data } },
        { type: 'text', text: 'Describe this image.' }
      ]
    }
  ]
});
```

### Handle errors

The SDK retries rate limits and server errors twice by itself. After that, or for any other problem, it throws. Log the real error on the server, and show your users a safe message.

```typescript
import Anthropic from '@anthropic-ai/sdk';

try {
  // call the model
} catch (err) {
  console.error(err);
  if (err instanceof Anthropic.RateLimitError) {
    return { error: 'The service is busy. Please try again shortly.' };
  }
  return { error: 'The AI service is not available. Please try again.' };
}
```

### Things that return an error

- `temperature` and prefilling the assistant's reply return a 400 error on current Claude models.
- A very low `max_tokens` can return only a `thinking` block and no text, since thinking counts towards it. You pay only for tokens used, so be generous.

See the [Claude API documentation](https://platform.claude.com/docs/en/api/overview) for everything else.
