const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

console.log('Путь к .env:', path.join(__dirname, '.env'));
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Подключение успешно!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  });