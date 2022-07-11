const express = require("express");
const { handleValidationErrors } = require("../../utils/validation");
const { Sequelize, Model, DataTypes } = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { sequelize } = require("../../db/models");
const { Spots, Review, User, Image, Booking } = require("../../db/models");
// const spots = require('../../db/models/spots')
const router = express.Router();

//EDIT A REVIEW
router.put('/:reviewID', requireAuth, async (req, res) => {
  const reviewToUpdate = await Review.findByPk(req.params.id);
  const {review, stars} = req.body

  if (!reviewToUpdate || reviewToUpdate.userID !== req.user.id) {
    return res.status(404).json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }


  const err = {
    "message": "Validation error",
    "statusCode": 400,
    "errors": {}
  }
  if (!review) err.errors.review = "Review text is required"
  if (!stars) err.errors.stars = "Stars must be an integer from 1 to 5"
  if (!review || !stars) {
    return res.status(400).json(err);
  }

  reviewToUpdate.review = review
  reviewToUpdate.stars = stars
  await reviewToUpdate.save()
  res.json(reviewToUpdate);
})

// DELETE A REVIEW

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const id = req.user.id;
// console.log(reviewId)
  const review = await Review.findByPk(reviewId);
// console.log(review)
  if (!review) {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
      statusCode: 404,
    });
  }

  if (review.userID !== id) {
    return res.status(403).json({
      message: "Review couldn't be found",
      statusCode: 404,
    });
  }

  await review.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
