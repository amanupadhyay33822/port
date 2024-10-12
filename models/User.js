const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  appointments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Appointment"
  }],
  itemsBought: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the product schema (items bought)
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
