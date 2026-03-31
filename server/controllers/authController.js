const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, city, phone, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    let role = 'user';
    
    if (User.isAdminEmail(email)) {
      if (adminSecretKey === process.env.ADMIN_SECRET_KEY) {
        role = 'admin';
      } else {
        return res.status(403).json({ 
          message: 'Неверный секретный ключ администратора' 
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      city: city || 'Astana',
      phone: phone || '',
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Ошибка создания пользователя' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, adminSecretKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Введите email и пароль' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    if (User.isAdminEmail(email)) {
      if (user.role !== 'admin') {
        if (adminSecretKey === process.env.ADMIN_SECRET_KEY) {
          user.role = 'admin';
          await user.save();
        } else {
          return res.status(403).json({ 
            message: 'Требуется секретный ключ администратора' 
          });
        }
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      phone: user.phone,
      avatar: user.avatar,
      balance: user.balance,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
