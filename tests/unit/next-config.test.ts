import { describe, it, expect } from 'vite-plus/test';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('next.config.mjs', () => {
  const configPath = join(process.cwd(), 'next.config.mjs');
  const configContent = readFileSync(configPath, 'utf-8');

  it('unoptimized: true が設定されていない', () => {
    expect(configContent).not.toMatch(/unoptimized\s*:\s*true/);
  });
});
