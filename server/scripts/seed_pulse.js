require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Sport = require('../models/Sport');
const Concert = require('../models/Concert');
const Fair = require('../models/Fair');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear collections
    await Movie.deleteMany({});
    await Sport.deleteMany({});
    await Concert.deleteMany({});
    await Fair.deleteMany({});
    
    // Drop all users' purchasedTickets and favorites to avoid broken references
    await User.updateMany({}, { $set: { favorites: [], purchasedTickets: [] } });

    console.log('Cleared existing data.');

    // 1. Movies
    await Movie.create([
      {
        title: "Дюна: Часть вторая",
        date: "2024-03-01",
        time: "19:00",
        director: "Denis Villeneuve",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
        duration: 166,
        rating: 4.9,
        price: 2500,
        description: "Фантастический эпик о Поле Атрейдесе на планете Арракис.",
        location: "Kinopark 8 IMAX Saryarka",
        poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8b8R8l88ILKxM3E9jT7s42o0lWp.jpg",
        backdrop: "https://www.themoviedb.org/t/p/original/8rpDcsfLJypbO6vtec052ZlTAdO.jpg",
        featured: true
      },
      {
        title: "Оппенгеймер",
        date: "2024-03-05",
        time: "18:00",
        director: "Christopher Nolan",
        cast: ["Cillian Murphy", "Emily Blunt"],
        duration: 180,
        rating: 4.8,
        price: 3000,
        description: "История создания атомной бомбы.",
        location: "Chaplin Cinemas MEGA",
        poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ptOqj1z4gR58aI8L8JcO26N7uOf.jpg",
        featured: false
      }
    ]);

    // 2. Sports
    await Sport.create([
      {
        title: "Матч Звезд КХЛ",
        date: "2024-04-10",
        time: "17:00",
        sportType: "Хоккей",
        teams: ["Барыс (Астана)", "СКА (Спб)"],
        league: "КХЛ",
        rating: 4.5,
        price: 5000,
        description: "Важнейший матч регулярного чемпионата.",
        location: "Barys Arena",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Barys_Arena_interior.jpg/640px-Barys_Arena_interior.jpg",
        featured: true
      },
      {
        title: "Финал Кубка Азии (Футбол)",
        date: "2024-05-20",
        time: "20:00",
        sportType: "Футбол",
        teams: ["Астана", "Кайрат"],
        league: "Кубок Казахстана",
        rating: 4.7,
        price: 4500,
        description: "Казахстанское класико за выход в финал.",
        location: "Astana Arena",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Astana_Arena_interior.jpg/640px-Astana_Arena_interior.jpg",
        featured: false
      }
    ]);

    // 3. Concerts
    await Concert.create([
      {
        title: "Скриптонит - Большой Сольный Концерт",
        date: "2024-06-15",
        time: "20:00",
        artist: "Скриптонит",
        genre: "Хип-хоп / Рэп",
        rating: 4.9,
        price: 25000,
        description: "Самый ожидаемый концерт года. Все хиты и новые треки.",
        location: "Арыстан Арена",
        poster: "https://tntmusic.ru/media/content/article/2021-04-09_11-09-54__91ad973c-9922-11eb-987a-b9c24b94f6f3.jpg",
        featured: true
      },
      {
        title: "Димаш Кудайбергенов",
        date: "2024-07-01",
        time: "19:00",
        artist: "Димаш Кудайбергенов",
        genre: "Поп / Классика",
        rating: 5.0,
        price: 35000,
        description: "Уникальное вокальное шоу мирового уровня.",
        location: "Astana Opera",
        poster: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Dimash_Kudaibergenov.jpg",
        featured: true
      }
    ]);

    // 4. Fairs
    await Fair.create([
      {
        title: "Mega EXPO - Ярмарка Технологий",
        date: "2024-08-10",
        time: "10:00",
        theme: "IT и Гаджеты",
        exhibitors: ["Apple", "Samsung", "Kaspi"],
        activities: ["Мастер-классы", "Розыгрыши", "Лекции"],
        rating: 4.2,
        price: 1000,
        description: "Крупнейшая ярмарка технологий в столице.",
        location: "EXPO Pavilion",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Expo_2017_Astana_Sphere.jpg/640px-Expo_2017_Astana_Sphere.jpg",
        featured: false
      },
      {
        title: "Осенняя Фермерская Ярмарка",
        date: "2024-09-15",
        time: "09:00",
        theme: "Продукты и Еда",
        exhibitors: ["Ферма 'Степная'", "Сыроварня 'Нур'"],
        activities: ["Дегустация яблок", "Медовая выставка"],
        rating: 4.5,
        price: 500,
        description: "Свежие овощи, фрукты и продукты от местных фермеров.",
        location: "Главная Площадь",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Farmer%27s_market.jpg/640px-Farmer%27s_market.jpg",
        featured: false
      }
    ]);

    console.log('Database seeded with Movies, Sports, Concerts, and Fairs successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
