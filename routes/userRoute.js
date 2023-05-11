const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  refreshUser,
  getUser,
} = require('../controllers/userController');
const { check } = require('express-validator');

router.post('/refresh', refreshUser);

router.get('/users', getUser);

router.post(
  '/login',
  [
    check('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage("This field can't be empty"),
    check('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage("This field can't be empty"),
  ],
  loginUser
);

router.post(
  '/register',
  [
    check('username')
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage('Username must contain at least 3 characters'),
    check('password')
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      //   хотя бы одна цифра
      .matches(/(?=.*?[0-9])/)
      .withMessage('Password must contain at least 1 number')
      //   хотя бы одна буква
      .matches(/(?=.*?[A-z])/)
      .withMessage('Password must contain at least 1 letter')
      //   без пробелов
      .not()
      .matches(/^$|\s+/)
      .withMessage("Password can't have empty white space"),
    //   .withMessage(
    //     'Password must be greater than 4 and contain at least one letter and one number'
    //   ),
    check('first_name')
      .isLength({ min: 3 })
      .withMessage('First name must contains at least 3 characters'),
    check('last_name')
      .isLength({ min: 3 })
      .withMessage('Last name must contains at least 3 characters'),
    check('age').isInt({ min: 1 }).withMessage('Should be a number greater 0'),
    check('confirmPassword')
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Both passwords must be same');
        }
        return true;
      }),
  ],
  registerUser
);

module.exports = router;
