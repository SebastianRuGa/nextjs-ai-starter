import 'server-only';
import { randomUUID } from 'node:crypto';
import { getDb } from '@/lib/db';

export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type NoteRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// Builds a plain object, which is also what you can pass to a client component.
const toNote = (row: NoteRow): Note => ({
  id: row.id,
  title: row.title,
  body: row.body,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export function getNotes() {
  const rows = getDb().prepare('SELECT * FROM notes ORDER BY created_at DESC, title').all() as NoteRow[];
  return rows.map(toNote);
}

export function getNote(id: string) {
  const row = getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as NoteRow | undefined;
  return row ? toNote(row) : undefined;
}

export function createNote(title: string, body: string) {
  const id = randomUUID();
  getDb().prepare('INSERT INTO notes (id, title, body) VALUES (?, ?, ?)').run(id, title, body);
  return id;
}

export function updateNote(id: string, title: string, body: string) {
  getDb()
    .prepare('UPDATE notes SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(title, body, id);
}

export function deleteNote(id: string) {
  getDb().prepare('DELETE FROM notes WHERE id = ?').run(id);
}
