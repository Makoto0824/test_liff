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

    // サンプル吹き出しFlex Message
    const sampleMessage = {
      type: 'flex',
      altText: 'サンプル吹き出しメッセージ',
      contents: {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "これはサンプルの吹き出しメッセージです。",
              "wrap": true,
              "color": "#000000",
              "size": "md",
              "margin": "md"
            },
            {
              "type": "image",
              "url": "https://test-liff-nu.vercel.app/images/sample_fukidashi.png",
              "size": "full",
              "aspectRatio": "16:9",
              "margin": "md"
            }
          ],
          "paddingAll": "0px",
          "paddingTop": "20px",
          "paddingBottom": "0px"
        }
      }
    };

    // LINE Messaging APIでFlex Messageを送信
    await client.pushMessage(userId, sampleMessage);

    res.status(200).json({ 
      success: true, 
      message: 'Sample Flex Message sent successfully' 
    });

  } catch (error) {
    console.error('Sample Flex Message送信エラー:', error);
    res.status(500).json({ 
      error: 'Failed to send sample Flex Message',
      details: error.message 
    });
  }
};
