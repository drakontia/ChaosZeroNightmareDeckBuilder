import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('ビルド高速化対応（Issue #116）', () => {
  describe('package.json scripts', () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
      scripts?: Record<string, string>;
    };

    it('typecheck スクリプトが定義されている（TS7ネイティブコンパイラでの型チェック計測用）', () => {
      expect(packageJson.scripts?.typecheck).toBeDefined();
      expect(packageJson.scripts?.typecheck).toMatch(/tsc\s+--noEmit/);
    });
  });

  describe('next.config.mjs', () => {
    const configPath = join(process.cwd(), 'next.config.mjs');
    const configContent = readFileSync(configPath, 'utf-8');

    it('Turbopackのファイルシステムキャッシュ（ビルド用）を無効化していない', () => {
      expect(configContent).not.toMatch(/turbopackFileSystemCacheForBuild\s*:\s*false/);
    });

    it('Turbopackのファイルシステムキャッシュ（開発用）を無効化していない', () => {
      expect(configContent).not.toMatch(/turbopackFileSystemCacheForDev\s*:\s*false/);
    });
  });

  describe('CI ワークフロー', () => {
    it('ビルド健全性チェック用のワークフローが存在する（型チェック・pnpm buildを実行）', () => {
      const workflowPath = join(process.cwd(), '.github/workflows/build.yml');
      expect(existsSync(workflowPath)).toBe(true);

      const workflowContent = readFileSync(workflowPath, 'utf-8');
      expect(workflowContent).toMatch(/pnpm\s+run\s+typecheck|pnpm\s+typecheck/);
      expect(workflowContent).toMatch(/pnpm\s+(run\s+)?build/);
    });
  });

  describe('計測・最適化ドキュメント', () => {
    it('計測手順とnext-intl root paramsの検討結果を含むドキュメントが存在する', () => {
      const docPath = join(process.cwd(), 'docs/build-performance.md');
      expect(existsSync(docPath)).toBe(true);

      const docContent = readFileSync(docPath, 'utf-8');
      expect(docContent).toMatch(/pnpm build/);
      expect(docContent).toMatch(/typecheck/);
      expect(docContent).toMatch(/root params|root-params/);
    });
  });
});
