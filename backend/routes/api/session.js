// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })

    .withMessage("Email is required"),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors
];
// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;
console.log("THIS IS CREDENTIAL AND PASSWORD",  credential, password)
    const user = await User.login({ credential, password });
console.log("THIS IS THE USER", user)
    if (!user) {
      res.status(401);
      return res.json({
        message: "Invalid credentials",
        statusCode: 401
    })
      };

    if(!req.body){
      res.status(401);
      let msg = "Validation error"
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors:{
          credential: "Email is required",
          password:"Password is required"

        }

      })
    }

    const token = await setTokenCookie(res, user);
      //can also be stored directly into the res.json
    const userReq = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: token
    }

    return res.json(
      userReq
    );


  }
);

  // Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );


  // Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
      } else return res.json(null);
    }
  );



module.exports = router;
