# Lefthook - Git Hooks Manager

このプロジェクトでは、Gitフックを管理するために [Lefthook](https://github.com/evilmartians/lefthook) を使用しています。

## 概要

Lefthookは、コミット前やプッシュ前に自動でlint、フォーマット、テストを実行し、コードの品質を保つためのツールです。

## 設定されているフック

### 1. pre-commit（コミット前）

コミット前に以下のチェックを**並列実行**します：

#### format（フォーマットチェック）

- **対象**: ステージングされた `.js, .jsx, .ts, .tsx, .json, .css, .md` ファイル
- **実行内容**: Prettierでフォーマットをチェック
- **自動修正**: 有効（`stage_fixed: true`）

#### lint（コードチェック）

- **対象**: ステージングされた `.js, .jsx, .ts, .tsx` ファイル
- **実行内容**: ESLintでコードをチェック

#### type-check（型チェック）

- **実行内容**: TypeScriptの型チェック（`tsc --noEmit`）

### 2. commit-msg（コミットメッセージ検証）

コミットメッセージが **Conventional Commits** フォーマットに従っているかチェックします。

#### フォーマット

```
<type>(<scope>): <subject>
```

#### 許可されるタイプ

- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードスタイルの変更（機能に影響なし）
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更
- `perf`: パフォーマンス改善
- `ci`: CI設定の変更
- `build`: ビルドシステムの変更
- `revert`: コミットの取り消し

#### 例

```bash
# 良い例
git commit -m "feat(auth): add login functionality"
git commit -m "fix(api): resolve timeout issue"
git commit -m "docs: update README"

# 悪い例
git commit -m "update"  # ❌ タイプがない
git commit -m "added new feature"  # ❌ フォーマットが違う
```

### 3. pre-push（プッシュ前）

プッシュ前に以下を実行します：

#### test（テスト実行）

- **実行内容**: すべてのテストを実行
- **注意**: プッシュ前にすべてのテストが通ることを確認

#### build-check（ビルドチェック）

- **実行内容**: プロダクションビルドが成功するか確認
- **注意**: ビルドエラーがないことを確認

## 使い方

### 通常のコミット

通常通りコミットするだけで、自動的にフックが実行されます：

```bash
# ファイルをステージング
git add .

# コミット（自動でlint、format、type-checkが実行される）
git commit -m "feat(user): add user profile page"
```

### フックをスキップする

緊急時など、フックをスキップする必要がある場合：

```bash
# すべてのフックをスキップ
LEFTHOOK=0 git commit -m "hotfix: urgent fix"

# または
git commit -m "hotfix: urgent fix" --no-verify
```

⚠️ **注意**: フックのスキップは緊急時のみ使用してください。

### 特定のフックのみ実行

```bash
# pre-commitフックを手動実行
npx lefthook run pre-commit

# commit-msgフックを手動実行（コミットメッセージファイルを指定）
npx lefthook run commit-msg .git/COMMIT_EDITMSG

# pre-pushフックを手動実行
npx lefthook run pre-push
```

### すべてのフックを実行

```bash
npx lefthook run --all-files
```

## トラブルシューティング

### フックが実行されない

1. lefthookが正しくインストールされているか確認：

```bash
npm run prepare
```

2. Gitフックが作成されているか確認：

```bash
ls -la .git/hooks/
# pre-commit, commit-msg, pre-pushが存在するはず
```

### フォーマットエラーで止まる

Prettierの自動修正が有効なので、以下を実行：

```bash
npm run format
git add .
git commit -m "style: apply formatting"
```

### 型エラーで止まる

型エラーを修正してから再度コミット：

```bash
npm run type-check
# エラーを確認して修正
```

### テストが失敗してプッシュできない

テストを修正してから再度プッシュ：

```bash
npm run test
# 失敗したテストを修正
```

### 一時的にフックをスキップしたい

```bash
# 今回のコミットのみスキップ
git commit -m "message" --no-verify

# または環境変数で制御
LEFTHOOK=0 git commit -m "message"
```

## 設定ファイル

### lefthook.yml

プロジェクトルートの `lefthook.yml` でフックの設定を管理しています。

```yaml
pre-commit:
  parallel: true # 並列実行で高速化
  commands:
    format:
      glob: '*.{js,jsx,ts,tsx,json,css,md}'
      run: npx prettier --check {staged_files}
      stage_fixed: true # 自動修正された変更をステージング
    lint:
      glob: '*.{js,jsx,ts,tsx}'
      run: npx eslint {staged_files}
    type-check:
      run: npm run type-check
```

### カスタマイズ

必要に応じて `lefthook.yml` を編集してフックをカスタマイズできます。

例: 特定のディレクトリのみチェック

```yaml
pre-commit:
  commands:
    lint:
      glob: 'src/**/*.{ts,tsx}' # srcディレクトリのみ
      run: npx eslint {staged_files}
```

## ベストプラクティス

### 1. 小さくコミットする

フックの実行時間を短縮するため、小さな単位でコミットしましょう。

### 2. コミット前に手動チェック

```bash
# コミット前に確認
npm run lint:fix
npm run format
npm run type-check
npm run test
```

### 3. Conventional Commitsを守る

一貫性のあるコミット履歴を保つため、Conventional Commitsフォーマットを守りましょう。

### 4. フックのスキップは最小限に

`--no-verify` の使用は緊急時のみにしましょう。

## CI/CDとの連携

Lefthookで実行されるチェックは、CI/CDでも実行されます。
ローカルで通らないコードは、CIでも失敗します。

```yaml
# GitHub Actions例
- name: Lint
  run: npm run lint

- name: Type Check
  run: npm run type-check

- name: Test
  run: npm run test

- name: Build
  run: npm run build
```

## 参考資料

- [Lefthook公式ドキュメント](https://github.com/evilmartians/lefthook)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Prettier公式ドキュメント](https://prettier.io/)
- [ESLint公式ドキュメント](https://eslint.org/)
