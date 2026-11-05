import Link from 'next/link';
import { getNotes } from '@/lib/notes';

// Read the database on every request, so that new notes appear straight away.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const notes = getNotes();

  return (
    <>
      <Link href="/notes/new" className="mb-6 inline-block rounded bg-slate-900 px-3 py-2 text-sm text-white">
        New note
      </Link>
      {notes.length === 0 && <p className="text-slate-600">No notes yet.</p>}
      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note.id} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
            <Link href={`/notes/${note.id}`} className="block">
              <h2 className="font-medium">{note.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{note.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
