import 'server-only';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { sampleNotes } from '@/data/sample-notes';

// Keeping the connection on globalThis means there's only one, even though
// Next.js can load this file more than once.
const store = globalThis as typeof globalThis & { aiNotesDb?: DatabaseSync };

function openDatabase() {
  const db = new DatabaseSync(path.join(process.cwd(), 'data', 'ai-notes.db'));

  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM notes').get() as { count: number };
  if (count === 0) {
    const insert = db.prepare('INSERT INTO notes (id, title, body) VALUES (?, ?, ?)');
    for (const note of sampleNotes) {
      insert.run(note.id, note.title, note.body);
    }
  }

  return db;
}

export function getDb() {
  store.aiNotesDb ??= openDatabase();
  return store.aiNotesDb;
}
