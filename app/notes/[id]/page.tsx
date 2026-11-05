import { notFound } from 'next/navigation';
import { AiTools } from '@/components/ai-tools';
import { findNote } from '@/data/notes';

export default async function NotePage({ params }: PageProps<'/notes/[id]'>) {
  const { id } = await params;
  const note = findNote(id);
  if (!note) notFound();

  return (
    <article>
      <h1 className="text-2xl font-semibold">{note.title}</h1>
      <p className="mt-4 leading-7">{note.body}</p>
      <AiTools note={note} />
    </article>
  );
}
