const express = require("express");

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const {requireAuth } = require('../../utils/auth');

const { Spots, Review, User, Image } = require("../../db/models");
// const spots = require('../../db/models/spots')
const router = express.Router();
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
      attributes: ["url"]
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
        attributes: []
    },
    attributes: [
        [sequelize.fn('COUNT', sequelize.col('*')), 'numReviews'],
        [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
      ],
    raw: true
});

const Data = specificSpot.toJSON()
Data.numReviews = reviewsAggData.numReviews
Data.avgStarRating = reviewsAggData.avgStarRating


  res.json(data);
});




router.post('/spots', requireAuth, async(req, res) => {
  const {ownerId,address,city,state,country,latitude,longitude,name,description,price} = req.body;

  const {id}=req.user

  const newSpot = await Spots.create({ownerId:id,address,city,state,country,latitude,longitude,name,description,price})
// spotAddress= re.params.address
//   const existingSpot = await Spots.findOne({
//     where: {spotAddress}
// })



  res.json(201,newSpot)
});







// router.get('/:spotId', async(req,res)=>{
//     const individualSpot = await Spots.findByPK(req.param.id, {
//         include: {model: user, attributes:['id','firstName','lastName']}
//     })
//     if (!individualSpot) {
//         const err = new Error("Property couldn't be found")
//         err.status = 404
//         res.json({
//           message: err.message,
//           code: err.status
//         })
//       } else{
//         numReviews= await Review.count({
//             where: {spotID:individualSpot.id}
//         })
//         const data = {}
//         data.individualSpot ={
//             id: individualSpot.id,
//             address: individualSpot.address,
//             city: individualSpot.city,
//             state: individualSpot.state,
//             country: individualSpot.country,
//             latitude: individualSpot.latitude,
//             longitude: individualSpot.longitude,
//             name: individualSpot.name,
//             description: individualSpot.description,
//             price: individualSpot.price,
//             createdAt: individualSpot.createdAt,
//             updatedAt: individualSpot.createdAt
//         }
//         data.numReviews = numReviews
//       }
// })
module.exports = router;
