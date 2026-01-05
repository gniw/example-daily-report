# テスト環境

このディレクトリには、プロジェクトのテスト環境の設定とユーティリティが含まれています。

## 構成

```
src/test/
├── README.md              # このファイル
├── setup.ts              # テストのグローバルセットアップ
├── utils.tsx             # テストユーティリティ
├── factories/            # テストデータファクトリー
│   └── index.ts
└── mocks/                # APIモック
    ├── server.ts         # MSWサーバー設定
    └── handlers.ts       # APIハンドラー定義
```

## 使用技術

- **Vitest**: テストランナー
- **React Testing Library**: Reactコンポーネントのテスト
- **@testing-library/jest-dom**: DOMマッチャー
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション
- **MSW (Mock Service Worker)**: APIモック
- **jsdom**: ブラウザ環境のシミュレーション

## テストの書き方

### 基本的なコンポーネントテスト

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('正しくレンダリングされる', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### ユーザーインタラクションのテスト

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('クリック時にonClickが呼ばれる', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>クリック</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### APIモックを使用したテスト

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { MyComponent } from './MyComponent';

describe('MyComponent with API', () => {
  it('APIからデータを取得して表示する', async () => {
    // 特定のテストケースでのみモックを上書き
    server.use(
      http.get('/api/v1/data', () => {
        return HttpResponse.json({ message: 'テストデータ' });
      })
    );

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText('テストデータ')).toBeInTheDocument();
    });
  });
});
```

### テストデータファクトリーの使用

```typescript
import { createMockReport, createMockCustomer } from '@/test/factories';

describe('Report', () => {
  it('日報データを正しく表示する', () => {
    // デフォルト値を使用
    const report = createMockReport();

    // 特定の値を上書き
    const customReport = createMockReport({
      status: 'approved',
      problem: 'カスタム問題',
    });

    // テストロジック...
  });
});
```

## テストの実行

```bash
# すべてのテストを実行
npm run test

# テストをウォッチモードで実行
npm run test -- --watch

# テストUIを起動
npm run test:ui

# カバレッジを計測
npm run test:coverage

# 特定のファイルのみテスト
npm run test -- Button.test.tsx

# 特定のテストケースのみ実行
npm run test -- -t "クリック時にonClickが呼ばれる"
```

## ベストプラクティス

### 1. テストの構造

```typescript
describe('ComponentName', () => {
  describe('機能グループ1', () => {
    it('具体的な振る舞いをテストする', () => {
      // Arrange（準備）
      // Act（実行）
      // Assert（検証）
    });
  });
});
```

### 2. アクセシビリティを考慮したクエリ

優先順位：

1. `getByRole` - アクセシビリティを考慮（推奨）
2. `getByLabelText` - フォーム要素向け
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` - 最後の手段

### 3. 非同期処理の扱い

```typescript
// waitForを使用（推奨）
await waitFor(() => {
  expect(screen.getByText('読み込み完了')).toBeInTheDocument();
});

// findByを使用（要素が表示されるまで待つ）
const element = await screen.findByText('読み込み完了');
expect(element).toBeInTheDocument();
```

### 4. テストの独立性

- 各テストは独立して実行可能であること
- テスト間で状態を共有しない
- `afterEach` でクリーンアップが自動実行される

### 5. 意味のあるアサーション

❌ **悪い例:**

```typescript
expect(true).toBe(true); // 意味がない
```

✅ **良い例:**

```typescript
expect(screen.getByRole('button')).toBeEnabled();
expect(result).toEqual(expectedValue);
```

### 6. モックの使用

```typescript
// 関数のモック
const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: 'test' });

// モジュールのモック
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(),
}));
```

## カバレッジ目標

- **行カバレッジ**: 80%以上
- **関数カバレッジ**: 80%以上
- **分岐カバレッジ**: 80%以上
- **ステートメントカバレッジ**: 80%以上

カバレッジが閾値を下回るとテストが失敗します（`vitest.config.ts` で設定）。

## トラブルシューティング

### テストが遅い

```bash
# 並列実行数を調整
npm run test -- --pool=threads --poolOptions.threads.maxThreads=4
```

### モックがリセットされない

各テスト後に `server.resetHandlers()` が自動実行されます。
特定のテストでのみモックを変更する場合は `server.use()` を使用してください。

### 型エラーが出る

`tsconfig.json` の `types` に `vitest/globals` が含まれているか確認してください。

## 参考資料

- [Vitest公式ドキュメント](https://vitest.dev/)
- [React Testing Library公式ドキュメント](https://testing-library.com/react)
- [MSW公式ドキュメント](https://mswjs.io/)
- [Testing Library クエリ優先順位](https://testing-library.com/docs/queries/about/#priority)
