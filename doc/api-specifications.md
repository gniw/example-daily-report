# 営業日報システム API仕様書

## 目次

1. [概要](#概要)
2. [認証](#認証)
3. [共通仕様](#共通仕様)
4. [エンドポイント一覧](#エンドポイント一覧)
5. [認証API](#認証api)
6. [日報API](#日報api)
7. [訪問記録API](#訪問記録api)
8. [コメントAPI](#コメントapi)
9. [顧客マスタAPI](#顧客マスタapi)
10. [営業マスタAPI](#営業マスタapi)
11. [エラーレスポンス](#エラーレスポンス)

---

## 概要

### ベースURL

```
本番環境: https://api.sales-report.example.com/v1
開発環境: https://api-dev.sales-report.example.com/v1
ローカル: http://localhost:3000/api/v1
```

### プロトコル

- HTTPS（本番環境・開発環境）
- HTTP（ローカル環境のみ）

### データフォーマット

- リクエスト: JSON
- レスポンス: JSON

---

## 認証

### 認証方式

JWT（JSON Web Token）を使用したBearer認証

### 認証フロー

1. `/auth/login` エンドポイントでメールアドレスとパスワードを送信
2. 認証成功時、アクセストークンとリフレッシュトークンを取得
3. 以降のAPIリクエストでは、Authorizationヘッダーにアクセストークンを付与
4. アクセストークン期限切れ時は、リフレッシュトークンで新しいアクセストークンを取得

### トークンの有効期限

- アクセストークン: 1時間
- リフレッシュトークン: 30日

### 認証ヘッダー

```
Authorization: Bearer {access_token}
```

---

## 共通仕様

### HTTPメソッド

| メソッド | 用途                   |
| -------- | ---------------------- |
| GET      | リソースの取得         |
| POST     | リソースの作成         |
| PUT      | リソースの更新（全体） |
| PATCH    | リソースの部分更新     |
| DELETE   | リソースの削除         |

### HTTPステータスコード

| コード | 説明                                        |
| ------ | ------------------------------------------- |
| 200    | OK - 成功                                   |
| 201    | Created - 作成成功                          |
| 204    | No Content - 削除成功                       |
| 400    | Bad Request - リクエストが不正              |
| 401    | Unauthorized - 認証エラー                   |
| 403    | Forbidden - 権限エラー                      |
| 404    | Not Found - リソースが存在しない            |
| 409    | Conflict - データの競合                     |
| 422    | Unprocessable Entity - バリデーションエラー |
| 500    | Internal Server Error - サーバーエラー      |

### ページネーション

リスト取得APIでは以下のクエリパラメータでページネーション可能

| パラメータ | 型      | デフォルト | 説明                           |
| ---------- | ------- | ---------- | ------------------------------ |
| page       | integer | 1          | ページ番号                     |
| limit      | integer | 20         | 1ページあたりの件数（最大100） |

### ページネーションレスポンス形式

```json
{
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "limit": 20
  }
}
```

### 日時フォーマット

- ISO 8601形式: `YYYY-MM-DDTHH:mm:ss.sssZ`
- 例: `2026-01-05T10:30:00.000Z`

---

## エンドポイント一覧

### 認証API

| メソッド | エンドポイント  | 説明                   | 認証 |
| -------- | --------------- | ---------------------- | ---- |
| POST     | `/auth/login`   | ログイン               | 不要 |
| POST     | `/auth/logout`  | ログアウト             | 必要 |
| POST     | `/auth/refresh` | トークン更新           | 不要 |
| GET      | `/auth/me`      | 現在のユーザー情報取得 | 必要 |

### 日報API

| メソッド | エンドポイント         | 説明         | 認証             |
| -------- | ---------------------- | ------------ | ---------------- |
| GET      | `/reports`             | 日報一覧取得 | 必要             |
| GET      | `/reports/:id`         | 日報詳細取得 | 必要             |
| POST     | `/reports`             | 日報作成     | 必要             |
| PUT      | `/reports/:id`         | 日報更新     | 必要             |
| DELETE   | `/reports/:id`         | 日報削除     | 必要             |
| PATCH    | `/reports/:id/submit`  | 日報提出     | 必要             |
| PATCH    | `/reports/:id/approve` | 日報承認     | 必要（上長のみ） |

### 訪問記録API

| メソッド | エンドポイント               | 説明             | 認証 |
| -------- | ---------------------------- | ---------------- | ---- |
| GET      | `/reports/:report_id/visits` | 訪問記録一覧取得 | 必要 |
| POST     | `/reports/:report_id/visits` | 訪問記録作成     | 必要 |
| PUT      | `/visits/:id`                | 訪問記録更新     | 必要 |
| DELETE   | `/visits/:id`                | 訪問記録削除     | 必要 |

### コメントAPI

| メソッド | エンドポイント                 | 説明             | 認証             |
| -------- | ------------------------------ | ---------------- | ---------------- |
| GET      | `/reports/:report_id/comments` | コメント一覧取得 | 必要             |
| POST     | `/reports/:report_id/comments` | コメント作成     | 必要（上長のみ） |
| DELETE   | `/comments/:id`                | コメント削除     | 必要（上長のみ） |

### 顧客マスタAPI

| メソッド | エンドポイント   | 説明         | 認証 |
| -------- | ---------------- | ------------ | ---- |
| GET      | `/customers`     | 顧客一覧取得 | 必要 |
| GET      | `/customers/:id` | 顧客詳細取得 | 必要 |
| POST     | `/customers`     | 顧客作成     | 必要 |
| PUT      | `/customers/:id` | 顧客更新     | 必要 |
| DELETE   | `/customers/:id` | 顧客削除     | 必要 |

### 営業マスタAPI

| メソッド | エンドポイント | 説明         | 認証             |
| -------- | -------------- | ------------ | ---------------- |
| GET      | `/sales`       | 営業一覧取得 | 必要（上長のみ） |
| GET      | `/sales/:id`   | 営業詳細取得 | 必要             |
| POST     | `/sales`       | 営業作成     | 必要（上長のみ） |
| PUT      | `/sales/:id`   | 営業更新     | 必要（上長のみ） |
| DELETE   | `/sales/:id`   | 営業削除     | 必要（上長のみ） |

---

## 認証API

### POST /auth/login

ログイン

#### リクエスト

```json
{
  "email": "yamada@example.com",
  "password": "password123"
}
```

#### レスポンス (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "sales_id": 1,
    "sales_name": "山田太郎",
    "email": "yamada@example.com",
    "department": "営業1部",
    "is_manager": false
  }
}
```

#### エラーレスポンス (401 Unauthorized)

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません"
  }
}
```

---

### POST /auth/logout

ログアウト（トークンの無効化）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### レスポンス (204 No Content)

レスポンスボディなし

---

### POST /auth/refresh

アクセストークンの更新

#### リクエスト

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### レスポンス (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

### GET /auth/me

現在のログインユーザー情報取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### レスポンス (200 OK)

```json
{
  "sales_id": 1,
  "sales_name": "山田太郎",
  "email": "yamada@example.com",
  "department": "営業1部",
  "manager_id": 5,
  "manager_name": "佐藤部長",
  "hire_date": "2020-04-01",
  "is_manager": false,
  "is_active": true
}
```

---

## 日報API

### GET /reports

日報一覧取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### クエリパラメータ

| パラメータ | 型            | 必須 | 説明                                  |
| ---------- | ------------- | ---- | ------------------------------------- |
| start_date | string (date) | -    | 検索開始日 (YYYY-MM-DD)               |
| end_date   | string (date) | -    | 検索終了日 (YYYY-MM-DD)               |
| status     | string        | -    | ステータス (draft/submitted/approved) |
| sales_id   | integer       | -    | 営業ID（上長のみ指定可能）            |
| page       | integer       | -    | ページ番号（デフォルト: 1）           |
| limit      | integer       | -    | 1ページあたりの件数（デフォルト: 20） |

#### レスポンス (200 OK)

```json
{
  "data": [
    {
      "report_id": 123,
      "sales_id": 1,
      "sales_name": "山田太郎",
      "report_date": "2026-01-04",
      "status": "submitted",
      "visit_count": 3,
      "has_comments": true,
      "submitted_at": "2026-01-04T18:30:00.000Z",
      "created_at": "2026-01-04T10:00:00.000Z",
      "updated_at": "2026-01-04T18:30:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "limit": 20
  }
}
```

---

### GET /reports/:id

日報詳細取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 日報ID |

#### レスポンス (200 OK)

```json
{
  "report_id": 123,
  "sales_id": 1,
  "sales_name": "山田太郎",
  "report_date": "2026-01-04",
  "problem": "B社の価格交渉が難航しています。競合他社の見積が当社より20%安い状況です。",
  "plan": "- A社への見積提出\n- C社との定例ミーティング\n- B社価格交渉の上長相談",
  "status": "submitted",
  "submitted_at": "2026-01-04T18:30:00.000Z",
  "created_at": "2026-01-04T10:00:00.000Z",
  "updated_at": "2026-01-04T18:30:00.000Z",
  "visits": [
    {
      "visit_id": 456,
      "customer_id": 10,
      "customer_name": "山田一郎",
      "company_name": "株式会社ABC",
      "visit_time": "10:00",
      "visit_content": "新製品の提案を実施。機能説明とデモを行いました。",
      "visit_result": "好感触。見積依頼をいただきました。",
      "next_action": "1週間以内に見積提出",
      "display_order": 1,
      "created_at": "2026-01-04T10:00:00.000Z",
      "updated_at": "2026-01-04T10:00:00.000Z"
    },
    {
      "visit_id": 457,
      "customer_id": 11,
      "customer_name": "佐藤花子",
      "company_name": "株式会社DEF",
      "visit_time": "14:00",
      "visit_content": "定例ミーティング。現在の利用状況のヒアリング。",
      "visit_result": "特に問題なし。追加機能の要望あり。",
      "next_action": "要望内容を社内で検討",
      "display_order": 2,
      "created_at": "2026-01-04T14:00:00.000Z",
      "updated_at": "2026-01-04T14:00:00.000Z"
    }
  ],
  "comments": [
    {
      "comment_id": 789,
      "report_id": 123,
      "sales_id": 5,
      "sales_name": "佐藤部長",
      "comment_type": "problem",
      "comment_text": "価格だけでなく、サポート体制の強みをアピールしてみてください。",
      "created_at": "2026-01-04T19:00:00.000Z"
    }
  ]
}
```

#### エラーレスポンス (404 Not Found)

```json
{
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "指定された日報が見つかりません"
  }
}
```

---

### POST /reports

日報作成

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### リクエストボディ

```json
{
  "report_date": "2026-01-05",
  "problem": "本日は特に問題ありません。",
  "plan": "明日はA社とB社を訪問予定です。",
  "status": "draft"
}
```

#### リクエストパラメータ

| パラメータ  | 型            | 必須 | 説明                                           |
| ----------- | ------------- | ---- | ---------------------------------------------- |
| report_date | string (date) | ○    | 日報日付 (YYYY-MM-DD)                          |
| problem     | string        | -    | 課題・相談（1000文字以内）                     |
| plan        | string        | -    | 明日の予定（1000文字以内）                     |
| status      | string        | -    | ステータス (draft/submitted) デフォルト: draft |

#### レスポンス (201 Created)

```json
{
  "report_id": 124,
  "sales_id": 1,
  "sales_name": "山田太郎",
  "report_date": "2026-01-05",
  "problem": "本日は特に問題ありません。",
  "plan": "明日はA社とB社を訪問予定です。",
  "status": "draft",
  "submitted_at": null,
  "created_at": "2026-01-05T10:00:00.000Z",
  "updated_at": "2026-01-05T10:00:00.000Z"
}
```

#### エラーレスポンス (409 Conflict)

```json
{
  "error": {
    "code": "REPORT_ALREADY_EXISTS",
    "message": "指定された日付の日報は既に存在します"
  }
}
```

---

### PUT /reports/:id

日報更新

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 日報ID |

#### リクエストボディ

```json
{
  "problem": "B社との交渉について、上長に相談したいです。",
  "plan": "明日はA社とB社を訪問し、C社に見積を提出します。"
}
```

#### レスポンス (200 OK)

```json
{
  "report_id": 124,
  "sales_id": 1,
  "sales_name": "山田太郎",
  "report_date": "2026-01-05",
  "problem": "B社との交渉について、上長に相談したいです。",
  "plan": "明日はA社とB社を訪問し、C社に見積を提出します。",
  "status": "draft",
  "submitted_at": null,
  "created_at": "2026-01-05T10:00:00.000Z",
  "updated_at": "2026-01-05T15:00:00.000Z"
}
```

#### エラーレスポンス (403 Forbidden)

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "提出済みの日報は編集できません"
  }
}
```

---

### DELETE /reports/:id

日報削除

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 日報ID |

#### レスポンス (204 No Content)

レスポンスボディなし

#### エラーレスポンス (403 Forbidden)

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "提出済みの日報は削除できません"
  }
}
```

---

### PATCH /reports/:id/submit

日報提出

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 日報ID |

#### レスポンス (200 OK)

```json
{
  "report_id": 124,
  "status": "submitted",
  "submitted_at": "2026-01-05T18:00:00.000Z"
}
```

#### エラーレスポンス (422 Unprocessable Entity)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "訪問記録が1件も登録されていません"
  }
}
```

---

### PATCH /reports/:id/approve

日報承認（上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 日報ID |

#### レスポンス (200 OK)

```json
{
  "report_id": 124,
  "status": "approved",
  "approved_at": "2026-01-05T20:00:00.000Z",
  "approved_by": 5
}
```

#### エラーレスポンス (403 Forbidden)

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "日報を承認する権限がありません"
  }
}
```

---

## 訪問記録API

### GET /reports/:report_id/visits

訪問記録一覧取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| report_id  | integer | 日報ID |

#### レスポンス (200 OK)

```json
{
  "data": [
    {
      "visit_id": 456,
      "report_id": 123,
      "customer_id": 10,
      "customer_name": "山田一郎",
      "company_name": "株式会社ABC",
      "visit_time": "10:00",
      "visit_content": "新製品の提案を実施。",
      "visit_result": "好感触。見積依頼あり。",
      "next_action": "1週間以内に見積提出",
      "display_order": 1,
      "created_at": "2026-01-04T10:00:00.000Z",
      "updated_at": "2026-01-04T10:00:00.000Z"
    }
  ]
}
```

---

### POST /reports/:report_id/visits

訪問記録作成

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| report_id  | integer | 日報ID |

#### リクエストボディ

```json
{
  "customer_id": 10,
  "visit_time": "10:00",
  "visit_content": "新製品の提案を実施。機能説明とデモを行いました。",
  "visit_result": "好感触。見積依頼をいただきました。",
  "next_action": "1週間以内に見積提出",
  "display_order": 1
}
```

#### リクエストパラメータ

| パラメータ    | 型            | 必須 | 説明                              |
| ------------- | ------------- | ---- | --------------------------------- |
| customer_id   | integer       | ○    | 顧客ID                            |
| visit_time    | string (time) | ○    | 訪問時刻 (HH:MM)                  |
| visit_content | string        | ○    | 訪問内容（500文字以内）           |
| visit_result  | string        | -    | 訪問結果（500文字以内）           |
| next_action   | string        | -    | ネクストアクション（200文字以内） |
| display_order | integer       | -    | 表示順（デフォルト: 最後）        |

#### レスポンス (201 Created)

```json
{
  "visit_id": 456,
  "report_id": 123,
  "customer_id": 10,
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "visit_time": "10:00",
  "visit_content": "新製品の提案を実施。機能説明とデモを行いました。",
  "visit_result": "好感触。見積依頼をいただきました。",
  "next_action": "1週間以内に見積提出",
  "display_order": 1,
  "created_at": "2026-01-04T10:00:00.000Z",
  "updated_at": "2026-01-04T10:00:00.000Z"
}
```

---

### PUT /visits/:id

訪問記録更新

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### パスパラメータ

| パラメータ | 型      | 説明       |
| ---------- | ------- | ---------- |
| id         | integer | 訪問記録ID |

#### リクエストボディ

```json
{
  "customer_id": 10,
  "visit_time": "10:30",
  "visit_content": "新製品の提案を実施。機能説明とデモを行い、質疑応答も実施しました。",
  "visit_result": "非常に好感触。見積依頼をいただきました。",
  "next_action": "1週間以内に見積提出",
  "display_order": 1
}
```

#### レスポンス (200 OK)

```json
{
  "visit_id": 456,
  "report_id": 123,
  "customer_id": 10,
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "visit_time": "10:30",
  "visit_content": "新製品の提案を実施。機能説明とデモを行い、質疑応答も実施しました。",
  "visit_result": "非常に好感触。見積依頼をいただきました。",
  "next_action": "1週間以内に見積提出",
  "display_order": 1,
  "created_at": "2026-01-04T10:00:00.000Z",
  "updated_at": "2026-01-04T15:00:00.000Z"
}
```

---

### DELETE /visits/:id

訪問記録削除

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明       |
| ---------- | ------- | ---------- |
| id         | integer | 訪問記録ID |

#### レスポンス (204 No Content)

レスポンスボディなし

---

## コメントAPI

### GET /reports/:report_id/comments

コメント一覧取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| report_id  | integer | 日報ID |

#### クエリパラメータ

| パラメータ   | 型     | 必須 | 説明                        |
| ------------ | ------ | ---- | --------------------------- |
| comment_type | string | -    | コメント種別 (problem/plan) |

#### レスポンス (200 OK)

```json
{
  "data": [
    {
      "comment_id": 789,
      "report_id": 123,
      "sales_id": 5,
      "sales_name": "佐藤部長",
      "comment_type": "problem",
      "comment_text": "価格だけでなく、サポート体制の強みをアピールしてみてください。",
      "created_at": "2026-01-04T19:00:00.000Z"
    },
    {
      "comment_id": 790,
      "report_id": 123,
      "sales_id": 5,
      "sales_name": "佐藤部長",
      "comment_type": "plan",
      "comment_text": "B社との交渉は同行しますので、事前に状況を共有してください。",
      "created_at": "2026-01-04T19:05:00.000Z"
    }
  ]
}
```

---

### POST /reports/:report_id/comments

コメント作成（上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| report_id  | integer | 日報ID |

#### リクエストボディ

```json
{
  "comment_type": "problem",
  "comment_text": "価格だけでなく、サポート体制の強みをアピールしてみてください。"
}
```

#### リクエストパラメータ

| パラメータ   | 型     | 必須 | 説明                        |
| ------------ | ------ | ---- | --------------------------- |
| comment_type | string | ○    | コメント種別 (problem/plan) |
| comment_text | string | ○    | コメント内容（500文字以内） |

#### レスポンス (201 Created)

```json
{
  "comment_id": 789,
  "report_id": 123,
  "sales_id": 5,
  "sales_name": "佐藤部長",
  "comment_type": "problem",
  "comment_text": "価格だけでなく、サポート体制の強みをアピールしてみてください。",
  "created_at": "2026-01-04T19:00:00.000Z"
}
```

#### エラーレスポンス (403 Forbidden)

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "コメントを投稿する権限がありません"
  }
}
```

---

### DELETE /comments/:id

コメント削除（上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明       |
| ---------- | ------- | ---------- |
| id         | integer | コメントID |

#### レスポンス (204 No Content)

レスポンスボディなし

---

## 顧客マスタAPI

### GET /customers

顧客一覧取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### クエリパラメータ

| パラメータ    | 型      | 必須 | 説明                                  |
| ------------- | ------- | ---- | ------------------------------------- |
| customer_name | string  | -    | 顧客名（部分一致）                    |
| company_name  | string  | -    | 会社名（部分一致）                    |
| industry      | string  | -    | 業種                                  |
| sales_id      | integer | -    | 担当営業ID（上長のみ指定可能）        |
| is_active     | boolean | -    | 有効フラグ（デフォルト: true）        |
| page          | integer | -    | ページ番号（デフォルト: 1）           |
| limit         | integer | -    | 1ページあたりの件数（デフォルト: 20） |

#### レスポンス (200 OK)

```json
{
  "data": [
    {
      "customer_id": 10,
      "customer_name": "山田一郎",
      "company_name": "株式会社ABC",
      "industry": "IT",
      "address": "東京都千代田区1-1-1",
      "phone": "03-1234-5678",
      "email": "yamada@abc.co.jp",
      "sales_id": 1,
      "sales_name": "山田太郎",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_count": 50,
    "limit": 20
  }
}
```

---

### GET /customers/:id

顧客詳細取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 顧客ID |

#### レスポンス (200 OK)

```json
{
  "customer_id": 10,
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "industry": "IT",
  "address": "東京都千代田区1-1-1",
  "phone": "03-1234-5678",
  "email": "yamada@abc.co.jp",
  "sales_id": 1,
  "sales_name": "山田太郎",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### POST /customers

顧客作成

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### リクエストボディ

```json
{
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "industry": "IT",
  "address": "東京都千代田区1-1-1",
  "phone": "03-1234-5678",
  "email": "yamada@abc.co.jp",
  "sales_id": 1,
  "is_active": true
}
```

#### リクエストパラメータ

| パラメータ    | 型      | 必須 | 説明                                |
| ------------- | ------- | ---- | ----------------------------------- |
| customer_name | string  | ○    | 顧客名（50文字以内）                |
| company_name  | string  | ○    | 会社名（100文字以内）               |
| industry      | string  | ○    | 業種 (IT/製造/小売/サービス/その他) |
| address       | string  | -    | 住所（200文字以内）                 |
| phone         | string  | -    | 電話番号                            |
| email         | string  | -    | メールアドレス                      |
| sales_id      | integer | ○    | 担当営業ID                          |
| is_active     | boolean | -    | 有効フラグ（デフォルト: true）      |

#### レスポンス (201 Created)

```json
{
  "customer_id": 10,
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "industry": "IT",
  "address": "東京都千代田区1-1-1",
  "phone": "03-1234-5678",
  "email": "yamada@abc.co.jp",
  "sales_id": 1,
  "sales_name": "山田太郎",
  "is_active": true,
  "created_at": "2026-01-05T10:00:00.000Z",
  "updated_at": "2026-01-05T10:00:00.000Z"
}
```

---

### PUT /customers/:id

顧客更新

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 顧客ID |

#### リクエストボディ

```json
{
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "industry": "IT",
  "address": "東京都千代田区2-2-2",
  "phone": "03-1234-5678",
  "email": "yamada@abc.co.jp",
  "sales_id": 1,
  "is_active": true
}
```

#### レスポンス (200 OK)

```json
{
  "customer_id": 10,
  "customer_name": "山田一郎",
  "company_name": "株式会社ABC",
  "industry": "IT",
  "address": "東京都千代田区2-2-2",
  "phone": "03-1234-5678",
  "email": "yamada@abc.co.jp",
  "sales_id": 1,
  "sales_name": "山田太郎",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2026-01-05T15:00:00.000Z"
}
```

---

### DELETE /customers/:id

顧客削除（論理削除）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 顧客ID |

#### レスポンス (204 No Content)

レスポンスボディなし

---

## 営業マスタAPI

### GET /sales

営業一覧取得（上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### クエリパラメータ

| パラメータ | 型      | 必須 | 説明                                  |
| ---------- | ------- | ---- | ------------------------------------- |
| sales_name | string  | -    | 営業名（部分一致）                    |
| department | string  | -    | 部署                                  |
| is_active  | boolean | -    | 有効フラグ（デフォルト: true）        |
| page       | integer | -    | ページ番号（デフォルト: 1）           |
| limit      | integer | -    | 1ページあたりの件数（デフォルト: 20） |

#### レスポンス (200 OK)

```json
{
  "data": [
    {
      "sales_id": 1,
      "sales_name": "山田太郎",
      "email": "yamada@example.com",
      "department": "営業1部",
      "manager_id": 5,
      "manager_name": "佐藤部長",
      "hire_date": "2020-04-01",
      "is_manager": false,
      "is_active": true,
      "created_at": "2020-04-01T00:00:00.000Z",
      "updated_at": "2020-04-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_count": 30,
    "limit": 20
  }
}
```

---

### GET /sales/:id

営業詳細取得

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 営業ID |

#### レスポンス (200 OK)

```json
{
  "sales_id": 1,
  "sales_name": "山田太郎",
  "email": "yamada@example.com",
  "department": "営業1部",
  "manager_id": 5,
  "manager_name": "佐藤部長",
  "hire_date": "2020-04-01",
  "is_manager": false,
  "is_active": true,
  "created_at": "2020-04-01T00:00:00.000Z",
  "updated_at": "2020-04-01T00:00:00.000Z"
}
```

---

### POST /sales

営業作成（上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### リクエストボディ

```json
{
  "sales_name": "山田太郎",
  "email": "yamada@example.com",
  "password": "password123",
  "department": "営業1部",
  "manager_id": 5,
  "hire_date": "2020-04-01",
  "is_manager": false,
  "is_active": true
}
```

#### リクエストパラメータ

| パラメータ | 型            | 必須 | 説明                           |
| ---------- | ------------- | ---- | ------------------------------ |
| sales_name | string        | ○    | 営業名（50文字以内）           |
| email      | string        | ○    | メールアドレス（重複不可）     |
| password   | string        | ○    | パスワード（8文字以上）        |
| department | string        | ○    | 部署                           |
| manager_id | integer       | ○    | 上長ID                         |
| hire_date  | string (date) | ○    | 入社日 (YYYY-MM-DD)            |
| is_manager | boolean       | -    | 上長権限（デフォルト: false）  |
| is_active  | boolean       | -    | 有効フラグ（デフォルト: true） |

#### レスポンス (201 Created)

```json
{
  "sales_id": 1,
  "sales_name": "山田太郎",
  "email": "yamada@example.com",
  "department": "営業1部",
  "manager_id": 5,
  "manager_name": "佐藤部長",
  "hire_date": "2020-04-01",
  "is_manager": false,
  "is_active": true,
  "created_at": "2026-01-05T10:00:00.000Z",
  "updated_at": "2026-01-05T10:00:00.000Z"
}
```

#### エラーレスポンス (409 Conflict)

```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "このメールアドレスは既に使用されています"
  }
}
```

---

### PUT /sales/:id

営業更新（上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 営業ID |

#### リクエストボディ

```json
{
  "sales_name": "山田太郎",
  "email": "yamada@example.com",
  "password": "newpassword123",
  "department": "営業2部",
  "manager_id": 6,
  "hire_date": "2020-04-01",
  "is_manager": false,
  "is_active": true
}
```

#### 注意事項

- `password` フィールドは変更する場合のみ指定
- 省略した場合は現在のパスワードを維持

#### レスポンス (200 OK)

```json
{
  "sales_id": 1,
  "sales_name": "山田太郎",
  "email": "yamada@example.com",
  "department": "営業2部",
  "manager_id": 6,
  "manager_name": "高橋部長",
  "hire_date": "2020-04-01",
  "is_manager": false,
  "is_active": true,
  "created_at": "2020-04-01T00:00:00.000Z",
  "updated_at": "2026-01-05T15:00:00.000Z"
}
```

---

### DELETE /sales/:id

営業削除（論理削除、上長のみ）

#### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

#### パスパラメータ

| パラメータ | 型      | 説明   |
| ---------- | ------- | ------ |
| id         | integer | 営業ID |

#### レスポンス (204 No Content)

レスポンスボディなし

---

## エラーレスポンス

### エラーレスポンス形式

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": [
      {
        "field": "email",
        "message": "メールアドレスの形式が正しくありません"
      }
    ]
  }
}
```

### エラーコード一覧

#### 認証・認可エラー

| コード              | HTTPステータス | 説明                   |
| ------------------- | -------------- | ---------------------- |
| INVALID_CREDENTIALS | 401            | 認証情報が不正         |
| TOKEN_EXPIRED       | 401            | トークンの有効期限切れ |
| TOKEN_INVALID       | 401            | トークンが無効         |
| PERMISSION_DENIED   | 403            | 権限不足               |

#### バリデーションエラー

| コード                 | HTTPステータス | 説明             |
| ---------------------- | -------------- | ---------------- |
| VALIDATION_ERROR       | 422            | 入力値が不正     |
| REQUIRED_FIELD_MISSING | 422            | 必須項目が未入力 |
| INVALID_FORMAT         | 422            | 形式が不正       |
| VALUE_TOO_LONG         | 422            | 文字数超過       |

#### リソースエラー

| コード                | HTTPステータス | 説明                     |
| --------------------- | -------------- | ------------------------ |
| REPORT_NOT_FOUND      | 404            | 日報が見つからない       |
| CUSTOMER_NOT_FOUND    | 404            | 顧客が見つからない       |
| SALES_NOT_FOUND       | 404            | 営業担当者が見つからない |
| REPORT_ALREADY_EXISTS | 409            | 日報が既に存在           |
| EMAIL_ALREADY_EXISTS  | 409            | メールアドレスが既に存在 |

#### サーバーエラー

| コード                | HTTPステータス | 説明               |
| --------------------- | -------------- | ------------------ |
| INTERNAL_SERVER_ERROR | 500            | サーバー内部エラー |
| DATABASE_ERROR        | 500            | データベースエラー |
| SERVICE_UNAVAILABLE   | 503            | サービス利用不可   |

---

## 補足事項

### レート制限

- 1ユーザーあたり: 100リクエスト/分
- 超過時: 429 Too Many Requests

### CORS設定

- 許可オリジン: フロントエンドのドメインのみ
- 許可メソッド: GET, POST, PUT, PATCH, DELETE
- 許可ヘッダー: Content-Type, Authorization

### セキュリティ

- すべての通信はHTTPS（本番環境）
- パスワードはbcryptでハッシュ化
- SQLインジェクション対策: プリペアドステートメント使用
- XSS対策: 入力値のサニタイジング

### APIバージョニング

- URLパスにバージョン番号を含める（例: `/v1/reports`）
- 後方互換性のない変更時は新バージョンをリリース

### ログ

- すべてのAPIリクエストをログに記録
- エラー発生時はスタックトレースを記録
- 個人情報はマスキング処理
