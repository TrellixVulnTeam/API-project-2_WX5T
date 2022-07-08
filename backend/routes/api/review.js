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

// /Get all reviews by a Spot's id
router.get("/spots/:spotId/reviews", async (req, res) => {
    const spotId = req.params.spotId;

    let spot  = await Spots.findByPk(spotId);
    //if spot doesnt exist
    if (!spot) {
      return res.status(404).json({
        "message": "Spot couldn't be found!"
      });
    }

    let reviews = await Review.findAll({
      where: {
        spotId: spotId,
      }
    });

    let user = await User.findByPk(spot.ownerId,{
        atrribute: ["username"]
    });
    let images = await Image.findByPk(spot.id)


    return res.json({
      reviews,
      user,
      images
    });
  });

module.exports = router;
