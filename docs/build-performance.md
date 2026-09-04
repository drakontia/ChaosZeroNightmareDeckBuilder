# ビルド高速化対応（Issue #116）計測・最適化メモ

このドキュメントは、TS7（TypeScript 7 / `@typescript/native`）と Next.js 16.3 の機能を活用したビルド高速化対応（Issue #116）における計測手順・採用した最適化・トレードオフを記録するものです。

## 計測基盤

以下のコマンドで、変更前後の所要時間を比較可能にしています。

```bash
# 型チェック時間（TS7ネイティブコンパイラ）
pnpm run typecheck

# プロダクションビルド時間（Next.js 16.3 / Turbopack）
pnpm build

# ユニットテスト（Vitest）
pnpm test

# CI相当の型チェック + ビルド確認
# .github/workflows/build.yml で push/PR ごとに自動実行
```

同一環境（同一マシン、キャッシュ状態を揃える）で `Measure-Command` (Windows) や `time` (Unix) を用いて計測してください。

### 計測結果（開発環境での参考値）

| コマンド                                              | 所要時間（参考値） | 備考                                                    |
| ----------------------------------------------------- | ------------------ | ------------------------------------------------------- |
| `pnpm run typecheck`（TS7ネイティブ, `tsc --noEmit`） | 約1.5秒            | キャッシュ済み環境。TS7ネイティブコンパイラにより高速。 |

計測値は環境（CPU/ディスク/キャッシュ状態）に強く依存するため、絶対値よりも「変更前後の相対比較」を重視してください。

## 採用した最適化

### 1. 型チェックの独立実行・CI可視化

- `package.json` に `typecheck` スクリプト（`tsc --noEmit`）を追加。
- これまでビルドコマンド（`next build`）にのみ型チェックが内包されており、型チェック単体の所要時間を計測・CIで検証する手段がなかった。
- ビルド健全性をCIで継続検証するワークフロー案を `docs/ci/build.yml` として用意した。既存の `coverage.yml`（ユニットテスト）・`playwright.yml`（E2E）に加え、`typecheck` → `build` を実行するジョブを想定している。

> **手動追加が必要**: 本セッションで使用しているGitHub連携トークンには `workflow` スコープがなく、`.github/workflows/` 配下のファイルをpushできない制約がある。そのため、上記ファイルの内容をリポジトリ管理者が手動で `.github/workflows/build.yml` としてコピー・追加してください（GitHub Web UIでの新規作成、または `workflow` スコープを持つ認証情報でのpushで対応可能）。

**トレードオフ**: CI実行時間がわずかに増える（型チェック + ビルドの追加ジョブ）が、ビルド破壊をマージ前に検知できる利益が上回ると判断。

### 2. Turbopack（Next.js 16.3）

- Next.js 16 以降、`next dev` / `next build` は Turbopack がデフォルトであり、ファイルシステムキャッシュ（`turbopackFileSystemCacheForBuild` / `turbopackFileSystemCacheForDev`）も**デフォルトで有効**。
- 現状の `next.config.mjs` はこれらを無効化していないため、追加設定なしで恩恵を受けられる状態を維持している（今回のテストで無効化されていないことを保証）。
- 明示的に `experimental.turbopackFileSystemCacheForBuild: true` 等を追加することは、デフォルト動作の重複指定になるため見送った（既存デフォルトを損なわない最小差分の原則に基づく）。

**トレードオフ**: なし（デフォルト機能の維持確認のみ）。

### 3. TypeScript v7（`@typescript/native`）

- `tsconfig.json` は既に `incremental: true`, `skipLibCheck: true`, `isolatedModules: true` など、TS7下でも高速な設定になっている。
- 現状の設定を変更する具体的な高速化余地（計測に基づく明確な改善提案）は確認できなかったため、今回は変更を見送った。

## next-intl と Next.js 16.3 の `root params`（unstable_rootParams → next/root-params）

参考: https://next-intl.dev/blog/nextjs-root-params

next-intl のブログで紹介されている `next/root-params`（Next.js 16.3で追加）は、**URLの動的セグメント（例: `[locale]`）をルートレイアウトの配下で読み取れるようにする**機能で、主に「ロケールをURLセグメントとして扱うルーティング構成」において、以下の恩恵をもたらす：

1. `generateStaticParams` を使わずに、ロケール単位の静的レンダリングを実現できる
2. Next.jsのキャッシュ機構（`"use cache"` 等）とロケール解決がより密に統合される

### 本リポジトリでの適用可否の検討

本アプリの現在のルーティング構成を確認した結果、**`app/` 配下に `[locale]` のような動的セグメントは存在せず**、ロケールは Cookie（`NEXT_LOCALE`）と `Accept-Language` ヘッダーから `i18n/request.ts` の `getRequestConfig` 内で解決している（`i18n/locale.ts` の `resolveLocale`）。

`next/root-params` はルートレイアウト自体が動的セグメントを持つ場合にのみ意味を持つAPIであるため、**現状のルーティング構成（URLにロケールセグメントを持たない設計）には直接適用できない**。

適用するには `app/[locale]/...` へのルーティング構成の全面的な作り直しが必要となり、これは以下の理由から今回のスコープ外と判断した：

- 変更量が非常に大きくなり（既存の全ページ・全テスト・共有URL形式に影響）、「既存挙動を壊さない」という受け入れ条件に反するリスクが高い
- デッキ共有URL（`/deck/[shareId]`）等、既存の外部公開URL形式の互換性を損なう可能性がある
- ビルド速度改善という主目的に対して、投資対効果（リスク・変更量 対 効果）が見合わない

**結論**: 現行のURL構成（ロケールを含まない）を維持する限り、`next/root-params` によるビルド最適化の直接適用は行わない。将来、ロケールをURLセグメント化するルーティング刷新を行う際には、本ドキュメントを参照して `next/root-params` の採用を再検討すること。

## 既存挙動への影響

- `next.config.mjs` は変更なし（デフォルト動作を維持）。
- `i18n/request.ts` / `i18n/locale.ts` のロケール解決ロジックは変更なし。
- 追加したのは「計測・CI可視化のための独立した型チェックスクリプトとワークフロー」のみで、アプリケーションの実行時挙動（i18n・デッキ共有・OG画像生成）には影響しない。
