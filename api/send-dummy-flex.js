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
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "これはダミーのテキストです。ここに文章が入ります。これはダミーのテキストです。ここに文章が入ります。これはダミーのテキストです。ここに文章が入ります。これはダミーのテキストです。ここに文章が入ります。",
                  "size": "md",
                  "color": "#666666",
                  "wrap": true,
                  "margin": "md"
                }
              ],
              "paddingAll": "20px"
            },
            {
              "type": "image",
              "url": "https://test-liff-nu.vercel.app/images/catrip_test_nobi_A.jpg",
              "size": "full",
              "aspectRatio": "256:171",
              "aspectMode": "cover",
              "margin": "none"
            }
          ],
          "paddingAll": "0px"
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [],
          "paddingAll": "0px"
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