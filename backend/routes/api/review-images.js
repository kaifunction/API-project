const express = require('express');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth,  restoreUser } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


router.delete('/:imageId(\\d+)', restoreUser, requireAuth, async(req, res)=>{
     const image = await ReviewImage.findByPk(req.params.imageId, {
          include:{
               model: Review
          }
     });

     if(!image){
          res.status(404).json({
               message: "Review Image couldn't be found"
          });
     };

     if(!(image.Review.userId === req.user.id)) return res.status(403).json({
          message: 'Spot must belong to the current user'
     })

     await image.destroy();

     res.json({
          message: "Successfully deleted"
     })
})







module.exports = router;
