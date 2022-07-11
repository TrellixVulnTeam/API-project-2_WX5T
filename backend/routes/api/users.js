// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spots, Image, Review, Booking } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("last Name is required"),
  // check('password')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors,
];

// Sign up
// router.post("/sign_up", validateSignup, async (req, res) => {
//   const { firstName, lastName, email, password,username } = req.body;

//   const checkEmail = await User.findOne({
//     where: { email },
//   });
//   if (checkEmail) {
//     res.status(403);
//     res.json({
//       message: "User with that email already exists!",
//     });
//   }

//   const user = await User.signup({
//     firstName,
//     lastName,
//     email,
//     password,
//     username
//   });

//   if (!firstName) {
//     res.status(400).json({
//       message: "First Name is required",
//     });
//   }
//   if (!lastName) {
//     res.status(400).json({
//       message: "Last Name is required",
//     });
//   }

//   await setTokenCookie(res, user);

//   return res.json({
//     firstName,
//     lastName,
//     email,
//     password,
//     username
//   });
// });


router.post("/sign_up", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username  } = req.body;

  const trackEmail = await User.findOne({
    where: { email }
  })
  if (trackEmail) {
    res.status(403);
    res.json({
      message: "User with that email already exists!"
    })
  }
  try {
    const user = await User.signup({ firstName, lastName, email, username, password });
    const token = await setTokenCookie(res, user);

    const newUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: token
    };

    return res.json(newUser);

  } catch (error) {
    res.status(403);
    res.json({
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "email": "User with that email already exists"
      }
    })
  }

});
//GET CURRENT USER
router.get("/current", requireAuth, async (req, res) => {
  const user = {
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  };
  return res.json(user);
});

//GET CURRENT SPOTS BY CURRENT USER

router.get("/current/spots", requireAuth, async (req, res) => {
  const { id } = req.user;

  const currSpot = await Spots.findAll({
    where: { ownerId: id },
  });
  res.json(currSpot);
});

//GET ALL REVIEWS OF THE CURRENT USERS

router.get("/current/reviews", requireAuth, async (req, res) => {
  const review = await Review.findAll({
    where: { id: req.user.id },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: Spots, attributes: {
          exclude: ["description", "previewImage", "createdAt", "updatedAt"],
        }},
        { model: Image, attributes: ['url'] },
      ],
    },
  );

  if (!review) {
    res.status(404);
    res.json({ message: "Spot does not exist"})
  }

  res.json(review);
});

//GET ALL OF THE CURRENT USERS BOOKING
router.get("/current/bookings", requireAuth, async (req, res) => {
  const { id } = req.user;
  const bookings = await Booking.findAll({
    include: [
      {
        model: Spots,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "latitude",
          "longitude",
          "name",
          "price",
          "previewImage",
        ],
      },
    ],
    where: { userId: id },
  });
  res.json(bookings);
});

module.exports = router;
