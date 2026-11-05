import Link from 'next/link';
import { notes } from '@/data/notes';

// Show notes as they are now, so that notes you add appear in the list.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
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
  );
}
