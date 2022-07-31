const express = require("express");
const { handleValidationErrors } = require("../../utils/validation");
const { Sequelize, Model, DataTypes } = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { sequelize } = require("../../db/models");
const { Spots, Review, User, Image, Booking } = require("../../db/models");
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
// router.get("/all", async (req, res) => {
//   const allSpots = await Spots.findAll();
//   res.json({ allSpots });
// });



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
// const { id } = req.user;
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



  const newSpot = await Spots.create({
    ownerId: req.user.id,
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
    // ownerId,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    name,
    description,
    price,
    previewImage
  } = req.body;

const spot = await Spots.findByPk(req.params.spotID);

if (!spot) {
  res.status(404);
  return res.json({
    message: "Spot couldn't be found",
    statusCode: 404,
  });
} else if (spot.ownerId !== req.user.id) {
  return res
    .status(403)
    .json({ message: "You must be the owner to edit this spot" });
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
spot.previewImage = previewImage;

await spot.save();
return res.json(spot);
});


// DELETE A SPOT
// router.delete("/:spotID", requireAuth, async (req, res) => {
//   const spot = await Spots.findByPk(req.params.spotID);
// console.log("THIS IS DELETE", spot)
//   if (!spot) {
//     res.status(404);
//     res.json({
//       message: "Spot couldn't be found",
//       statusCode: 404,
//     });
//   }
//   if (spot.ownerId !== req.user.id) {
//     res.status(401);
//     res.json({ message: "You must be owner to edit this spot" });
//   }
//   res.json({
//     message: "Successfully deleted",
//     statusCode: 200,
//   });

//   spot.destroy();
//   spot.save();
// });

router.delete("/:spotID", requireAuth, async (req, res) => {
  const spot = await Spots.findByPk(req.params.spotID);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  } else if (spot.ownerId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You must be the owner to delete this spot" });
  }


  await spot.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });


  // spot.save();
});


//get all reviews by spotid
router.get('/:spotID/reviews', async (req, res) => {
  let currentSpotReviews = await Spots.findByPk(req.params.spotID);

  const spotID = req.params.spotID

if (!currentSpotReviews) {
  return res.status(404).json({
    "message": "Spot could not be found",
    "statusCode": 404
  });
}

let currentReviews = await Review.findAll({
  where: {spotID: spotID,},
    include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: Image, attributes: ['url'] }
      ],
  },
);

return res.json(currentReviews);
});








// Create a Review for a Spot based on the Spot's id
router.post("/:spotID/reviews/", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  const spotID = req.params.spotID
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
      [Op.and]: [{ spotID: req.params.spotID }, { userID: req.user.id }],
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
    userID: req.user.id,
    spotID: spotID,
    review,
    stars,

  });

  res.json(newReview);
});


// GET all Bookings for a Spot based on the Spot's id
router.get('/:spotID/bookings', requireAuth, async (req, res) => {

  const ownerBookings = await Booking.findAll({
      where: {spotID: req.params.spotID},
      include: {
          model: User,
          attributes:  ['id', 'firstName', 'lastName']
      }
  })

  const notOwnerBookings = await Booking.findAll({
      where: {spotID: req.params.spotID},
      attributes: ['spotID', 'startDate', 'endDate']
  })
  const spotId = req.params.spotID;

  const spot  = await Spots.findByPk(spotId);

 if (!spot) {
     res.status(404)
     res.json({
       message: "Spot couldn't be found",
       statusCode: 404
     })

 } else if (spot.ownerId === req.user.id) {
     return res.json({ 'Bookings': ownerBookings })
 } else {
     return res.json({ 'Bookings': notOwnerBookings })
 }
})


//Create a Booking from a Spot based on the Spot's id

router.post("/:spotID/bookings", requireAuth, async (req, res) => {
  const spot = await Spots.findByPk(req.params.spotID);
  const { startDate, endDate } = req.body;
//  let currUser= req.user.id

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }


  if (req.user.id === spot.ownerId) {
    return res.status(403).json({
      "message": "Forbidden",
      "statusCode": 403
    });
  }

  const err = {
    message: "Validation error",
    statusCode: 400,
    errors: {},
  };

  if (!startDate) err.errors.startDate = "Start date is required (YYYY-MM-DD)";
  if (!endDate) err.errors.endDate = "End date is required (YYYY-MM-DD)";
  if (startDate > endDate)
    err.errors.endDate = "endDate cannot come before startDate";

  if (!startDate || !endDate || startDate > endDate) {
    return res.status(400).json(err);
  }

  const allBookings = await Booking.findAll({
    attributes: ["startDate", "endDate"],
    where: {
      spotID: req.params.spotID,

    },
    raw: true,
  });

  err.message =
    "Sorry, this spot is already booked for the specified dates";
  err.statusCode = 403;
  err.errors = {};

  for (let allDates of allBookings) {
    let startOfBooking = allDates.startDate;
    let endOfBooking = allDates.endDate;

    if (startDate >= startOfBooking && startDate <= endOfBooking) {
      err.errors.startDate = "Start date conflicts with an existing booking";
    }
    if (endDate >= startOfBooking && endDate <= endOfBooking) {
      err.errors.endDate = "End date conflicts with an existing booking";
    }
  }

  if ("endDate" in err.errors || "startDate" in err.errors) {
    return res.status(403).json(err);
  }
  // const currUser= req.params.userID
  // let userID = currUser
  const newBooking = await Booking.create({
    spotID: req.params.spotID,
    userID : req.user.id,
    startDate,
    endDate,


  });

  res.json(newBooking);
});


