const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found."});
}

async function list(req, res, next) {
  const showing = req.query.is_showing;
  if (showing) {
    const showingMovies = await moviesService.isShowing();
    res.json({ data: showingMovies });
  } else {
    const allMovies = await moviesService.list();
    res.json({ data: allMovies });
  }
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function listTheatersShowingMovie(movieId) {
  const theaters = await moviesService.listTheatersShowingMovie(res.locals.movieId);
  res.json({ data: theaters });
}

async function listMovieReviews(movieId) {
  const reviews = await moviesService.listMovieReviews(res.locals.movie);
  res.json({ data: reviews });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [
    asyncErrorBoundary(movieExists), 
    asyncErrorBoundary(read)
  ],
  listTheatersShowingMovie: [
    asyncErrorBoundary(movieExists), 
    asyncErrorBoundary(listTheatersShowingMovie),
  ],
  listMovieReviews: [
    asyncErrorBoundary(movieExists), 
    asyncErrorBoundary(listMovieReviews)
  ],
}