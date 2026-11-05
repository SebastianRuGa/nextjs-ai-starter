import 'server-only';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { sampleNotes } from '@/data/sample-notes';

// Keeping the connection on globalThis means there's only one, even though
// Next.js can load this file more than once.
const store = globalThis as typeof globalThis & { aiNotesDb?: DatabaseSync };

function openDatabase() {
  const db = new DatabaseSync(path.join(process.cwd(), 'data', 'ai-notes.db'), { timeout: 5000 });

  // This only runs when the connection opens, so restart the app after you add a table.
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add the sample notes once, to a new database. user_version is a number
  // SQLite keeps in the file for us to use, and it starts at 0.
  const { user_version } = db.prepare('PRAGMA user_version').get() as { user_version: number };
  if (user_version === 0) {
    const insert = db.prepare('INSERT INTO notes (id, title, body) VALUES (?, ?, ?)');
    for (const note of sampleNotes) {
      insert.run(note.id, note.title, note.body);
    }
    db.exec('PRAGMA user_version = 1');
  }

  return db;
}

export function getDb() {
  store.aiNotesDb ??= openDatabase();
  return store.aiNotesDb;
}
