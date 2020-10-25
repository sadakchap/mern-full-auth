const { check } = require('express-validator');

exports.validSignup = [
    check('name', 'Name field is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be of 7 chars').isLength({ min: 7})
];

exports.validSignin = [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be of 7 chars').isLength({ min: 7})
];

exports.validResetPassword = [
    check('newPassword').isLength({ min: 7}).withMessage('Password must be atleast 7 characters long')
];

exports.validForgotPassword = [
    check('email').isEmail().withMessage('Must be a valid email address')
];