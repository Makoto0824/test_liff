// api/qr-scan.js
export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, scanResult } = req.body;

        // 環境変数からアクセストークンを取得
        const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        
        if (!ACCESS_TOKEN) {
            return res.status(500).json({ 
                error: 'Access token not configured',
                message: '環境変数 LINE_CHANNEL_ACCESS_TOKEN を設定してください'
            });
        }

        if (!userId || !scanResult) {
            return res.status(400).json({ 
                error: 'User ID and scan result are required',
                message: 'ユーザーIDとスキャン結果が必要です'
            });
        }

        console.log('QR Scan Result:', scanResult);

        let messagePayload = [];

        // URLが含まれているかチェック
        const urlPattern = /https?:\/\/[^\s]+/g;
        const urls = scanResult.value.match(urlPattern);

        if (urls && urls.length > 0) {
            // URLが見つかった場合 - 遷移ボタンを表示
            const url = urls[0];
            messagePayload = [
                {
                    type: 'template',
                    altText: 'QRコードにURLが含まれています',
                    template: {
                        type: 'buttons',
                        text: `🔍 QRコードスキャン結果\n\n📄 内容: ${scanResult.value}\n\n🌐 URLが検出されました！`,
                        actions: [
                            {
                                type: 'uri',
                                label: '🌐 ウェブページを開く',
                                uri: url
                            },
                            {
                                type: 'postback',
                                label: '📋 URLをコピー',
                                data: `copy_url=${encodeURIComponent(url)}`,
                                displayText: 'URLをコピーしました'
                            }
                        ]
                    }
                }
            ];
        } else {
            // URLが見つからない場合 - 通常のテキストメッセージ
            messagePayload = [
                {
                    type: 'text',
                    text: `QRコードが無事読み込まれました`
                }
            ];
        }

        console.log('Sending QR scan result to LINE API:', {
            userId,
            hasUrl: urls && urls.length > 0,
            messageCount: messagePayload.length
        });

        // Messaging APIにメッセージ送信
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: userId,
                messages: messagePayload
            })
        });

        if (response.ok) {
            console.log('QR scan result sent successfully');
            res.status(200).json({ 
                success: true, 
                message: 'QR scan result sent successfully',
                hasUrl: urls && urls.length > 0,
                timestamp: new Date().toISOString()
            });
        } else {
            const errorData = await response.text();
            console.error('LINE API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorData
            });
            res.status(response.status).json({ 
                error: 'Failed to send QR scan result via LINE API',
                details: errorData
            });
        }

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
} 