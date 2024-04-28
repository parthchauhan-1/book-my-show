const router = require("express").Router();
const Movie = require("../models/movieModel");
const authMiddleware = require("../middlewares/authMiddleware");

//add new movie
router.post("/add-movie", authMiddleware, async (req, res) => {
  try {
    const newMovie = await Movie(req.body);
    // console.log(newMovie);
    await newMovie.save();
    res.send({
      success: true,
      message: "movie added successfully!",
    });
  } catch (error) {
    console.log(error.message);
  }
});

//delete a movie
router.post("/delete-movie", authMiddleware, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.body.movieId);
    res.send({ success: true, message: "movie deleted successfully" });
  } catch (error) {
    console.log(error.message);
  }
});

//get all the movies
router.get("/get-all-movies", authMiddleware, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send({
      success: true,
      message: "All Movie Fetched",
      data: movies,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//update movie
router.put("/update-movie", authMiddleware, async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.body.movieId, req.body);
    res.send({ success: true, message: "movie updated successfully" });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
});

router.get("/get-movie-by-id/:id", authMiddleware, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.send({
    success: true,
    message: "Movie details fetched!!!",
    data: movie,
  });
});

module.exports = router;
