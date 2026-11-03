import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const lastUserMsg = messages[messages.length - 1].content;

    // ИСПРАВЛЕНИЕ: Вырезаем первое приветствие бота, чтобы история для Gemini начиналась с user
    const rawHistory = messages.slice(0, messages.length - 1);
    const filteredHistory = rawHistory.filter((msg, index) => {
        return !(index === 0 && msg.role === 'assistant');
    });

    const history = filteredHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.6,
      },
    });

    const result = await chat.sendMessage(lastUserMsg);
    const aiReply = result.response.text();

    const contactRegex = /(@[A-Za-z0-9_]{3,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?\d{7,15}|t\.me\/[A-Za-z0-9_]+|wa\.me\/\d+)/ig;
    const foundContacts = lastUserMsg.match(contactRegex);

    // Безопасная проверка на наличие ключей Supabase перед записью лида
    if (foundContacts && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      await supabase
        .from('agency_leads')
        .insert([
          {
            client_name: 'Лид из AI Чата (Gemini)',
            contact_info: foundContacts.join(', '),
            chat_history: messages,
            status: 'hot_lead'
          }
        ]);
    }

    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}