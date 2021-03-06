const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// validation middleware
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

function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function listTheatersShowingMovie(req, res) {
  const { movie } = res.locals;
  const theaters = await moviesService.listTheatersShowingMovie(movie.movie_id);
  res.json({ data: theaters });
}

async function listMovieReviews(req, res) {
  const { movie } = res.locals;
  const data = await moviesService.listMovieReviews(movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [
    asyncErrorBoundary(movieExists), 
    read,
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