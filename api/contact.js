import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Блокируем любые запросы, кроме POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  // Базовая серверная валидация
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill out all fields.' });
  }

  try {
    // Подключаемся к SMTP серверу Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'efimovs.agency@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD // Подтягиваем пароль из защищенного окружения
      }
    });

    // Формируем структуру письма
    const mailOptions = {
      from: 'Efimovs Agency Platform <efimovs.agency@gmail.com>',
      to: 'efimovs.agency@gmail.com', // Куда будет приходить заявка
      replyTo: email, // Чтобы ответить клиенту в один клик
      subject: `New Website Message | ${name}`, // <-- Обновленная тема письма
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #000;">New Incoming Message</h2> <!-- <-- Обновленный заголовок -->
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);

    // Возвращаем успешный ответ на фронтенд
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
    
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}