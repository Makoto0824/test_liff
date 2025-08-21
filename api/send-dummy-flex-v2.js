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

    // シンプルなテキストFlex Message（sample_fukidashi.png使用）
    const dummyMessageV2 = {
      type: 'flex',
      altText: 'ダミーテキスト V2',
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
              "paddingAll": "20px",
              "paddingBottom": "0px"
            },
            {
              "type": "image",
              "url": "https://test-liff-nu.vercel.app/images/sample_fukidashi.png",
              "size": "full",
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
    await client.pushMessage(userId, dummyMessageV2);

    res.status(200).json({ 
      success: true, 
      message: 'Dummy Flex Message V2 sent successfully' 
    });

  } catch (error) {
    console.error('Dummy Flex Message V2送信エラー:', error);
    res.status(500).json({ 
      error: 'Failed to send dummy Flex Message V2',
      details: error.message 
    });
  }
};
