const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
const stripe = require("stripe")(process.env.stripe_key);

const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const charge = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      customer: customer.id,
      receipt_email: token.email,
      description: "Ticket has been booked for a movie",
    });

    const transactionId = charge.id;
    res.send({
      success: true,
      message: "Payment recieved ♥",
      data: transactionId,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Payment failed 😭, please try again!",
    });
  }
});

router.post("/book-tickets", authMiddleware, async (req, res) => {
  try {
    const newBooking = await Booking(req.body);
    newBooking.save();

    const show = await Show.findById(req.body.show);

    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: [...show.bookedSeats, ...req.body.seats],
    });
    res.send({
      success: true,
      message: "Tickets Booked!!! 🥳",
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-bookings", authMiddleware, async (req, res) => {
  try {
    const data = await Booking.find({ userId: req.body.userId })
      .populate("userId")
      .select("-password")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    console.log(data);
    res.send({
      success: true,
      message: "Bookings fetched successfully!!!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
