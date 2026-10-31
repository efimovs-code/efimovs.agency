export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ 
      error: 'Telegram environment variables (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) are missing' 
    });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({ error: data.description || 'Failed to send message via Telegram API' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}