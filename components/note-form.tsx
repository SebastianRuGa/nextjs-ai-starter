'use client';

import { useActionState } from 'react';
import type { NoteFormState } from '@/app/notes/note-actions';

type NoteFormProps = {
  action: (state: NoteFormState, formData: FormData) => Promise<NoteFormState>;
  defaultTitle?: string;
  defaultBody?: string;
  submitLabel: string;
};

export function NoteForm({ action, defaultTitle, defaultBody, submitLabel }: NoteFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-medium">
        Title
        <input name="title" defaultValue={defaultTitle} required maxLength={120} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-normal" />
      </label>
      <label className="block text-sm font-medium">
        Text
        <textarea name="body" defaultValue={defaultBody} required rows={10} maxLength={20000} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-normal" />
      </label>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
