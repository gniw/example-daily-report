import { ReactElement, ReactNode } from 'react';

import { render, RenderOptions } from '@testing-library/react';

/**
 * カスタムレンダー関数
 * 必要なプロバイダーでラップしてコンポーネントをレンダリング
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // 将来的に認証プロバイダーやテーマプロバイダーを追加する場合はここに追加
}

function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {/* ここに必要なプロバイダーを追加 */}
      {/* 例: <ThemeProvider>, <AuthProvider> など */}
      {children}
    </>
  );
}

export function customRender(ui: ReactElement, options?: CustomRenderOptions) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Testing Libraryの全エクスポートを再エクスポート
export * from '@testing-library/react';

// カスタムレンダー関数をrenderとしてエクスポート（上書き）
export { customRender as render };
