require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Конфигурация
const TELEGRAM_BOT_TOKEN = 8127455848:AAGYCJwa2ATZ_vijbBqhbSSVlXAacJ2B8x0;
const TELEGRAM_CHAT_ID = 7873914635;
const ADMIN_PASSWORD = 123 || 'securepassword';
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Хранение данных (в реальном проекте используйте базу данных)
let artworks = [
  { id: 1, title: "Golden Harmony", image: "https://readdy.ai/api/search-image?query=luxury%20abstract%20art%20piece%20with%20gold%20leaf%20and%20crystal%20elements%2C%20neutral%20colors%2C%20elegant%20composition%2C%20high-end%20interior%20art%2C%20professional%20art%20photography&width=600&height=600&seq=3&orientation=squarish" },
  { id: 2, title: "Crystal Symphony", image: "https://readdy.ai/api/search-image?query=modern%20minimalist%20art%20installation%20with%20metallic%20accents%20and%20crystal%20elements%2C%20sophisticated%20design%2C%20luxury%20interior%20piece%2C%20professional%20art%20photography&width=600&height=600&seq=4&orientation=squarish" },
  { id: 3, title: "Eternal Sunshine", image: "https://readdy.ai/api/search-image?query=contemporary%20wall%20art%20with%20precious%20materials%2C%20elegant%20abstract%20design%2C%20luxury%20interior%20decoration%2C%20professional%20art%20photography&width=600&height=600&seq=5&orientation=squarish" }
];

// Отправка уведомления в Telegram
async function sendTelegramNotification(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${8127455848:AAGYCJwa2ATZ_vijbBqhbSSVlXAacJ2B8x0}/sendMessage`, {
      chat_id: 7873914635,
      text: message,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error.message);
  }
}

// API для формы обратной связи
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
  }

  const notification = `
    <b>Новое сообщение с сайта Splendour Art</b>
    <b>Имя:</b> ${name}
    <b>Email:</b> ${email}
    <b>Сообщение:</b> ${message}
  `;

  await sendTelegramNotification(notification);
  
  res.json({ success: true, message: 'Сообщение отправлено' });
});

// API для получения работ
app.get('/api/artworks', (req, res) => {
  res.json(artworks);
});

// API для добавления новой работы (требует авторизации)
app.post('/api/artworks', upload.single('image'), (req, res) => {
  const { password, title } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Неверный пароль' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Изображение обязательно' });
  }

  const newArtwork = {
    id: artworks.length + 1,
    title: title || `Artwork ${artworks.length + 1}`,
    image: `/uploads/${req.file.filename}`
  };

  artworks.push(newArtwork);
  
  res.json({ success: true, artwork: newArtwork });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});