const express = require('express');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth,  restoreUser } = require('../../utils/auth');
const { Review, User, ReviewImage, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

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

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', restoreUser, requireAuth, async(req, res)=>{
     const { url } = req.body;

     const review = await Review.findByPk(req.params.reviewId, {
          // where : {
          //      userId : req.user.id,
          // },
          include: {
               model: ReviewImage
          }
     })
     console.log(review);

     if(!review){
          res.status(404).json({
               message: "Review couldn't be found"
          });
     };

     if(!(review.userId === req.user.id)) return res.status(403).json({
          message: 'Review must belong to the current user'
     })

     if (review.ReviewImages.length >= 10) {
          return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
          });
     };

     const newReviewImage = await ReviewImage.create({
          reviewId: review.id,
          url
     })

     res.status(200).json({
          id: newReviewImage.id,
          url: newReviewImage.url
     })
})

//Edit a Review
router.put('/:reviewId(\\d+)', restoreUser, requireAuth, validateCreateSpotReivew, async(req, res)=>{
     const { review, stars } = req.body;

     // try{
          const reviewByPk = await Review.findByPk(req.params.reviewId);

          if(!reviewByPk){
               res.status(404).json({
                    message: "Review couldn't be found"
               });
          };

          if(!(reviewByPk.userId === req.user.id)) return res.status(403).json({
               message: 'Review must belong to the current user'
          })

          if(review) reviewByPk.review = review
          if(stars) reviewByPk.stars = stars

          await reviewByPk.save()

          res.json(reviewByPk)
     // } catch(err){
     //      if (err instanceof ValidationError) {
     //           res.status(400).json({ message: 'Validation error', errors: err.errors });
     //      }
     // }
})

//Delete a Review
router.delete('/:reviewId(\\d+)', restoreUser, requireAuth, async(req, res)=>{
     const review = await Review.findByPk(req.params.reviewId);

     if(!review){
          res.status(404).json({
               message: "Review couldn't be found"
          });
     };

     if(!(review.userId === req.user.id)) return res.status(403).json({
          message: 'Review must belong to the current user'
     })

     await review.destroy();

     res.status(200).json({
          message: 'Successfully deleted'
     })
})


//Get all Reviews of the Current User
router.get('/current', restoreUser, requireAuth, async(req, res)=>{
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
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [
                         {
                           model: SpotImage,
                           attributes: ['url']
                         },
                    ],
               },
               {
                    model: ReviewImage,
                    attributes: ['id', 'url']
               }
          ]
     });

     const formattedReviews = reviews.map(review => ({
          id: review.id,
          userId: review.userId,
          spotId: review.spotId,
          review: review.review,
          stars: review.stars,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          User: {
            id: review.User.id,
            firstName: review.User.firstName,
            lastName: review.User.lastName,
          },
          Spot: {
            id: review.Spot.id,
            ownerId: review.Spot.ownerId,
            address: review.Spot.address,
            city: review.Spot.city,
            state: review.Spot.state,
            country: review.Spot.country,
            lat: review.Spot.lat,
            lng: review.Spot.lng,
            name: review.Spot.name,
            price: review.Spot.price,
            previewImage: review.Spot.SpotImages[0].url
          },
          ReviewImages: review.ReviewImages.map(image => ({
            id: image.id,
            url: image.url,
          })),
        }));

     res.json({
          Reviews: formattedReviews
     })
});







module.exports = router;
