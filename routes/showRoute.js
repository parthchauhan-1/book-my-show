const Shows = require("../models/showModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

//add a Show
router.post("/add-show", authMiddleware, async (req, res) => {
  try {
    const newShow = new Shows(req.body);
    await newShow.save();
    res.send({
      success: true,
      message: "Show Added",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//get-all-shows-by-theatre
router.post("/get-all-shows-by-theatre", authMiddleware, async (req, res) => {
  try {
    const shows = await Shows.find({ theatre: req.body.theatre_id }).populate(
      "movie"
    );
    res.send({
      success: true,
      message: "Shows fetched!",
      data: shows,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//delete a show
router.post("/delete-show", authMiddleware, async (req, res) => {
  try {
    const shows = await Shows.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: "Show deleted!",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//get all unique theatres which have shows of a movie
router.post("/get-all-theatres-by-movie", authMiddleware, async (req, res) => {
  try {
    const { movie, date } = req.body;
    //find all the shows of a movie on given date
    const shows = await Shows.find({ movie, date }).populate("theatre");
    //get all unique theatres
    let uniqueTheatres = [];
    shows.forEach((show) => {
      const theatre = uniqueTheatres.find(
        (theatre) => theatre._id == show.theatre._id
      );
      if (!theatre) {
        const showsForThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsForThisTheatre,
        });
      }
    });
    res.send({ success: true, message: "Success", data: uniqueTheatres });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
});

router.post("/get-show-by-id", authMiddleware, async (req, res) => {
  try {
    const show = await Shows.findById(req.body.showId)
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      data: show,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
