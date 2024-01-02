const express = require('express');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res)=>{
     res.json({
          message: 'success'
     })
})




module.exports = router;
