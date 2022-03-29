const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function reviewExists(req, res, next) {
  const review = await reviewsService.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  
  next({ status: 404, message: "Review cannot be found." });
}

async function update(req, res) {
  const { review } = res.locals;
  const updatedReview = {
    ...review,
    ...req.body.data,
    review_id: review.review_id,
  };
  const data = await reviewsService.update(updatedReview);
  updatedReview.critic = data;
  res.json({ data: updatedReview });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await reviewsService.destroy(review.review_id);
  res.sendStatus(204).json("No Content");
}


module.exports = {
  delete: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ]
}