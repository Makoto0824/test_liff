// api/webhook.js - LINE Webhook受信エンドポイント
export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Line-Signature');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Webhook received:', {
            method: req.method,
            headers: req.headers,
            body: req.body
        });

        const { events } = req.body;
        
        // 環境変数からアクセストークンを取得
        const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        
        if (!ACCESS_TOKEN) {
            console.error('Access token not configured');
            return res.status(500).json({ error: 'Access token not configured' });
        }

        if (!events || events.length === 0) {
            console.log('No events in webhook');
            return res.status(200).json({ success: true, message: 'No events' });
        }

        // 各イベントを処理
        for (const event of events) {
            console.log('Processing event:', JSON.stringify(event, null, 2));

            if (event.type === 'postback') {
                console.log('Handling postback event');
                await handlePostback(event, ACCESS_TOKEN);
            } else if (event.type === 'message') {
                console.log('Handling message event');
                await handleMessage(event, ACCESS_TOKEN);
            } else {
                console.log('Unknown event type:', event.type);
            }
        }

        res.status(200).json({ success: true, processedEvents: events.length });

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Postbackイベントを処理
async function handlePostback(event, accessToken) {
    const { data } = event.postback;
    const userId = event.source.userId;
    
    console.log('Postback data:', data);
    
    let replyMessage;
    
    if (data.includes('greeting=')) {
        const greeting = data.split('=')[1];
        
        switch (greeting) {
            case 'morning':
                replyMessage = {
                    type: 'text',
                    text: '🌅 おはようございます！\n今日も素敵な一日になりそうですね😊\n\n他にも話しかけてくださいね！'
                };
                break;
            case 'afternoon':
                replyMessage = {
                    type: 'text',
                    text: '☀️ こんにちは！\nお疲れ様です！良い午後をお過ごしくださいね😊\n\n他にも話しかけてくださいね！'
                };
                break;
            case 'evening':
                replyMessage = {
                    type: 'text',
                    text: '🌙 こんばんは！\n今夜はどんな時間をお過ごしですか？😊\n\n他にも話しかけてくださいね！'
                };
                break;
            default:
                replyMessage = {
                    type: 'text',
                    text: '🤖 こんにちは！何かお手伝いできることはありますか？'
                };
        }
    }

    // Messaging APIでレスポンス送信
    if (replyMessage) {
        await sendMessage(userId, [replyMessage], accessToken);
    }
}

// テキストメッセージを処理
async function handleMessage(event, accessToken) {
    if (event.message.type !== 'text') return;
    
    const userId = event.source.userId;
    const userMessage = event.message.text;
    
    console.log('User message:', userMessage);
    
    // シンプルな応答例
    let replyMessage = {
        type: 'text',
        text: `「${userMessage}」ですね！\n\n🤖 まだ簡単な会話しかできませんが、\nどんどん話しかけてください😊`
    };
    
    // 特定のキーワードに応答
    if (userMessage.includes('元気')) {
        replyMessage = {
            type: 'text',
            text: '💪 元気ですよ！ありがとうございます😊\nあなたも元気そうで良かったです！'
        };
    } else if (userMessage.includes('ありがとう')) {
        replyMessage = {
            type: 'text',
            text: '😊 どういたしまして！\nお役に立てて嬉しいです✨'
        };
    }
    
    await sendMessage(userId, [replyMessage], accessToken);
}

// メッセージ送信関数
async function sendMessage(userId, messages, accessToken) {
    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                to: userId,
                messages: messages
            })
        });

        if (response.ok) {
            console.log('Response message sent successfully');
        } else {
            const errorData = await response.text();
            console.error('LINE API Error:', errorData);
        }
    } catch (error) {
        console.error('Send message error:', error);
    }
} 