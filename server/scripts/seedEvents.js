require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

const events = [
  {
    id: 1,
    title: 'Наурыз Мейрамы: Великий праздник степи',
    date: '2026-03-21',
    time: '10:00',
    category: 'Фестивали',
    rating: 5.0,
    price: 'Бесплатно',
    description: 'Главное празднование года в Алматы. Этно-аулы, конные игры, традиционные угощения и большой гала-концерт под открытым небом на площади Астана.',
    location: 'Старая Площадь, Алматы',
    coordinates: { lat: 43.2567, lng: 76.9415 },
    poster: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=800&q=90',
    backdrop: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=1920&q=90',
    image2: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=90',
    age: 0,
    featured: true,
    ticketsAvailable: 1000
  },
  {
    id: 2,
    title: 'Almaty Marathon 2026',
    date: '2026-04-12',
    time: '07:00',
    category: 'Спорт',
    rating: 4.9,
    price: 'от 10000 ₸',
    description: 'Юбилейный забег. Дистанции 10 км, 21.1 км и классический марафон 42.2 км. Участвуют атлеты из более чем 30 стран мира.',
    location: 'Парк Первого Президента, Алматы',
    coordinates: { lat: 43.1975, lng: 76.8821 },
    poster: 'https://images.unsplash.com/photo-1530549387631-afb16881947a?w=800&q=90',
    backdrop: 'https://images.unsplash.com/photo-1530549387631-afb16881947a?w=1920&q=90',
    image2: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=90',
    age: 0,
    featured: true,
    ticketsAvailable: 500
  },
  {
    id: 3,
    title: 'Мюзикл "Призрак Оперы" (Broadway Tour)',
    date: '2026-05-05',
    time: '19:30',
    category: 'Театр',
    rating: 5.0,
    price: 'от 15000 ₸',
    description: 'Легендарная постановка Эндрю Ллойда Уэббера впервые в Казахстане. Оригинальная бродвейская команда актеров и декорации.',
    location: 'Театр Оперы и Балета, Алматы',
    coordinates: { lat: 43.2629, lng: 76.9486 },
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90',
    backdrop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=90',
    image2: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=90',
    age: 12,
    featured: true,
    ticketsAvailable: 300
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB подключена');

    await Event.deleteMany({});
    console.log('🗑️  Старые события удалены');

    await Event.insertMany(events);
    console.log(`✅ Добавлено ${events.length} событий`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

seedEvents();
