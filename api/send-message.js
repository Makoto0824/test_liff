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

        if (messageType === 'flex') {
            // Flex Message
            const currentTime = new Date().toLocaleString('ja-JP');
            messagePayload = [
                {
                    type: 'flex',
                    altText: 'LIFFテストアプリからのメッセージ',
                    contents: {
                        type: 'bubble',
                        header: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: '🧩 謎解きゲーム',
                                    weight: 'bold',
                                    color: '#ffffff',
                                    size: 'lg'
                                }
                            ],
                            backgroundColor: '#667eea',
                            paddingAll: '20px'
                        },
                        body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: '🎮 謎解きゲーム開始！',
                                    weight: 'bold',
                                    size: 'md',
                                    wrap: true
                                },
                                {
                                    type: 'separator',
                                    margin: 'md'
                                },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    margin: 'md',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'baseline',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '送信時刻:',
                                                    color: '#666666',
                                                    size: 'sm',
                                                    flex: 3
                                                },
                                                {
                                                    type: 'text',
                                                    text: currentTime,
                                                    wrap: true,
                                                    size: 'sm',
                                                    flex: 5
                                                }
                                            ]
                                        },
                                        {
                                            type: 'box',
                                            layout: 'baseline',
                                            margin: 'sm',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: 'ステータス:',
                                                    color: '#666666',
                                                    size: 'sm',
                                                    flex: 3
                                                },
                                                {
                                                    type: 'text',
                                                    text: '✅ ゲーム開始準備完了',
                                                    color: '#00C851',
                                                    size: 'sm',
                                                    flex: 5
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            paddingAll: '20px'
                        }
                    }
                }
            ];
        } else {
            // Simple text message
            messagePayload = messages || [
                {
                    type: 'text',
                    text: `🎮 謎解きゲーム開始！\n\n📅 開始時刻: ${new Date().toLocaleString('ja-JP')}\n✅ ステータス: ゲーム準備完了`
                }
            ];
        }

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