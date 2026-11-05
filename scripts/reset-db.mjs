// Deletes the local database. The app creates a new one, with the sample notes,
// the next time it runs. Stop the app before you run this.
import { rmSync } from 'node:fs';

for (const suffix of ['', '-journal', '-wal', '-shm']) {
  rmSync(`data/ai-notes.db${suffix}`, { force: true });
}

console.log('Database deleted. Start the app to create a new one.');
