import { notFound } from 'next/navigation';
import { updateNoteAction } from '@/app/notes/note-actions';
import { NoteForm } from '@/components/note-form';
import { getNote } from '@/lib/notes';

export default async function EditNotePage({ params }: PageProps<'/notes/[id]/edit'>) {
  const { id } = await params;
  const note = getNote(id);
  if (!note) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Edit note</h1>
      <NoteForm action={updateNoteAction.bind(null, id)} defaultTitle={note.title} defaultBody={note.body} submitLabel="Save changes" />
    </>
  );
}
