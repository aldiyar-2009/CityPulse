const Event = require('../models/Event');
const User = require('../models/User');

/**
 * GET /api/events
 * Returns filtered list of events.
 */
const getEvents = async (req, res) => {
  try {
    const { category, featured, limit } = req.query;

    let filter = {};

    if (category && category !== 'Все') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const events = await Event.find(filter)
      .select('id title date time category location price poster backdrop rating featured ticketsAvailable organizer age')
      .limit(limit ? parseInt(limit) : 0)
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки событий' });
  }
};

/**
 * GET /api/events/:id
 * Returns a single event by numeric id.
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки события' });
  }
};

/**
 * POST /api/events  (admin only)
 * Creates a new event with validation.
 */
const createEvent = async (req, res) => {
  try {
    const { title, date, time, category, location, price, description, poster } = req.body;

    // Server-side validation
    if (!title || !date || !time || !category || !location || !price || !description || !poster) {
      return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }

    const lastEvent = await Event.findOne().sort({ id: -1 });
    const newId = lastEvent ? lastEvent.id + 1 : 1;

    const event = await Event.create({
      id: newId,
      ...req.body,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания события: ' + error.message });
  }
};

/**
 * PUT /api/events/:id  (admin only)
 * Updates an existing event.
 */
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления события: ' + error.message });
  }
};

/**
 * DELETE /api/events/:id  (admin only)
 * Removes an event.
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    await event.deleteOne();

    res.json({ message: 'Событие удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления события' });
  }
};

/**
 * POST /api/events/purchase  (authenticated)
 * Purchase a ticket if the user has sufficient balance.
 */
const purchaseTicket = async (req, res) => {
  try {
    const { eventId, price } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'ID события обязателен' });
    }

    const user = await User.findById(req.user._id);
    const event = await Event.findOne({ id: eventId });

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    const ticketPrice = parseFloat(price) || 0;

    if (user.balance < ticketPrice) {
      return res.status(400).json({ message: 'Недостаточно средств на балансе' });
    }

    if (event.ticketsAvailable <= 0) {
      return res.status(400).json({ message: 'Билеты закончились' });
    }

    user.balance -= ticketPrice;
    user.purchasedTickets.push({ eventId: event.id, status: 'paid' });
    event.ticketsAvailable -= 1;

    await user.save();
    await event.save();

    res.json({
      message: 'Билет успешно куплен',
      ticket: user.purchasedTickets[user.purchasedTickets.length - 1],
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка покупки билета' });
  }
};

/**
 * POST /api/events/favorite  (authenticated)
 * Toggle favorite status for an event.
 */
const toggleFavorite = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'ID события обязателен' });
    }

    const user = await User.findById(req.user._id);
    const favoriteIndex = user.favorites.indexOf(eventId);

    let message;
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
      message = 'Событие удалено из избранного';
    } else {
      user.favorites.push(eventId);
      message = 'Событие добавлено в избранное';
    }

    await user.save();

    res.json({ message, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления избранного' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  purchaseTicket,
  toggleFavorite,
};
