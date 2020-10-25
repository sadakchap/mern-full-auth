const express = require('express');
const router = express.Router();
const { signup, signin, signout, activateUser } = require('../controllers/auth');
const { validSignup } = require('../helpers/valid');

router.post('/signup', validSignup, signup);
router.post('/signin', signin);
router.get('/signout', signout);

router.post('/activate', activateUser);


router.get('/test', (req, res) => {
    return res.status(200).json({
        message: 'you are logged in'
    });
})

module.exports = router;