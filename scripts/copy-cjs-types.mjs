import { copyFile } from 'node:fs/promises';

const distDirectory = new URL('../dist/', import.meta.url);

await copyFile(
  new URL('index.d.ts', distDirectory),
  new URL('index.d.cts', distDirectory),
);
