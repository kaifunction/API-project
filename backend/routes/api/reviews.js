const express = require('express');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, ReviewImage, Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async(req, res)=>{
     const reviews = await Review.findAll({
          where : {
               userId : req.user.id,
          },
          include:[
               {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
               },
               {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
               },
               {
                    model: ReviewImage,
                    attributes: ['id', 'url']
               }
          ]
     })
     // console.log('REVIEWS!!!!!:',reviews)
     res.json({
          Reviews: reviews
     })
})




module.exports = router;
