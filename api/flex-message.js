module.exports = {
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
            "url": "https://test-liff-nu.vercel.app/images/cat.png",
            "size": "full",
            "aspectRatio": "20:13",
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
              "type": "postback",
              "label": "一括受け取り",
              "data": "coupon=catrip_ueno",
              "displayText": "受け取りました！"
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
            "style": "secondary",
            "height": "sm",
            "action": {
              "type": "postback",
              "label": "受け取ったよ！",
              "data": "confirm=received",
              "displayText": "受け取ったよ！"
            }
          }
        ],
        "flex": 0
      }
    }
  ]
};