# LIFF Test App with Messaging API

LIFF アプリと Messaging API を使ったテストアプリケーションです。

## 🚀 機能

- **LIFF SDK**: ユーザープロフィール取得、アプリ操作
- **Messaging API**: サーバー経由でのメッセージ送信
- **Flex Message**: リッチなメッセージ形式に対応

## 📋 セットアップ手順

### 1. LINE Developer Console 設定

1. [LINE Developer Console](https://developers.line.biz/console/) にアクセス
2. 新しいプロバイダーを作成（既存のものを使用可）
3. Messaging API チャネルを作成
4. **チャネルアクセストークン**を発行・取得

### 2. 環境変数設定

#### ローカル開発の場合

```bash
# .env ファイルを作成
cp env.example .env

# .env ファイルを編集して、チャネルアクセストークンを設定
LINE_CHANNEL_ACCESS_TOKEN=あなたのチャネルアクセストークン
```

#### Vercel デプロイの場合

1. Vercel ダッシュボードで Environment Variables を設定
2. `LINE_CHANNEL_ACCESS_TOKEN` にチャネルアクセストークンを設定

### 3. LIFF ID 設定

`index.html` の以下の部分を修正：

```javascript
const LIFF_ID = "あなたのLIFF_ID";
```

## 🛠 開発

```bash
# 依存関係インストール
npm install

# ローカル開発サーバー起動
vercel dev
```

## 📁 ファイル構成

```
test_liff/
├── index.html          # フロントエンド（LIFFアプリ）
├── api/
│   └── send-message.js # Messaging APIエンドポイント
├── package.json        # プロジェクト設定
├── env.example         # 環境変数サンプル
└── README.md          # このファイル
```

## 🔧 API 仕様

### POST /api/send-message

Messaging API を使ってメッセージを送信します。

**リクエスト:**

```json
{
  "userId": "ユーザーID",
  "messageType": "text" | "flex",
  "messages": [...] // オプション
}
```

**レスポンス:**

```json
{
  "success": true,
  "message": "Message sent successfully via Messaging API",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📱 使用方法

1. LINE アプリで LIFF アプリを開く
2. 「💬 メッセージ送信」ボタンをタップ
3. Messaging API 経由でメッセージが送信される
4. トーク画面に Flex Message が表示される

## ⚠️ 注意事項

- Messaging API はサーバーサイドでのみ動作します
- チャネルアクセストークンは絶対に公開しないでください
- LIFF アプリは LINE アプリ内で動作する必要があります

## �� ライセンス

MIT License
