const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: 6
  },
  city: {
    type: String,
    default: 'Astana'
  },
  phone: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  favorites: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'favorites.itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Movie', 'Sport', 'Concert', 'Fair']
    }
  }],
  purchasedTickets: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'purchasedTickets.itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Movie', 'Sport', 'Concert', 'Fair']
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    seats: {
      type: [String],
      default: []
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending'
    }
  }],
  balance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.statics.isAdminEmail = function(email) {
  const adminPattern = /^Admin([1-9]|10)@gmail\.com$/i;
  return adminPattern.test(email);
};

module.exports = mongoose.model('User', userSchema);
