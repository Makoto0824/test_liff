// api/send-message.js
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
        const { userId, messages, messageType = 'text' } = req.body;

        // 環境変数からアクセストークンを取得
        const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        
        if (!ACCESS_TOKEN) {
            return res.status(500).json({ 
                error: 'Access token not configured',
                message: '環境変数 LINE_CHANNEL_ACCESS_TOKEN を設定してください'
            });
        }

        if (!userId) {
            return res.status(400).json({ 
                error: 'User ID is required',
                message: 'ユーザーIDが必要です'
            });
        }

        let messagePayload;

        if (messageType === 'auto' && req.body.message) {
            // 自動メッセージ送信
            messagePayload = [
                {
                    type: 'text',
                    text: req.body.message
                }
            ];
        } else {
            // 挨拶選択ボタンのTemplate Message
            messagePayload = [
                {
                    type: 'template',
                    altText: '挨拶を選択してください',
                    template: {
                        type: 'buttons',
                        text: '🤖 こんにちは！\n今の気分で挨拶を選んでください😊',
                        actions: [
                            {
                                type: 'postback',
                                label: '🌅 おはよう',
                                data: 'greeting=morning',
                                displayText: 'おはよう'
                            },
                            {
                                type: 'postback',
                                label: '☀️ こんにちは',
                                data: 'greeting=afternoon',
                                displayText: 'こんにちは'
                            },
                            {
                                type: 'postback',
                                label: '🌙 こんばんは',
                                data: 'greeting=evening',
                                displayText: 'こんばんは'
                            }
                        ]
                    }
                }
            ];
        }

        console.log('Prepared Template Message:', JSON.stringify(messagePayload, null, 2));

        console.log('Sending message to LINE API:', {
            userId,
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
            console.log('Message sent successfully');
            res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully via Messaging API',
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
                error: 'Failed to send message via LINE API',
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