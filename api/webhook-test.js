// api/webhook-test.js - Webhook接続テスト用
export default async function handler(req, res) {
    console.log('Webhook test endpoint accessed');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // 基本的なレスポンス
    res.status(200).json({
        success: true,
        message: 'Webhook test endpoint is working',
        timestamp: new Date().toISOString(),
        method: req.method,
        hasBody: !!req.body,
        events: req.body?.events?.length || 0
    });
} 