const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a 'User' schema exists
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Linking to the Product schema
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      price: {
        amount: { type: Number, required: true }, // Price per unit at the time of addition
       
      },
    }
  ],
  totalPrice: {
    amount: {
      type: Number,
      required: true,
      default: 0
    },
 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update timestamps
cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
