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
    } else if (data.includes('copy_url=')) {
        // URLコピーのpostback処理
        const url = decodeURIComponent(data.split('=')[1]);
        replyMessage = {
            type: 'text',
            text: `📋 URLをコピーしました！\n\n🌐 ${url}\n\nこのURLをブラウザに貼り付けてアクセスしてください。`
        };
    } else if (data.includes('coupon=catrip_ueno')) {
        // 一括で受け取るボタンのpostback処理
        replyMessage = {
            type: 'flex',
            altText: '受け取り確認',
            contents: {
                "type": "bubble",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "受け取り確認",
                            "weight": "bold",
                            "size": "lg",
                            "align": "center"
                        },
                        {
                            "type": "text",
                            "text": "クーポンを受け取りましたか？",
                            "size": "sm",
                            "color": "#666666",
                            "align": "center",
                            "margin": "md"
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "button",
                            "style": "primary",
                            "height": "sm",
                            "action": {
                                "type": "postback",
                                "label": "受け取ったよ！",
                                "data": "confirm=received&message=これはダミーテキストです。ここに文章が入ります。これはダミーテキストです。ここに文章が入ります。これはダミーテキストです。ここに文章が入ります。これはダミーテキストです。ここに文章が入ります。",
                                "displayText": "受け取ったよ！"
                            }
                        }
                    ],
                    "flex": 0
                }
            }
        };
    } else if (data.includes('confirm=received')) {
        // 受け取ったよ！ボタンのpostback処理
        const messageMatch = data.match(/&message=(.+)/);
        if (messageMatch) {
            const message = decodeURIComponent(messageMatch[1]);
            replyMessage = {
                type: 'text',
                text: message
            };
        } else {
            replyMessage = {
                type: 'text',
                text: 'ありがとうございます！'
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
    
    // トリガーワード辞書
    const triggerResponses = {
        'なんだちみは？': 'なんだちみはってか？',
        'なんだちみは?': 'なんだちみはってか？',  // 全角・半角対応
        'なんだちみは': 'なんだちみはってか？',     // 「？」なしも対応
        
        // 他のトリガーワードも簡単に追加可能
        // 'トリガーワード': '返信メッセージ',
        // 'こんにちは': 'こんにちは！元気ですか？',
        // 'おつかれ': 'お疲れ様です！'
    };
    
    // トリガーワードをチェック
    let replyMessage = null;
    
    for (const [trigger, response] of Object.entries(triggerResponses)) {
        if (userMessage === trigger || userMessage.includes(trigger)) {
            replyMessage = {
                type: 'text',
                text: response
            };
            console.log(`Triggered by: "${trigger}" -> Response: "${response}"`);
            break;
        }
    }
    
    // トリガーワードが見つからない場合は返信しない
    if (replyMessage) {
        await sendMessage(userId, [replyMessage], accessToken);
    } else {
        console.log('No trigger word found, no response sent');
    }
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