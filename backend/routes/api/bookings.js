const express = require("express");
const { handleValidationErrors } = require("../../utils/validation");
const { Sequelize, Model, DataTypes } = require("sequelize");

const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { sequelize } = require("../../db/models");
const { Spots, Review, User, Image, Booking } = require("../../db/models");
const spots = require('../../db/models/spots')
const router = express.Router();

//Create A BOOKING from a Spot based on the Spot's id

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
        spotId: req.params.spotID,

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

router.put("/:bookingID", requireAuth, async (req, res) => {

    const editBooking = await Booking.findByPk(req.params.bookingID);

    if (!editBooking) {
      return res.status(404).json({
        message: "Booking couldn't be found",
        statusCode: 404,
      });
    }

    if (editBooking.userID !== req.user.id) {
      return res.status(401).json({
        message: "You must be the owner of this booking to edit",
        statusCode: 401,
      });
    }

    const { spotID } = editBooking.toJSON();
    const bookings = await Booking.findAll({
      attributes: ["startDate", "endDate"],
      where: {
        spotID,
      },
      raw: true,
    });

    const err = {
      message: "Validation error",
      statusCode: 400,
      errors: {},
    };
    const { startDate, endDate } = req.body;

    if (editBooking.endDate < Date.now()) {
      return res.status(400).json({
        message: "You cannot edit a past booking",
        statusCode: 400,
      });
    }

    if (!startDate) err.errors.startDate = "Start date is required";
    if (!endDate) err.errors.endDate = "End date is required";
    if (startDate > endDate)
      err.errors.endDate = "endDate cannot come before startDate";

    if (!startDate || !endDate || endDate < startDate) {
      return res.status(400).json(err);
    }

    err.message =
      "Sorry, this property is already booked for the specified dates";
    err.statusCode = 403;
    err.errors = {};

    for (let dates of bookings) {
      let start = dates.startDate;
      let end = dates.endDate;
      if (startDate >= start && startDate <= end) {
        err.errors.startDate = "Start date conflicts with an existing booking";
      }
      if (endDate >= start && endDate <= end) {
        err.errors.endDate = "End date conflicts with an existing booking";
      }
    }

    if ("endDate" in err.errors || "startDate" in err.errors) {
      return res.status(403).json(err);
    }

    editBooking.startDate = startDate;
    editBooking.endDate = endDate;

    await editBooking.save();

    res.json(editBooking);
  });

// Delete a Booking
router.delete('/:bookingID', requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingID);
    if (!booking || booking.userID !== req.user.id) {
      return res.status(404).json({
        "message": "Booking couldn't be found",
        "statusCode": 404
      })
    }
    const {startDate} = booking.toJSON()

    if (new Date(startDate) < new Date()) {
      return res.status(400).json({
        "message": "Bookings that have been started can't be deleted",
        "statusCode": 400
      })
    }

    await booking.destroy();
    res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  })



module.exports = router;
