const express = require('express');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth,  restoreUser } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();


router.delete('/:imageId(\\d+)', restoreUser, requireAuth, async(req, res)=>{
     const image = await SpotImage.findByPk(req.params.imageId, {
          where : {
               ownerId : req.user.id,
          },
          include:{
               model: Spot
          }

     });

     if(!image){
          res.status(404).json({
               message: "Spot Image couldn't be found"
          });
     };

     // console.log(image.Spot.ownerId)

     if(!(image.Spot.ownerId === req.user.id)) return res.status(403).json({
          message: 'Spot must belong to the current user'
     })

     await image.destroy();

     res.json({
          message: "Successfully deleted"
     })
})







module.exports = router;
