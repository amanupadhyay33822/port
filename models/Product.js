const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: {
    amount: Number,
    currency: String
  },
  discount: {
    amount: Number,
    amountType: String
  },
  stock: {
    available: Number,
    threshold: Number
  },
  images: [{
    url: String,
    altText: String
  }],
  rating: {
    average: Number,
    count: Number
  },
  attributes: {
    color: String,
    size: String,
    weight: Number,
    material: String
  },
  vendor: {
    name: String,
    id: String,
    email: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    cost: {
      amount: Number,
      currency: String
    },
    availableRegions: [String]
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
