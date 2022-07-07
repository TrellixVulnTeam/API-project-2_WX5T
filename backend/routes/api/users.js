// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spots } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Please provide a valid email.'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   handleValidationErrors
// ];

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('firstName')
   .exists({ checkFalsy: true })
   .withMessage('First Name is required'),
  check('lastName')
   .exists({ checkFalsy: true })
   .withMessage('last Name is required'),
  // check('password')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];


 // Sign up
 router.post("/sign_up", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  const checkEmail = await User.findOne({
    where: { email }
  })
  if (checkEmail) {
    res.status(403);
    res.json({
      message: "User with that email already exists!"
    })
  }

  const user = await User.signup({ firstName, lastName, email, username, password });

  if (!firstName) {
    res.status(400).json({
      message: "First Name is required"
    })
  }
  if (!lastName) {
    res.status(400).json({
      message: "Last Name is required"
    })
  }


  await setTokenCookie(res, user);

  return res.json({
    user,
  });
});
//GET CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
const user = {
  id: req.user.id,
  firstName: req.user.firstName,
  lastName: req.user.lastName,
  email: req.user.email

}
  return res.json(user)
})

//GET CURRENT SPOTS BY CURRENT USER

router.get("/current/spots", requireAuth, async (req, res) => {
  const { id } = req.user;

  const currSpot = await Spots.findAll({
    where: { ownerId: id },
  });
  res.json(currSpot);
});

module.exports = router;
