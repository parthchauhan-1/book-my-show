const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Theatre = require("../models/theatreModel");

//add a theatre
router.post("/add-theatre", authMiddleware, async (req, res) => {
  try {
    const newTheatre = new Theatre({ ...req.body, owner: req.body.userId });
    // console.log(newTheatre);
    await newTheatre.save();
    res.send({
      success: true,
      message: "Theatre added successfully!",
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

//get-all-theatres
router.get("/get-all-theatres", authMiddleware, async (req, res) => {
  try {
    const data = await Theatre.find().populate("owner");
    res.send({ success: true, data: data });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

//get theatre owner specific
router.post("/get-all-theatre-by-owner", authMiddleware, async (req, res) => {
  try {
    const theatres = await Theatre.find({ owner: req.body.userId });
    res.send({
      success: true,
      message: "Theatres fetched!",
      data: theatres,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.put("/update-theatre", authMiddleware, async (req, res) => {
  try {
    await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
    res.send({
      success: true,
      message: "Theatre updated successfully!",
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

router.post("/delete-theatre", authMiddleware, async (req, res) => {
  try {
    await Theatre.findByIdAndDelete(req.body.theatreId);
    res.send({
      success: true,
      message: "Theatre deleted successfully!",
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});



module.exports = router;
