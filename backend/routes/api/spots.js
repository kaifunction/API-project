const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [handleValidationErrors]


//Get All Spots Owned by the Current User
router.get('/current', requireAuth, async(req, res)=> {

     let spots = await Spot.findAll({
          where : {
               ownerId : req.user.id,
          },
          include: [
               {
                    model: SpotImage,
                    attributes: ['url'],
                    // as: 'previewImage'
               }
          ],
     });
     // console.log(spots)

     for (const spot of spots) {
          const reviews = await Review.findAll({
            where: {
              spotId: spot.id
            }
          });

          let ratingSum = 0;
          let ratingCount = 0;
          for (const review of reviews) {
               ratingSum += review.stars;
               ratingCount++;
          }

          spot.dataValues.avgRating = ratingSum / ratingCount;
          // console.log(spot)
          spot.dataValues.previewImage = spot.dataValues.SpotImages[0].url;
          delete spot.dataValues.SpotImages;
     }
     // console.log(spot.dataValues.previewImage)
     // console.log(spots)



     res.json({
          'Spots': spots
     })
})


//Get All Spots
router.get('/', validateSpot, async(req, res)=>{

     let spots = await Spot.findAll({
          include: [
               {
                    model: SpotImage,
                    attributes: ['url'],
                    // as: 'previewImage'
               }
          ],
     });

     for (const spot of spots) {
          const reviews = await Review.findAll({
            where: {
              spotId: spot.id
            }
          });

          let ratingSum = 0;
          let ratingCount = 0;
          for (const review of reviews) {
               ratingSum += review.stars;
               ratingCount++;
          }

          spot.dataValues.avgRating = ratingSum / ratingCount;
     }

     spots.forEach(spot =>{

          spot.dataValues.previewImage = spot.SpotImages[0].url
          delete spot.dataValues.SpotImages;
     })

     res.json({
          "Spots": spots
     })
})






module.exports = router;
