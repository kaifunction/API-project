const express = require('express');
// const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');


const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

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


//Edit a Booking
router.put('/:bookingId(\\d+)', restoreUser, requireAuth, validateCreateBookingDate, async(req, res)=>{
     try {
          let { startDate, endDate } = req.body;
          startDate = new Date(startDate);
          endDate = new Date(endDate);
          const booking = await Booking.findByPk(req.params.bookingId);
          // console.log(req.user.id)
          // console.log(booking.userId)
          // console.log(booking)

          if(!booking){
               res.status(404).json({
                    message: "Booking couldn't be found"
               });
          };

          if(!(booking.userId === req.user.id)) return res.status(403).json({
               message: 'Booking must belong to the current user'
          })

          // console.log(new Date())
          if(new Date(endDate) < new Date()){
               return res.status(403).json({
                    message: "Past bookings can't be modified"
               })
          }

          const existingBooking = await Booking.findOne({
               where: {
                    [Op.and]: [
                         { id: { [Op.ne]: booking.id } },
                         {
                              [Op.or]: [
                                   {
                                    [Op.or]:[
                                         {startDate: {[Op.eq]: startDate}},
                                         {startDate: {[Op.eq]: endDate}},
                                         {endDate: {[Op.eq]: startDate}},
                                         {endDate: {[Op.eq]: endDate}}
                                    ]
                                   },
                                   {
                                     [Op.and]: [
                                       { startDate: { [Op.lte]: startDate } },
                                       { endDate: { [Op.gte]: startDate } }
                                     ]
                                   },
                                   {
                                     [Op.and]: [
                                       { startDate: { [Op.lte]: endDate } },
                                       { endDate: { [Op.gte]: endDate } }
                                     ]
                                   },
                                   {
                                     [Op.and]: [
                                       { startDate: { [Op.gte]: startDate } },
                                       { endDate: { [Op.lte]: endDate } }
                                     ]
                                   }
                                 ]
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


          if(startDate) booking.startDate = startDate
          if(endDate) booking.endDate = endDate

          await booking.save();



          res.json(booking)

     }catch(error){
        const errors = handleValidationErrors(error);
        return res.status(400).json({
            message: 'Bad Request',
            errors: errors
        });
     }
})


//Delete a Booking
router.delete('/:bookingId(\\d+)', restoreUser, requireAuth, async(req, res)=>{
     const booking = await Booking.findByPk(req.params.bookingId, {
          include: [
               {
                    model: Spot,
                    // attributes: ['ownerId']
               }
          ]
     })

     // console.log(booking.Spot.ownerId)

     if(!booking){
          res.status(404).json({
               message: "Booking couldn't be found"
          });
     };

     if(!(booking.userId === req.user.id) && !(booking.Spot.ownerId === req.user.id)) return res.status(403).json({
          message: 'Booking must belong to the current user'
     })

     await booking.destroy();

     res.status(200).json({
          message: 'Successfully deleted'
     })
})


//Get all of the Current User's Bookings
router.get('/current', restoreUser, requireAuth, async(req, res)=>{
     const bookings = await Booking.findAll({
          where: {
               userId: req.user.id
          },
          include: [
               {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: {
                         model: SpotImage,
                         attributes: ['url']
                    }
               }
          ]
     });

     const formattedBookings = bookings.map(booking => ({
          id: booking.id,
          spotId: booking.spotId,
          Spot: {
               id: booking.Spot.id,
               ownerId: booking.Spot.ownerId,
               address: booking.Spot.address,
               city: booking.Spot.city,
               state: booking.Spot.state,
               country: booking.Spot.country,
               lat: booking.Spot.lat,
               lng: booking.Spot.lng,
               name: booking.Spot.name,
               price: booking.Spot.price,
               previewImage: booking.Spot.SpotImages[0].url
          },
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
     }))


     res.json({
          Bookings: formattedBookings
     })
})




module.exports = router;
