const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [handleValidationErrors];
const validateCreateSpot = [
     check('address')
       .exists({ checkFalsy: true })
       .not()
       .withMessage('Street address is required'),
     check('city')
       .exists({ checkFalsy: true })
       .isLength({ min: 1 })
       .not()
       .withMessage('City is required'),
     check('state')
       .exists({ checkFalsy: true })
       .isLength({ min: 1 })
       .not()
       .withMessage('State is required'),
     check('country')
       .exists({ checkFalsy: true })
       .isLength({ min: 1 })
       .not()
       .withMessage('Country is required'),
     check('lat')
       .isFloat({ min: -90, max: 90 })
       .withMessage('Latitude must be within -90 and 90'),
     check('lng')
       .isFloat({ min: -180, max: 180 })
       .withMessage('Longitude must be within -180 and 180'),
     check('name')
       .exists({ checkFalsy: true })
       .isLength({ min: 1, max: 50 })
       .withMessage('Name must be less than 50 characters'),
     check('description')
       .exists({ checkFalsy: true })
       .isLength({ min: 1, max: 500 })
       .withMessage('Description is required'),
     check('price')
       .isInt({ min: 0 }).withMessage('Price per day must be a positive number')
       .isNumeric()
       .withMessage('Price per day must be a positive number'),
     handleValidationErrors
   ];


//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, validateSpot, async(req, res)=>{
     const { url, preview } = req.body;

     const spot = await Spot.findByPk(req.params.spotId,{
          where : {
               ownerId : req.user.id,
          },
          include: {
               model: SpotImage,
               attributes: ['id']
          },
     })
     console.log(spot)
     if(!spot){
          res.status(404).json({
               message: "Spot couldn't be found"
          });
     };

     const newImage = await SpotImage.create({
          spotId: spot.id,
          url,
          preview
     });

     const responseData = {
       id: newImage.id,
       url: newImage.url,
       preview: newImage.preview
     };
     res.json(responseData)
})


//Get details of a Spot from an id
router.get('/:spotId(\\d+)',validateSpot, async(req, res)=>{
     const spots = await Spot.findByPk(req.params.spotId, {
          include: [
               {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
               },
               {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
               }
          ],
     });

     if(!spots){
          res.status(404).json({
               message: "Spot couldn't be found"
          });
     };

     spots.dataValues.Owner = spots.dataValues.User
     delete spots.dataValues.User;


     const reviews = await Review.findAll({
       where: {
         spotId: req.params.spotId
       }
     });

     let ratingSum = 0;
     let ratingCount = 0;
     for (const review of reviews) {
          ratingSum += review.stars;
          ratingCount++;
     };

     spots.dataValues.numReviews = ratingCount;
     spots.dataValues.avgStarRating = ratingSum / ratingCount;

     res.json(spots)
});


//Edit a Spot
router.put('/:spotId(\\d+)',requireAuth, validateSpot, async(req, res)=>{
     res.json({
          message: "success"
     })
})



//Get All Spots Owned by the Current User
router.get('/current', requireAuth, validateSpot, async(req, res)=> {

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
          // console.log(spot.dataValues.SpotImages[0].url)
          if(!spot.dataValues.SpotImages[0].url){
               return res.json({
                    message: 'Need to add an image to the Spot'
               })
          };
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


//Create a Spot
router.post('/', requireAuth, validateCreateSpot, async(req, res)=>{
     const { address, city, state, country, lat, lng, name, description, price } = req.body;

     try{
          const newSpot = await Spot.create({
               ownerId: req.user.id,
               address,
               city,
               state,
               country,
               lat,
               lng,
               name,
               description,
               price
             });
             res.status(201).json(newSpot);
     } catch (err){
          if (err instanceof SequelizeValidationError) {
               res.status(400).json({ message: 'Validation error', errors: err.errors });
             } else {
               console.error(err);
               res.status(500).json({ message: 'Server error' });
             }
     }
})





module.exports = router;
