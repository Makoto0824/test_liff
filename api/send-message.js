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
        const { userId, message } = req.body;

        // 環境変数からアクセストークンを取得
        const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        
        if (!ACCESS_TOKEN) {
            return res.status(500).json({ error: 'Access token not configured' });
        }

        // Messaging APIにメッセージ送信
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: userId,
                messages: [
                    {
                        type: 'text',
                        text: message
                    }
                ]
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        } else {
            const errorData = await response.text();
            console.error('LINE API Error:', errorData);
            res.status(response.status).json({ error: 'Failed to send message' });
        }

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}