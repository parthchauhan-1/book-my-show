const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shows",
    required: true,
  },
  seats: {
    type: Array,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("bookings", bookingSchema);
