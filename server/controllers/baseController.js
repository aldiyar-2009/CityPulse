const mongoose = require('mongoose');
const User = require('../models/User');

const createHandlers = (Model, itemType) => {
  return {
    getAll: async (req, res) => {
      try {
        const { featured, limit } = req.query;
        let filter = {};
        if (featured === 'true') filter.featured = true;
        
        const items = await Model.find(filter)
          .limit(limit ? parseInt(limit) : 0)
          .sort({ date: 1 });
        res.json(items);
      } catch (error) {
        res.status(500).json({ message: `Ошибка загрузки ${itemType}s` });
      }
    },

    getById: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Не найдено' });
        res.json(item);
      } catch (error) {
        res.status(500).json({ message: 'Ошибка загрузки' });
      }
    },

    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        res.status(500).json({ message: 'Ошибка создания: ' + error.message });
      }
    },

    update: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Не найдено' });
        res.json(item);
      } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления: ' + error.message });
      }
    },

    delete: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Не найдено' });
        res.json({ message: 'Удалено' });
      } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления' });
      }
    },

    purchaseTicket: async (req, res) => {
      try {
        const { itemId, seats } = req.body;
        if (!itemId) return res.status(400).json({ message: 'ID обязателен' });

        const item = await Model.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Не найдено' });
        
        let quantity = 1;
        let selectedSeats = [];
        
        if (seats && Array.isArray(seats) && seats.length > 0) {
          quantity = seats.length;
          selectedSeats = seats;
          
          if (itemType === 'Movie') {
            const booked = item.bookedSeats || [];
            const overlap = selectedSeats.find(s => booked.includes(s));
            if (overlap) {
              return res.status(400).json({ message: 'Выбранные места уже заняты' });
            }
          }
        }

        const totalPrice = item.price * quantity;
        
        const user = await User.findById(req.user._id);
        if (user.balance < totalPrice) {
          return res.status(400).json({ message: 'Недостаточно средств на балансе' });
        }
        if (item.ticketsAvailable < quantity) {
          return res.status(400).json({ message: 'Недостаточно билетов' });
        }

        const ticketObject = { 
          itemId: item._id, 
          itemType, 
          price: totalPrice, 
          status: 'paid',
          quantity,
          seats: selectedSeats
        };

        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id, balance: { $gte: totalPrice } },
          { 
            $inc: { balance: -totalPrice },
            $push: { purchasedTickets: ticketObject }
          },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(400).json({ message: 'Ошибка транзакции (недостаточно средств)' });
        }

        const updateObj = { $inc: { ticketsAvailable: -quantity } };
        if (itemType === 'Movie' && selectedSeats.length > 0) {
          updateObj.$push = { bookedSeats: { $each: selectedSeats } };
        }
        
        await Model.findByIdAndUpdate(itemId, updateObj);

        res.json({
          message: 'Билет успешно куплен',
          ticket: updatedUser.purchasedTickets[updatedUser.purchasedTickets.length - 1],
          balance: updatedUser.balance,
        });

      } catch (error) {
        res.status(500).json({ message: 'Ошибка покупки билета: ' + error.message });
      }
    },

    toggleFavorite: async (req, res) => {
      try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ message: 'ID обязателен' });

        const user = await User.findById(req.user._id);
        const index = user.favorites.findIndex(f => f.itemId.toString() === itemId && f.itemType === itemType);

        let message;
        if (index > -1) {
          user.favorites.splice(index, 1);
          message = 'Удалено из избранного';
        } else {
          user.favorites.push({ itemId, itemType });
          message = 'Добавлено в избранное';
        }
        await user.save();
        res.json({ message, favorites: user.favorites });
      } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления избранного' });
      }
    }
  };
};

module.exports = { createHandlers };
