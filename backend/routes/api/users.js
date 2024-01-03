const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username is required'),
    check('firstName')
      .exists({ checkFalsy: true })
      .not()
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .not()
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    console.log('USER!!!',user.fields)
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

// router.post(
//     '/',
//     validateSignup,
//     async (req, res) => {
//       const { firstName, lastName, email, password, username } = req.body;
//       const hashedPassword = bcrypt.hashSync(password);

//       let user;
//       try {
//         user = await User.create({ firstName, lastName, email, username, hashedPassword });
//       } catch(err) {
//           if (err.name === 'SequelizeUniqueConstraintError') {
//             if (err.fields.includes('email')) {
//               return res.status(500).json({
//                 message: 'User already exists',
//                 errors: { email: 'User with that email already exists' }
//               });
//             } else if (err.fields.includes('username')) {
//               return res.status(500).json({
//                 message: 'User already exists',
//                 errors: { username: 'User with that username already exists' }
//               });
//             }
//           }
//           throw err;
//         }

//       const safeUser = {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         username: user.username,
//       };

//       await setTokenCookie(res, safeUser);

//       return res.json({
//         user: safeUser
//       });
//     }
//   );



module.exports = router;
