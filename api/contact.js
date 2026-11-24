export default async function handler(req, res) {
  // --- ALLOW POST REQUESTS ONLY
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- CHECK TELEGRAM CREDENTIALS
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: 'Telegram environment variables (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) are missing',
    });
  }

  // --- VALIDATE REQUEST BODY
  const { text } = req.body || {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // --- SEND MESSAGE VIA TELEGRAM BOT API
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.ok) {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({
      error: data.description || 'Failed to send message via Telegram API',
    });
  } catch (err) {
    console.error('Telegram API Error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to send message' });
  }
}