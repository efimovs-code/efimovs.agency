import { createClient } from '@supabase/supabase-js';

const systemPrompt = `[УСТАНОВКА ЛИЧНОСТИ]
Ты — AI Discovery Manager в IT-агентстве "Efimovs Agency" (efimovs.agency). 
Твой стиль: премиальный, уверенный, лаконичный. Без воды, извинений и эмодзи.
Ты общаешься строго на том же языке, на котором пишет клиент.

[ИНФОРМАЦИЯ ОБ АГЕНТСТВЕ]
- Основатель и главный инженер: Artur Efimov.
- Наш стек: Vue.js (плавные анимации, Glassmorphic UI) для фронтенда и Laravel (PHP) / Supabase для бэкенда.
- Наши кейсы: AiMA Platform (SaaS), Shortlyst (SaaS ИИ-аналитика), QR Cafe (веб-приложение для HoReCa), Geometriya (корпоративный сайт).
- Цены: От $1,000. Точных цен нет — только кастомная архитектура под бизнес.

[ТВОЯ ГЛАВНАЯ ЦЕЛЬ - ВОРОНКА ПРОДАЖ]
1. Понять задачу клиента (SaaS, сайт, ИИ-бот, маркетплейс).
2. Запросить нишу бизнеса и примеры сайтов.
3. Закрытие: Как только клиент описал задачу, СРАЗУ пиши: "Архитектура вашей задачи ясна. Оставьте ваш Telegram, WhatsApp или Email, и Артур Ефимов (фаундер агентства) подготовит для вас персональную смету в течение 24 часов."

[ЖЕСТКИЕ ПРАВИЛА]
- Отвечай МАКСИМУМ в 2-3 предложения.
- Никогда не пиши код.
- Если клиент скинул контакт (email, phone, @tg), ответь строго: "Благодарю. Ваши данные переданы команде. Артур Ефимов свяжется с вами в ближайшее время."`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод не разрешен' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Ключ GEMINI_API_KEY не найден в переменных окружения Vercel');
    }

    const { messages } = req.body;
    if (!messages || !messages.length) {
      throw new Error('Пустой массив сообщений');
    }

    const contents = messages
      .filter((m, i) => !(i === 0 && m.role === 'assistant'))
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Список актуальных моделей Google Gemini с целевой gemini-3.8-flash
    const modelsToTry = [
      'gemini-3.8-flash',
      'gemini-3.0-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];

    let aiReply = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 200
            }
          })
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiReply = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastError = data.error?.message || `Ошибка ${response.status} (${modelName})`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!aiReply) {
      throw new Error(`Google API: ${lastError}`);
    }

    // Запись лидов в Supabase
    const lastUserMsg = messages[messages.length - 1].content;
    const contactRegex = /(@[A-Za-z0-9_]{3,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?\d{7,15}|t\.me\/[A-Za-z0-9_]+|wa\.me\/\d+)/ig;
    const foundContacts = lastUserMsg.match(contactRegex);

    if (foundContacts && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      await supabase
        .from('agency_leads')
        .insert([{
          client_name: 'Лид из AI Чата (Gemini)',
          contact_info: foundContacts.join(', '),
          chat_history: messages,
          status: 'hot_lead'
        }]);
    }

    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('SERVER ERROR:', error);
    return res.status(500).json({ error: error.message || 'Внутренняя ошибка сервера' });
  }
}