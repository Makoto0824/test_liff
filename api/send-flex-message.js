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

    // Flex Messageを読み込み
    const flexMessage = require('./flex-message.js');

    // LINE Messaging APIで送信
    await client.pushMessage(userId, {
      type: 'flex',
      altText: 'CATRIP上野のクーポン',
      contents: flexMessage
    });

    res.status(200).json({ 
      success: true, 
      message: 'Flex Message sent successfully' 
    });

  } catch (error) {
    console.error('Flex Message送信エラー:', error);
    res.status(500).json({ 
      error: 'Failed to send Flex Message',
      details: error.message 
    });
  }
}; 