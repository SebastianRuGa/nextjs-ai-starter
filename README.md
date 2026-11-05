# AI Notes

A small Next.js app to add AI features to. It has no database and no AI yet: three sample notes, a list page and a detail page.

## Get started

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

Open [http://localhost:3000](http://localhost:3000).

## Where things are

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | List of notes |
| `app/notes/[id]/page.tsx` | One note |
| `components/ai-tools.tsx` | Where your AI features go |
| `data/notes.ts` | The sample notes |
| `lib/claude.ts` | The Claude client, for use on the server only |

## Keep model calls on the server

Your API key must never reach the browser. Call Claude only from Route Handlers, Server Actions and Server Components, and never name a key with the `NEXT_PUBLIC_` prefix. `lib/claude.ts` imports `server-only`, so importing it from a client component fails the build.
