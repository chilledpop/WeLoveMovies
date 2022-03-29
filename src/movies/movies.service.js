const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
})


function list() {
  return knex("movies").select("*");
}

function isShowing() {
  return knex("movies as m")
    .select("m.movie_id", "m.title", "m.description", "m.image_url")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ "mt.is_showing": true })
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ movieId })
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
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.critic_id",
      "r.movie_id",
    )
    .where({ "r.movie_id": movieId })
    .first()
    .then(addCritic)
}


module.exports = {
  list,
  isShowing,
  read,
  listTheatersShowingMovie,
  listMovieReviews,
  delete: destroy,
}