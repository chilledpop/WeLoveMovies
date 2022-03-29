const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceCritic = reduceProperties("critic_id", {
  critic_id: ["critics", null, "critic_id"],
  preferred_name: ["critics", null, "preferred_name"],
  surname: ["critics", null, "surname"],
  organization_name: ["critics", null, "organization_name"],
  created_at: ["critics", null, "created_at"],
  updated_at: ["critics", null, "updated_at"],
});

function list() {
  return knex("movies").select("*");
}

function isShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("*")
    .where({ "mt.is_showing": true })
    .groupBy("mt.movie_id");
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
    .first();
}

function listTheatersShowingMovie(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.*")
    .where({ "mt.movie_id": movieId }, { "is_showing": true });
}

function listMovieReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then(reduceCritic);
}


module.exports = {
  list,
  isShowing,
  read,
  listTheatersShowingMovie,
  listMovieReviews,
}