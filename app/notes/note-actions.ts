'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createNote, deleteNote, updateNote } from '@/lib/notes';

const NoteFields = z.object({
  title: z.string().trim().min(1, 'Add a title.').max(120, 'Use a title under 120 characters.'),
  body: z.string().trim().min(1, 'Add some text.').max(20_000, 'Use a note under 20,000 characters.')
});

export type NoteFormState = { error?: string; title?: string; body?: string };

// Sends what the person typed back with the error, so that the form can keep it.
function invalid(message: string | undefined, formData: FormData): NoteFormState {
  return { error: message, title: String(formData.get('title') ?? ''), body: String(formData.get('body') ?? '') };
}

function parseFields(formData: FormData) {
  return NoteFields.safeParse({
    title: formData.get('title'),
    body: formData.get('body')
  });
}

export async function createNoteAction(_state: NoteFormState, formData: FormData): Promise<NoteFormState> {
  const fields = parseFields(formData);
  if (!fields.success) return invalid(fields.error.issues[0]?.message, formData);

  const id = createNote(fields.data.title, fields.data.body);
  revalidatePath('/');
  redirect(`/notes/${id}`);
}

export async function updateNoteAction(id: string, _state: NoteFormState, formData: FormData): Promise<NoteFormState> {
  const fields = parseFields(formData);
  if (!fields.success) return invalid(fields.error.issues[0]?.message, formData);

  updateNote(id, fields.data.title, fields.data.body);
  revalidatePath('/');
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}

export async function deleteNoteAction(id: string) {
  deleteNote(id);
  revalidatePath('/');
  redirect('/');
}
