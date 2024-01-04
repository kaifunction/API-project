const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

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


const validateCreateSpotReivew = [
  check('review')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 500 })
    .withMessage('Review text is required'),
  check('stars')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];


const validateCreateBookingDate = [
     check('startDate')
       .exists({ checkFalsy: true })
       .withMessage('startDate is required')
       .custom(startDate => {
          const currentDate = new Date();
          const inputDate = new Date(startDate);
          if(inputDate < currentDate) {
               throw new Error('startDate cannot be in the past')
          }
          return true
       }),
     check('endDate')
       .exists({ checkFalsy: true })
       .withMessage('endDate is required')
       .custom((endDate,  { req }) => {
          const startDate = new Date(req.body.startDate);
          const inputDate = new Date(endDate);
          if(inputDate <= startDate) {
               throw new Error('endDate cannot be on or before startDate')
          }
          return true
       }),
     handleValidationErrors
];

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', restoreUser, requireAuth, async(req, res)=>{
     const { url, preview } = req.body;

     const spot = await Spot.findByPk(req.params.spotId,{
          where : {
               ownerId : req.user.id,
          },
          include: {
               model: SpotImage,
               attributes: ['id']
          }
     })
     console.log(spot)
     if(!spot){
          res.status(404).json({
               message: "Spot couldn't be found"
          });
     };

     if(!(spot.ownerId === req.user.id)) return res.status(403).json({
          message: 'Spot must belong to the current user'
     })

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
});


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req, res)=>{
     const spot = await Spot.findByPk(req.params.spotId, {
          include: [
            {
              model: Review,
              include: [
                {
                  model: ReviewImage,
                  attributes: ['id', 'url']
                }
              ]
            },
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        });

     if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
     }

     const formattedReviews = spot.Reviews.map(review => {
          return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
              id: spot.User.id,
              firstName: spot.User.firstName,
              lastName: spot.User.lastName,
            },
            ReviewImages: review.ReviewImages.map(image => ({
              id: image.id,
              url: image.url,
            })),
          };
     });

     res.json({
          Reviews: formattedReviews
     })
});


//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', restoreUser, requireAuth, validateCreateSpotReivew, async(req, res)=>{
     const { review, stars } = req.body;

     try{
          const spot = await Spot.findByPk(req.params.spotId, {
               include: {
                    model: Review
               }
          });

          if (!spot) {
            return res.status(404).json({
              message: "Spot couldn't be found"
            });
          };

          const existingReview = spot.Reviews.find((review) => review.userId === req.user.id);
          if (existingReview) {
               return res.status(500).json({
                     message: 'User already has a review for this spot'
               });
          }

          const newReview = await Review.create({
               userId: req.user.id,
               spotId: spot.id,
               review,
               stars
          });

          res.status(201).json(newReview)
     } catch (err) {
          if (err instanceof ValidationError) {
            res.status(400).json({ message: 'Validation error', errors: err.errors });
          }
     }
});




//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', restoreUser, requireAuth, async(req, res)=>{
     const spotId = req.params.spotId
     const spot = await Spot.findByPk(spotId);

     if (!spot) {
          return res.status(404).json({
            message: "Spot couldn't be found"
          });
     };

     const owner = spot.ownerId
     const user = req.user.id

     let bookings;

     if(owner === user){
          bookings = await Booking.findAll({
               where: {
                    spotId
               },
               include: [
                    {
                         model: User,
                         attributes: ['id', 'firstName', 'lastName']
                    }
               ]
          });
     } else {
          bookings = await Booking.findAll({
               where: {
                    spotId,
               },
               attributes: ['spotId', 'startDate', 'endDate']
          })
     };


     res.json({
          Bookings: bookings
     })
});



//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', restoreUser, requireAuth, validateCreateBookingDate, async(req, res)=>{
     const { startDate, endDate } = req.body;
     const spotId = req.params.spotId;
     const spot = await Spot.findByPk(spotId);

     if (!spot) {
          return res.status(404).json({
            message: "Spot couldn't be found"
          });
     };

     const owner = spot.ownerId
     const user = req.user.id

     if(owner === user) return res.status(403).json({
          message: 'Spot must NOT belong to the current user'
     });

     let existingBooking = await Booking.findOne({
          where: {
               spotId,
               [Op.or]: [
                    {startDate: {
                         [Op.lte]: startDate, [Op.gt]: endDate
                    }},

                    {endDate: {
                         [Op.gte]: startDate, [Op.lt]: endDate
                    }},

                    {
                         startDate: { [Op.lte]: startDate },
                         endDate: { [Op.gte]: endDate }
                    }
               ]
          }
     })

     if(existingBooking){
          return res.status(403).json({
               message: 'Sorry, this spot is already booked for the specified dates',
               errors: {
                 startDate: 'Start date conflicts with an existing booking',
                 endDate: 'End date conflicts with an existing booking'
               }
          });
     }

     const newBooking = await Booking.create({
          spotId: spotId,
          userId: req.user.id,
          startDate,
          endDate
     });

     res.json(newBooking)
})



//Get details of a Spot from an id
router.get('/:spotId(\\d+)', async(req, res)=>{
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
          ]
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
router.put('/:spotId(\\d+)', restoreUser, requireAuth, validateCreateSpot, async(req, res)=>{
     const { address, city, state, country, lat, lng, name, description, price } = req.body
     const spot = await Spot.findByPk(req.params.spotId, {
          where : {
               ownerId : req.user.id,
          }
     })

     if(!spot){
          res.status(404).json({
               message: "Spot couldn't be found"
          });
     };

     if(!(spot.ownerId === req.user.id)) return res.status(403).json({
          message: 'Spot must belong to the current user'
     })

     if(address) spot.address = address
     if(city) spot.city = city
     if(state) spot.state = state
     if(country) spot.country = country
     if(lat) spot.lat = lat
     if(lng) spot.lng = lng
     if(name) spot.name = name
     if(description) spot.description = description
     if(price) spot.price = price

     await spot.save();

     res.json(spot)
});



//Delete a Spot
router.delete('/:spotId(\\d+)', restoreUser, requireAuth, async(req, res)=>{
     const spot = await Spot.findByPk(req.params.spotId, {
          where : {
               ownerId : req.user.id,
          }
     });

     if(!spot){
          res.status(404).json({
               message: "Spot couldn't be found"
          });
     };

     if(!(spot.ownerId === req.user.id)) return res.status(403).json({
          message: 'Spot must belong to the current user'
     })

     await spot.destroy();

     res.status(200).json({
          message: 'Successfully deleted'
     })
})



//Get All Spots Owned by the Current User
router.get('/current', restoreUser, requireAuth, async(req, res)=> {

     let spots = await Spot.findAll({
          where : {
               ownerId : req.user.id,
          },
          include: [
               {
                    model: SpotImage,
                    // attributes: ['url'],
                    // as: 'previewImage'
               }
          ]
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


     res.json({
          'Spots': spots
     })
})


//Get All Spots
router.get('/', async(req, res)=>{

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
router.post('/', restoreUser, requireAuth, validateCreateSpot, async(req, res)=>{
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
