const express = require('express');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();



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
