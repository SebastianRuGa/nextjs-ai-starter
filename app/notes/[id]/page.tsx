import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteNoteAction } from '@/app/notes/note-actions';
import { AiTools } from '@/components/ai-tools';
import { getNote } from '@/lib/notes';

export default async function NotePage({ params }: PageProps<'/notes/[id]'>) {
  const { id } = await params;
  const note = getNote(id);
  if (!note) notFound();

  return (
    <article>
      <h1 className="text-2xl font-semibold">{note.title}</h1>
      <p className="mt-4 whitespace-pre-wrap leading-7">{note.body}</p>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <Link href={`/notes/${note.id}/edit`} className="underline">
          Edit
        </Link>
        <form action={deleteNoteAction.bind(null, note.id)}>
          <button className="text-red-700 underline">Delete</button>
        </form>
      </div>
      <AiTools note={note} />
    </article>
  );
}
