/**
 * テストデータ生成用のファクトリー関数
 * テスト内でモックデータを簡単に生成できるようにする
 */

// 営業担当者のファクトリー
export const createMockSales = (overrides?: Partial<MockSales>): MockSales => ({
  sales_id: 1,
  sales_name: '山田太郎',
  email: 'yamada@example.com',
  department: '営業1部',
  manager_id: 5,
  manager_name: '佐藤部長',
  hire_date: '2020-04-01',
  is_manager: false,
  is_active: true,
  created_at: '2020-04-01T00:00:00.000Z',
  updated_at: '2020-04-01T00:00:00.000Z',
  ...overrides,
});

// 顧客のファクトリー
export const createMockCustomer = (overrides?: Partial<MockCustomer>): MockCustomer => ({
  customer_id: 10,
  customer_name: '山田一郎',
  company_name: '株式会社ABC',
  industry: 'IT',
  address: '東京都千代田区1-1-1',
  phone: '03-1234-5678',
  email: 'yamada@abc.co.jp',
  sales_id: 1,
  sales_name: '山田太郎',
  is_active: true,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

// 日報のファクトリー
export const createMockReport = (overrides?: Partial<MockReport>): MockReport => ({
  report_id: 1,
  sales_id: 1,
  sales_name: '山田太郎',
  report_date: '2026-01-04',
  problem: 'B社の価格交渉が難航しています。',
  plan: 'A社への見積提出を予定しています。',
  status: 'draft',
  submitted_at: null,
  approved_at: null,
  approved_by: null,
  created_at: '2026-01-04T10:00:00.000Z',
  updated_at: '2026-01-04T10:00:00.000Z',
  ...overrides,
});

// 訪問記録のファクトリー
export const createMockVisit = (overrides?: Partial<MockVisit>): MockVisit => ({
  visit_id: 1,
  report_id: 1,
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
  ...overrides,
});

// コメントのファクトリー
export const createMockComment = (overrides?: Partial<MockComment>): MockComment => ({
  comment_id: 1,
  report_id: 1,
  sales_id: 5,
  sales_name: '佐藤部長',
  comment_type: 'problem',
  comment_text: '価格だけでなく、サポート体制の強みをアピールしてみてください。',
  created_at: '2026-01-04T19:00:00.000Z',
  updated_at: '2026-01-04T19:00:00.000Z',
  ...overrides,
});

// 型定義
export interface MockSales {
  sales_id: number;
  sales_name: string;
  email: string;
  department: string;
  manager_id: number | null;
  manager_name?: string;
  hire_date: string;
  is_manager: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockCustomer {
  customer_id: number;
  customer_name: string;
  company_name: string;
  industry: string;
  address?: string;
  phone?: string;
  email?: string;
  sales_id: number;
  sales_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockReport {
  report_id: number;
  sales_id: number;
  sales_name?: string;
  report_date: string;
  problem?: string;
  plan?: string;
  status: 'draft' | 'submitted' | 'approved';
  submitted_at: string | null;
  approved_at?: string | null;
  approved_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface MockVisit {
  visit_id: number;
  report_id: number;
  customer_id: number;
  customer_name?: string;
  company_name?: string;
  visit_time: string;
  visit_content: string;
  visit_result?: string;
  next_action?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MockComment {
  comment_id: number;
  report_id: number;
  sales_id: number;
  sales_name?: string;
  comment_type: 'problem' | 'plan';
  comment_text: string;
  created_at: string;
  updated_at: string;
}
