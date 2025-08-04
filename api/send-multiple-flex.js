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

    // カルーセル形式で複数のFlex Messageを送信
    const carouselMessage = {
      type: 'flex',
      altText: 'クーポン一覧',
      contents: {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "CATRIP上野",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "image",
                  "url": "https://test-liff-nu.vercel.app/images/ticket.png",
                  "size": "full",
                  "aspectRatio": "16:9",
                  "aspectMode": "cover",
                  "margin": "md"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": []
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
                    "type": "uri",
                    "label": "受け取る",
                    "uri": "https://test-liff-nu.vercel.app/coupon-receive"
                  }
                }
              ],
              "flex": 0
            }
          },
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "CATRIP上野",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "image",
                  "url": "https://test-liff-nu.vercel.app/images/ticket.png",
                  "size": "full",
                  "aspectRatio": "16:9",
                  "aspectMode": "cover",
                  "margin": "md"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": []
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
                    "type": "uri",
                    "label": "受け取る",
                    "uri": "https://test-liff-nu.vercel.app/coupon-receive"
                  }
                }
              ],
              "flex": 0
            }
          },
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "CATRIP上野",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "image",
                  "url": "https://test-liff-nu.vercel.app/images/ticket.png",
                  "size": "full",
                  "aspectRatio": "16:9",
                  "aspectMode": "cover",
                  "margin": "md"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": []
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
                    "type": "uri",
                    "label": "受け取る",
                    "uri": "https://test-liff-nu.vercel.app/coupon-receive"
                  }
                }
              ],
              "flex": 0
            }
          }
        ]
      }
    };

    // LINE Messaging APIでカルーセルメッセージを送信
    await client.pushMessage(userId, carouselMessage);

    res.status(200).json({ 
      success: true, 
      message: 'Multiple Flex Messages sent successfully' 
    });

  } catch (error) {
    console.error('Multiple Flex Messages送信エラー:', error);
    res.status(500).json({ 
      error: 'Failed to send multiple Flex Messages',
      details: error.message 
    });
  }
}; 