import '@testing-library/jest-dom';
import React from 'react';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

import { server } from './mocks/server';

// テスト前にMSWサーバーを起動
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// テスト後にMSWサーバーを停止
afterAll(() => {
  server.close();
});

// Next.jsのルーター機能をモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Next.jsのImageコンポーネントをモック
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', props);
  },
}));

// 環境変数のモック
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
