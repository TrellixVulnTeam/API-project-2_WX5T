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
router.put("/:reviewId", requireAuth, async (req, res) => {
  let reviewId = req.params.reviewId;
  let reviewParams = req.body;
  let currUser = req.user.id;

  let review = await Review.findByPk(reviewId);

  //checks if reviewId exists
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404,
    });
  }

  // Review must belong to the current user
  if (!currUser) {
    return res.status(401).json({
      message: "Cannot edit review if its not yours",
      statusCode: 401,
    });
  }

  //check body validation for violation errors, then throws appropriate error message
  try {
    review = await Review.update(reviewParams, {
      where: {
        id: reviewId,
      },
    });
    review = await Review.findByPk(reviewId);
    return res.json(review);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

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
