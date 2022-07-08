const express = require("express");
const { handleValidationErrors } = require("../../utils/validation");
const { Sequelize, Model, DataTypes } = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { sequelize } = require("../../db/models");
const { Spots, Review, User, Image } = require("../../db/models");
// const spots = require('../../db/models/spots')
const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("latitude")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("longitude")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];
//GET ALL SPOTS
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();
  res.json({ allSpots });
});
// GET SPOTS BY ID

router.get("/:spotID", async (req, res) => {
  const specificSpot = await Spots.findByPk(req.params.spotID, {
    include: [
      {
        model: Image,
        as: "images",
        attributes: ["url"],
      },
      { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
    ],
  });

  if (!specificSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  const reviewsAggData = await Spots.findByPk(req.params.spotID, {
    include: {
      model: Review,
      attributes: [],
    },
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("*")), "numReviews"],
      [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
    ],
    raw: true,
  });

  const Data = specificSpot.toJSON();
  Data.numReviews = reviewsAggData.numReviews;
  Data.avgStarRating = reviewsAggData.avgStarRating;

  res.json(Data);
});

//CREATE A SPOT

router.post("/spots", requireAuth, validateSpot, async (req, res) => {
  const {
    ownerId,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    name,
    description,
    price,
  } = req.body;

  const { id } = req.user;

  const newSpot = await Spots.create({
    ownerId: id,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    name,
    description,
    price,
  });
  // spotAddress= re.params.address
  //   const existingSpot = await Spots.findOne({
  //     where: {spotAddress}
  // })

  res.json(201, newSpot);
});

//EDIT A SPOT

router.put("/:spotID", requireAuth, validateSpot, async (req, res) => {
  let {
    ownerId,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    name,
    description,
    price,
  } = req.body;

  const { id } = req.user;

  const spot = await Spots.findByPk(req.params.spotID);
  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }
  if (spot.ownerId !== req.user.id) {
    res.status(401);
    res.json({ message: "You must be owner to edit this spot" });
  }
  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.latitude = latitude;
  spot.longitude = longitude;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save({
    ownerId: id,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    name,
    description,
    price,
  });
  return res.json(spot);
});

// DELETE A SPOT

router.delete("/:spotID", requireAuth, async (req, res) => {
  const spot = await Property.findByPk(req.params.spotID);

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }
  if (spot.ownerId !== req.user.id) {
    res.status(401);
    res.json({ message: "You must be owner to edit this spot" });
  }
  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });

  spot.destroy();
  spot.save();
});

// Create a Review for a Spot based on the Spot's id
router.post("/:spotID/reviews/", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  const spot = await Spots.findByPk(req.params.spotID);
  const err = {
    message: "Validation error",
    statusCode: 400,
    errors: {},
  };

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  const existingReview = await Review.findAll({
    where: {
      [Op.and]: [{ spotID: req.params.spotID }, { userId: req.user.id }],
    },
  });

  if (existingReview.length >= 1) {
    return res.status(403).json({
      message: "User already has a review for this property",
      statusCode: 403,
    });
  }

  if (!review) err.errors.review = "Review text is required";

  if (stars < 1) err.errors.star = "Stars must be an integer from 1 to 5";

  if (stars > 5) err.errors.star = "Stars must be an integer from 1 to 5";

  if (!review || !stars) {
    return res.status(400).json(err);
  }

  const newReview = await Review.create({
    userId: req.user.id,
    propertyId: req.params.propertyId,
    review,
    stars,
  });

  res.json(newReview);
});

module.exports = router;
