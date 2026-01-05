# 営業日報システム (Sales Daily Report System)

営業担当者が日々の顧客訪問活動を報告し、課題や計画を共有するシステム。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Next.js (App Router)
- **UIコンポーネント**: shadcn/ui + Tailwind CSS
- **APIスキーマ定義**: OpenAPI (Zod による検証)
- **DBスキーマ定義**: Prisma.js
- **テスト**: Vitest
- **デプロイ**: Google Cloud Run

## 必要な環境

- Node.js >= 18.0.0
- npm >= 9.0.0

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sales_report"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# App
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. データベースのセットアップ

```bash
# Prismaのマイグレーション実行
npx prisma migrate dev

# シードデータの投入（オプション）
npx prisma db seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

## 開発コマンド

### リンティング・フォーマット

```bash
# ESLintによるコードチェック
npm run lint

# ESLintによる自動修正
npm run lint:fix

# Prettierによるフォーマット
npm run format

# Prettierによるフォーマットチェック
npm run format:check

# TypeScriptの型チェック
npm run type-check
```

### テスト

```bash
# テスト実行
npm run test

# テストUI起動
npm run test:ui

# カバレッジ計測
npm run test:coverage
```

### ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start
```

## プロジェクト構造

```
.
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/             # ユーティリティ・ヘルパー
│   ├── types/           # TypeScript型定義
│   └── styles/          # グローバルスタイル
├── prisma/              # Prismaスキーマ・マイグレーション
├── public/              # 静的ファイル
├── doc/                 # ドキュメント
│   ├── screen-definitions.md
│   ├── api-specifications.md
│   └── test-specifications.md
├── CLAUDE.md            # 要件定義書・ER図
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## コーディング規約

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従う：

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの変更
style: コードスタイルの変更（機能に影響なし）
refactor: リファクタリング
test: テストの追加・修正
chore: ビルドプロセスやツールの変更
```

### コードスタイル

- ESLint・Prettier の設定に従う
- コミット前に `npm run lint:fix` と `npm run format` を実行
- 型定義は明示的に記述（`any` の使用は最小限に）

## ドキュメント

- [要件定義書・ER図](./CLAUDE.md)
- [画面定義書](./doc/screen-definitions.md)
- [API仕様書](./doc/api-specifications.md)
- [テスト仕様書](./doc/test-specifications.md)

## ライセンス

Private
