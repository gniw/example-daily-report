import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * MSW (Mock Service Worker) サーバーのセットアップ
 * テスト環境でAPIリクエストをインターセプトしてモックレスポンスを返す
 */
export const server = setupServer(...handlers);
