const express = require("express");
const { handleValidationErrors } = require("../../utils/validation");
const { Sequelize, Model, DataTypes } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { sequelize } = require("../../db/models");
const { Spots, Review, User, Image, Booking } = require("../../db/models");
const spots = require('../../db/models/spots')
const router = express.Router();


//Add an Image to a Spot based on the Spot's id
router.post("/:spotID/image", requireAuth, async (req, res) => {
    const { url } = req.body;
    const currentUserId = req.user.id;
    const spot = await Spots.findByPk(req.params.spotID, {
      where: {
        ownerId: req.user.id,
      },
    });

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404,
      });
    }

    if (spot.ownerId !== currentUserId) {
      res.status(403);
      res.json({
        message: "Only owners of the spot can add an image",
        statusCode: 403,
      });
    }

    const allImages = await Image.findAll({
      where: {
        [Op.and]: [
          { spotID: req.params.spotID },
        //   { imageableType: "Spot" },
        ],
      },
    });

    let image = await Image.create({
      url,
      imageableId: allImages.length + 1,
    //   imageableType: "Spot",
      spotID: req.params.spotID,
    });

    image = image.toJSON();

    res.json(image);
  });

// Add an Image to a Review based on the Review's id
router.post("/:reviewID/reviewImage", requireAuth, async (req, res) => {
    const { url } = req.body;
    const currUser = req.user.id;
    const review = await Review.findByPk(req.params.reviewID, {
      where: { userId: req.user.id },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404,
      });
    }

    if (review.userID !== currUser) {
      res.status(403);
      res.json({
        message: "Only owners of the property can add an image",
        statusCode: 403,
      });
    }

    const images = await Image.findAll({
      where: {
        [Op.and]: [
          { reviewID: req.params.reviewID },
        //   { imageableType: "Review" },
        ],
      },
    });

    if (images.length > 10) {
      return res.status(400).json({
        message: "Maximum number of images for this resource was reached",
        statusCode: 400,
      });
    }

    const newImage = await Image.create({
      reviewID: req.params.reviewID,
      spotID: review.spotID,
    //   imageableId: allImages.length + 1,
    //   imageableType: "Review",
      url,
    });

    res.json(newImage);
  });

//   / Delete an Image
router.delete('/:imageID', requireAuth, async (req, res) => {
    const image = await Image.findByPk(req.params.imageID, {
      include: [
        {
          model: Review
        }
      ]
    })
    if (!image || image?.Review?.userId !== req.user.id) {
      return res.status(404).json({
        "message": "Image couldn't be found",
        "statusCode": 404
      })
    }
    await image.destroy()
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  })

  // Delete an Image
// router.delete('/:imageId', requireAuth, async (req, res) => {
//     const image = await Image.findByPk(req.params.Id);

//     if (!image) {
//       res.status(404);
//       res.json({
//         message: "Image couldn't be found",
//         statusCode: 404,
//       });
//     }

//     if (Image.reviewID || Image.spotID !== req.user.id) {
//       res.status(403);
//       res.json({
//         message: "Image must belong to current user in order to delete",
//         statusCode: 403,
//       });
//     }

//     image.destroy();
//     image.save();

//     res.json({
//       message: "Successfully deleted",
//       statusCode: 200,
//     });
//   })





module.exports = router;
