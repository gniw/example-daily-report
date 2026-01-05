# Prisma Database Schema

このディレクトリには営業日報システムのデータベーススキーマ定義が含まれています。

## セットアップ

### 1. 環境変数の設定

プロジェクトルートの `.env` ファイルにデータベース接続情報を設定してください：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

### 2. Prisma Clientの生成

スキーマファイルからPrisma Clientを生成します：

```bash
npm run prisma:generate
```

または

```bash
npx prisma generate
```

### 3. マイグレーションの実行

データベースにテーブルを作成します：

```bash
npm run prisma:migrate
```

または

```bash
npx prisma migrate dev --name init
```

### 4. Prisma Studioの起動（オプション）

データベースの内容をGUIで確認・編集できます：

```bash
npm run prisma:studio
```

または

```bash
npx prisma studio
```

## スキーマ構成

現在のスキーマには以下のモデルが定義される予定です：

- **Sales** (営業マスタ) - Issue #2で実装予定
- **Customer** (顧客マスタ) - Issue #3で実装予定
- **DailyReport** (日報) - Issue #4で実装予定
- **VisitRecord** (訪問記録) - Issue #5で実装予定
- **Comment** (コメント) - Issue #6で実装予定

詳細は [要件定義書](../CLAUDE.md) を参照してください。

## マイグレーション

### 新しいマイグレーションの作成

スキーマを変更した後、以下のコマンドでマイグレーションを作成します：

```bash
npx prisma migrate dev --name <migration_name>
```

### 本番環境へのマイグレーション適用

```bash
npx prisma migrate deploy
```

### マイグレーションのロールバック

Prismaは自動的なロールバックをサポートしていません。
必要に応じて手動でSQLを実行するか、新しいマイグレーションを作成してください。

## トラブルシューティング

### データベースに接続できない

1. `.env` ファイルの `DATABASE_URL` が正しいか確認
2. PostgreSQLサーバーが起動しているか確認
3. ファイアウォールやネットワーク設定を確認

### マイグレーションが失敗する

1. データベースのバックアップを取得
2. `prisma migrate reset` でデータベースをリセット（開発環境のみ）
3. 問題のあるマイグレーションファイルを修正

### Prisma Clientが最新でない

スキーマを変更した後は必ず以下を実行してください：

```bash
npm run prisma:generate
```

## 参考リンク

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)
