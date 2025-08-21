const flexMessage = require('./flex-message');
const sampleFlexMessage = require('./sample-flex-message');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: userId,
                messages: [
                    {
                        type: 'flex',
                        altText: 'サンプル吹き出しメッセージ',
                        contents: sampleFlexMessage
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LINE API Error:', errorText);
            return res.status(response.status).json({ error: 'Failed to send message' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
