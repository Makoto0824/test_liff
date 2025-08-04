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

    // 2つのFlex Messageを同時に送信
    const multipleMessages = [
      {
        type: 'flex',
        altText: 'CATRIP上野クーポン',
        contents: {
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
                "url": "https://test-liff-nu.vercel.app/images/cat.png",
                "size": "full",
                "aspectRatio": "16:9",
                "aspectMode": "cover",
                "margin": "md"
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
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "🐱",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": "御朱印",
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 5
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "🎫",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": "入場料10%OFF",
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 5
                      }
                    ]
                  }
                ]
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
                  "label": "一括で受け取る",
                  "uri": "https://test-liff-nu.vercel.app/coupon-receive"
                }
              }
            ],
            "flex": 0
          }
        }
      },
      {
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
      }
    ];

    // LINE Messaging APIで2つのFlex Messageを同時送信
    await client.pushMessage(userId, multipleMessages);

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