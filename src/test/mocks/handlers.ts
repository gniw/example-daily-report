import { http, HttpResponse } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * APIモックのハンドラー定義
 * 各エンドポイントごとにモックレスポンスを定義
 */
export const handlers = [
  // 認証API: ログイン
  http.post(`${BASE_URL}/v1/auth/login`, async () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        sales_id: 1,
        sales_name: '山田太郎',
        email: 'yamada@example.com',
        department: '営業1部',
        is_manager: false,
      },
    });
  }),

  // 認証API: ログアウト
  http.post(`${BASE_URL}/v1/auth/logout`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // 認証API: トークン更新
  http.post(`${BASE_URL}/v1/auth/refresh`, async () => {
    return HttpResponse.json({
      access_token: 'new-mock-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
    });
  }),

  // 認証API: ユーザー情報取得
  http.get(`${BASE_URL}/v1/auth/me`, async () => {
    return HttpResponse.json({
      sales_id: 1,
      sales_name: '山田太郎',
      email: 'yamada@example.com',
      department: '営業1部',
      manager_id: 5,
      manager_name: '佐藤部長',
      hire_date: '2020-04-01',
      is_manager: false,
      is_active: true,
    });
  }),

  // 日報API: 一覧取得
  http.get(`${BASE_URL}/v1/reports`, async () => {
    return HttpResponse.json({
      data: [
        {
          report_id: 1,
          sales_id: 1,
          sales_name: '山田太郎',
          report_date: '2026-01-04',
          status: 'submitted',
          visit_count: 3,
          has_comments: true,
          submitted_at: '2026-01-04T18:30:00.000Z',
          created_at: '2026-01-04T10:00:00.000Z',
          updated_at: '2026-01-04T18:30:00.000Z',
        },
      ],
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: 1,
        limit: 20,
      },
    });
  }),

  // 日報API: 詳細取得
  http.get(`${BASE_URL}/v1/reports/:id`, async () => {
    return HttpResponse.json({
      report_id: 1,
      sales_id: 1,
      sales_name: '山田太郎',
      report_date: '2026-01-04',
      problem: 'B社の価格交渉が難航しています。',
      plan: 'A社への見積提出を予定しています。',
      status: 'submitted',
      submitted_at: '2026-01-04T18:30:00.000Z',
      created_at: '2026-01-04T10:00:00.000Z',
      updated_at: '2026-01-04T18:30:00.000Z',
      visits: [
        {
          visit_id: 1,
          customer_id: 10,
          customer_name: '山田一郎',
          company_name: '株式会社ABC',
          visit_time: '10:00',
          visit_content: '新製品の提案を実施。',
          visit_result: '好感触。見積依頼あり。',
          next_action: '1週間以内に見積提出',
          display_order: 1,
          created_at: '2026-01-04T10:00:00.000Z',
          updated_at: '2026-01-04T10:00:00.000Z',
        },
      ],
      comments: [],
    });
  }),

  // 日報API: 作成
  http.post(`${BASE_URL}/v1/reports`, async () => {
    return HttpResponse.json(
      {
        report_id: 2,
        sales_id: 1,
        sales_name: '山田太郎',
        report_date: '2026-01-05',
        problem: '',
        plan: '',
        status: 'draft',
        submitted_at: null,
        created_at: '2026-01-05T10:00:00.000Z',
        updated_at: '2026-01-05T10:00:00.000Z',
      },
      { status: 201 }
    );
  }),

  // 顧客API: 一覧取得
  http.get(`${BASE_URL}/v1/customers`, async () => {
    return HttpResponse.json({
      data: [
        {
          customer_id: 10,
          customer_name: '山田一郎',
          company_name: '株式会社ABC',
          industry: 'IT',
          sales_id: 1,
          sales_name: '山田太郎',
          is_active: true,
        },
      ],
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: 1,
        limit: 20,
      },
    });
  }),

  // エラーハンドリングのテスト用
  http.get(`${BASE_URL}/v1/test-error`, async () => {
    return HttpResponse.json(
      {
        error: {
          code: 'TEST_ERROR',
          message: 'テストエラー',
        },
      },
      { status: 500 }
    );
  }),
];
