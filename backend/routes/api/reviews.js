const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


//Get all Reviews of the Current User

router.get('/current', requireAuth, async(req, res)=>{
     res.json({
          message: 'success'
     })
})
