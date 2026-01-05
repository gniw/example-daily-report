import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // テスト環境の設定
    environment: 'jsdom',

    // グローバルなテストAPI（describe, it, expectなど）を使用可能にする
    globals: true,

    // セットアップファイル
    setupFiles: ['./src/test/setup.ts'],

    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/.next/',
        '**/coverage/',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      // カバレッジの閾値（80%以上を目標）
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // テストファイルのパターン
    include: ['**/*.{test,spec}.{ts,tsx}'],

    // テストから除外するファイル
    exclude: ['node_modules', '.next', 'dist', 'build'],

    // テストのタイムアウト（ミリ秒）
    testTimeout: 10000,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
