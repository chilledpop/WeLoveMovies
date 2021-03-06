const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

// returns a list of all movies
function list() {
  return knex("movies").select("*");
}

// returns only the movies that are currently showing in theaters
function isShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true })
}

// returns a single movie by ID
function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
    .first();
}


// returns all theaters where a movie is playing
function listTheatersShowingMovie(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*")
    .where({ "mt.movie_id": movieId }, { "is_showing": true });
}


// returns all reviews for a movie, including critic details
function listMovieReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => reviews.map(addCritic));
}


module.exports = {
  list,
  isShowing,
  read,
  listTheatersShowingMovie,
  listMovieReviews,
}