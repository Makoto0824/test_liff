const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // シンプルなテキストFlex Message
    const dummyMessage = {
      type: 'flex',
      altText: 'ダミーテキスト',
      contents: {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "ダミーメッセージ",
              "weight": "bold",
              "size": "lg",
              "color": "#1DB446"
            },
            {
              "type": "text",
              "text": "これはダミーのテキストです。ここに文章が入ります。",
              "size": "md",
              "color": "#666666",
              "wrap": true,
              "margin": "md"
            }
          ]
        }
      }
    };

    // LINE Messaging APIでFlex Messageを送信
    await client.pushMessage(userId, dummyMessage);

    res.status(200).json({ 
      success: true, 
      message: 'Dummy Flex Message sent successfully' 
    });

  } catch (error) {
    console.error('Dummy Flex Message送信エラー:', error);
    res.status(500).json({ 
      error: 'Failed to send dummy Flex Message',
      details: error.message 
    });
  }
}; 