import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// Инициализация сервисов
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// === МОЗГ ИИ (АБСОЛЮТНАЯ АВТОМАТИЗАЦИЯ) ===
const systemPrompt = `[УСТАНОВКА ЛИЧНОСТИ]
Ты — AI Discovery Manager в топовом IT-агентстве "Efimovs Agency" (efimovs.agency). 
Твой стиль общения: премиальный, уверенный, лаконичный (в стиле McKinsey, Apple или топовых IT-консалтингов). Никакой воды, извинений, заискиваний и эмодзи.
Ты общаешься строго на том же языке, на котором пишет клиент (RU, EN, UA, TR, DE, FR, ES).

[ИНФОРМАЦИЯ ОБ АГЕНТСТВЕ]
- Основатель и главный инженер: Artur Efimov.
- Наш стек: Vue.js (плавные анимации, Glassmorphism) для фронтенда и Laravel (PHP) / Supabase для мощного бэкенда.
- Наши кейсы (упоминай их, если это уместно): AiMA Platform (SaaS), Shortlyst (SaaS ИИ-аналитика), QR Cafe (веб-приложение для HoReCa), Geometriya (корпоративный сайт).
- Цены: От $1,000. Точных цен нет — мы разрабатываем только кастомную архитектуру под бизнес.

[ТВОЯ ГЛАВНАЯ ЦЕЛЬ - ВОРОНКА ПРОДАЖ]
Ты должен провести клиента по 3 шагам:
ШАГ 1: Понять задачу (Какой продукт нужен: SaaS, корпоративный сайт, ИИ-бот, маркетплейс?).
ШАГ 2: Квалификация (Какая ниша у бизнеса и есть ли референсы?).
ШАГ 3: Закрытие. Как только клиент вкратце описал задачу, СРАЗУ пиши: "Архитектура вашей задачи ясна. Оставьте ваш Telegram, WhatsApp или Email, и Артур Ефимов (фаундер агентства) подготовит для вас персональную смету в течение 24 часов."

[ЖЕСТКИЕ ПРАВИЛА (CRITICAL)]
- Отвечай МАКСИМУМ в 2-3 предложения. Твои ответы должны быть короткими, как в реальном живом чате.
- Никогда не пиши код. Если просят код, отвечай: "Мы занимаемся комплексной B2B-разработкой под ключ, а не написанием фрагментов кода."
- ЕСЛИ КЛИЕНТ УЖЕ НАПИСАЛ СВОЙ КОНТАКТ (юзернейм, email, телефон, ссылку), твой финальный ответ должен быть ТОЛЬКО таким: "Благодарю. Ваши данные переданы команде. Артур Ефимов свяжется с вами в ближайшее время." (И после этого прекращай задавать вопросы).`;

export default async function handler(req, res) {
  // 1. НАСТРОЙКА CORS (Защита от блокировок в браузерах)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Ответ на Preflight-запрос от браузера
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Защита эндпоинта
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 2. ОТПРАВКА В OPENAI С ЖЕСТКИМИ РАМКАМИ
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.6, // Баланс: бот звучит умно, но не фантазирует лишние услуги
      max_tokens: 200,  // Физически отрезаем возможность писать длинные поэмы
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
    });

    const aiReply = completion.choices[0].message.content;

    // 3. УМНЫЙ CRM-ПАРСЕР (Ищем контакты)
    const lastUserMsg = messages[messages.length - 1].content;
    
    // Регулярка ловит: @username, email@domain.com, +123456789, t.me/user, wa.me/123
    const contactRegex = /(@[A-Za-z0-9_]{3,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?\d{7,15}|t\.me\/[A-Za-z0-9_]+|wa\.me\/\d+)/ig;
    const foundContacts = lastUserMsg.match(contactRegex);

    if (foundContacts) {
       // 4. ЗАПИСЬ "ГОРЯЧЕГО" ЛИДА В SUPABASE
       await supabase
        .from('agency_leads')
        .insert([
          {
            client_name: 'Лид из AI Чата',
            contact_info: foundContacts.join(', '), // Сохраняем все найденные контакты
            chat_history: messages,                 // Сохраняем весь контекст диалога для тебя
            status: 'hot_lead'                      // Сразу помечаем статус для удобства
          }
        ]);
    }

    // 5. ОТВЕТ КЛИЕНТУ
    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ error: 'Сервер временно недоступен.' });
  }
}