const express = require('express')
const router = express.router()

const {Spot, Review} = require('../../db/models')
const spots = require('../../db/models/spots')
const spots = require('../../db/models/spots')

router.get('/', async(req,res)=>{
const allSpots = await Spot.findAll()
res.json({allSpots})
})

router.get('/:spotId', async(req,res)=>{
    const individualSpot = await Spot.findByPK(req.param.id, {
        include: {model: user, attributes:['id','firstName','lastName']}
    })
    if (!individualSpot) {
        const err = new Error("Property couldn't be found")
        err.status = 404
        res.json({
          message: err.message,
          code: err.status
        })
      } else{
        numReviews= await Review.count({
            where: {spotID:individualSpot.id}
        })
        const data = {}
        data.individualSpot ={
            id: individualSpot.id,
            address: individualSpot.address,
            city: individualSpot.city,
            state: individualSpot.state,
            country: individualSpot.country,
            latitude: individualSpot.latitude,
            longitude: individualSpot.longitude,
            name: individualSpot.name,
            description: individualSpot.description,
            price: individualSpot.price,
            createdAt: individualSpot.createdAt,
            updatedAt: individualSpot.createdAt
        }
        data.numReviews = numReviews
      }
})
