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

    // 受け取り確認Flex Message
    const confirmationMessage = {
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
              "text": "受け取りましたか？",
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

    // LINE Messaging APIで送信
    await client.pushMessage(userId, confirmationMessage);

    res.status(200).json({ 
      success: true, 
      message: 'Confirmation message sent successfully' 
    });

  } catch (error) {
    console.error('Confirmation message送信エラー:', error);
    res.status(500).json({ 
      error: 'Failed to send confirmation message',
      details: error.message 
    });
  }
}; 