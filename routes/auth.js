const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { signup, signin, signout } = require('../controllers/auth');

router.post('/signup', [
    check('name', 'Name field is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be of 7 chars').isLength({ min: 7})
], signup);

router.post('/signin', signin);
router.get('/signout', signout);


router.get('/test', (req, res) => {
    return res.status(200).json({
        message: 'you are logged in'
    });
})

module.exports = router;