//EDIT A BOOKING

router.put('/:bookingID', requireAuth, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingID);
  if (!booking) {
    return res.status(404).json({
      "message": "Booking couldn't be found",
      "statusCode": 404
    })
  }
  if (booking.userID !== req.user.id) {
    return res.status(401).json({
      "message": "Unauthorized to make edits for this booking",
      "statusCode": 401
    })
  }
  const {spotID} = booking.toJSON()
  const allDates = await Booking.findAll({
    attributes: ['startDate', 'endDate'],
    raw: true,
    where: {
      spotID
    }
  })

  const err = {
    "message": "Validation error",
    "statusCode": 400,
    errors: {}
  };
  const {startDate, endDate} = req.body;

  if (new Date(booking.endDate) < new Date()) {
    return res.status(400).json({
      "message": "Past bookings can't be modified",
      "statusCode": 400
    })
  }
  if (new Date(endDate) < new Date()) {
    return res.status(400).json({
      "message": "Cannot set bookings in the past",
      "statusCode": 400
    })
  }

  if (!startDate) err.errors.startDate = "Start date is required"
  if (!endDate) err.errors.endDate = "End date is required"
  if (startDate > endDate) err.errors.endDate = "endDate cannot come before startDate"

  if (!startDate || !endDate || (startDate > endDate)) {
    return res.status(400).json(err)
  }

  err.message = "Sorry, this spot is already booked for the specified dates"
  err.statusCode = 403
  err.errors = {}
  for (let dates of allDates) {
    let start = dates.startDate
    let end = dates.endDate
    if ((startDate >= start && startDate <= end)) {
      err.errors.startDate = "Start date conflicts with an existing booking"
    }
    if ((endDate >= start && endDate <= end)) {
      err.errors.endDate = "End date conflicts with an existing booking"
    }
  }

  if ('endDate' in err.errors || 'startDate' in err.errors) {
    return res.status(403).json(err);
  }

  booking.startDate = startDate
  booking.endDate = endDate

  await booking.save()

  res.json(booking)

})

router.get('/', async (req,res) => {

  let { page, size, maxLatitude, minLatitude, minLongitude, maxLongitude, maxPrice, minPrice} = req.query;
  page = Number(page)
  size = Number(size)

if (isNaN(page)) {
    page = 0
}
if (isNaN(size)) {
    size = 20
}

if (size > 20) {
    size = 20
}
if (page > 10) {
    page = 10
}
const error = {
  "message": "Validation Error",
  "statusCode": 400,
  "errors": {}
}


if (page < 0) {
  error.errors.page = "Page must be greater than or equal to 0"
}
if (size < 0) {
  error.errors.size = "Size must be greater than or equal to 0"
}
if (+maxLatitude > 90) {
  error.errors.maxLatitude = "Maximum latitude is invalid"
}
if (+minLatitude < -90) {
  error.errors.minLatitude = "Minimum latitude is invalid"
}
if (+minLongitude < -180) {
  error.errors.minLongitude = "Maximum longitude is invalid"
}
if (+maxLongitude > 180) {
  error.errors.maxLongitude = "Minimum longitude is invalid"
}
if (Number(minPrice) < 0) {
  error.errors.minPrice = "Minimum price must be greater than 0"
}
if (Number(maxPrice) < 0) {
  error.errors.maxPrice = "Maximum price must be greater than 0"
}

if (page < 0 || size < 0 || +maxLatitude > 90 || +minLongitude < -180 || +maxLongitude > 180 || Number(maxPrice) < 0 || Number(minPrice) < 0) {
return res.status(400).json(error)
}
const options = []
if (maxLatitude) {options.push({lat: {[Op.lte]: Number(maxLatitude)}})}
if (minLatitude) {options.push({lat: {[Op.gte]: Number(minLatitude)}})}
if (maxLongitude) {options.push({lng: {[Op.lte]: Number(maxLongitude)}})}
if (minLongitude) {options.push({lng: {[Op.gte]: Number(minLongitude)}})}
if (maxPrice) {options.push({price: {[Op.lte]: Number(maxPrice)}})}
if (minPrice) {options.push({price: {[Op.gte]: Number(minPrice)}})}

let spot = await Spots.findAll({
  where: {
  [Op.and]: options

},
    limit: size || 20,
    offset: page * size,
});
return res.json({
    spot,
    page,
    size: size || 20
});

})

module.exports = router;
