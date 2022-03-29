const knex = require("../db/connection");

// returns a review by ID 
function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

// updates a review 
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => {
      return knex("critics")
        .select("*")
        .where({ critic_id: updatedReview.critic_id })
        .first();
    });
}

// deletes a review by ID 
function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  destroy,
  update,
}