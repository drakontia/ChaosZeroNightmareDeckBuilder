import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Next.js version policy', () => {
  it('package.json の next が 16.3 系を指している', () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
    };

    expect(packageJson.dependencies?.next).toMatch(/^\^16\.3\./);
  });

  it('pnpm-lock.yaml の next 解決が 16.3 系である', () => {
    const lockfilePath = join(process.cwd(), 'pnpm-lock.yaml');
    const lockfile = readFileSync(lockfilePath, 'utf-8');

    expect(lockfile).toMatch(/next@16\.3\.\d+/);
  });
});
