const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Assuming you want to avoid duplicate emails
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v); // Validate exactly 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    budget: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Budget options
        required: true,
    },
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date and time
    },
});

module.exports = mongoose.model("Contact", ContactSchema);
