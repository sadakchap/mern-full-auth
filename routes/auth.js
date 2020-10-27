const express = require('express');
const router = express.Router();
const { signup, signin, signout, activateUser, sendPasswordResetEmail, resetUserPassword, googleLoginController } = require('../controllers/auth');
const { validSignup, validSignin, validForgotPassword, validResetPassword } = require('../helpers/valid');

router.post('/signup', validSignup, signup);
router.post('/signin', validSignin,signin);
router.get('/signout', signout);

router.post('/activate', activateUser);
router.put('/passwords/forget', validForgotPassword, sendPasswordResetEmail);
router.put('/password/reset', validResetPassword, resetUserPassword);

// social login
router.post('/googlelogin', googleLoginController);


router.get('/test', (req, res) => {
    return res.status(200).json({
        message: 'you are logged in'
    });
})

module.exports = router;