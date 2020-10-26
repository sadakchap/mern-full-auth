const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

// create transporter
const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_USER_PASSWORD
        }
    });

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array[0]["msg"]
        });
    }
    console.log(req.body);
    const { email, name, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user){
            console.log('email');
            return res.status(400).json({
                error: 'Email already taken!'
            });
        }
        user = new User({ email, name, password });
        user = await user.save();

        // generate token for activation mail
        const token = jwt.sign({ user: user._id }, process.env.JWT_ACTIVATION_SECRET_KEY, { expiresIn: '1d' });

        const mailOptions = {
            from: process.env.EMAIL_FROM, // sender address
            to: user.email, // list of receivers
            subject: "Account Email Verification", // Subject line
            html:  `
                <h1>Please click the following link to verify your email</h1>
                <p>${process.env.CLIENT_URL}/user/activate/${token}</p>
                <hr/>
                <p>This email contains sensitive information, please do not share it with anyone</p>
                <p>${process.env.CLIENT_URL}</p>
            ` // plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) return res.status(400).json({ err });
            else return res.status(200).json({ message: "Please confirm your email" });
        });

    } catch (err) {
        
    }
    
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0]["msg"]
        });
    }
    const { email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'Email not registered yet!'
            });
        }
        if(!user.authenticate(password)){
            return res.status(400).json({
                error: 'Email & password do not match!'
            });
        }
        const token = jwt.sign({ user: user._id }, process.env.JWT_AUTH_SECRET_KEY, { expiresIn: '7d' });
        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    })

};
exports.signout = (req, res) => {

};

exports.activateUser = async (req, res) => {

    const { token } = req.body;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET_KEY);
            await User.findByIdAndUpdate(decoded.user, { is_verified: true }, { new: true });
            return res.status(201).json({
                message: 'email verified'
            })
        } catch (err) {
            return res.status(401).json({
                error: 'Expired token, resend confirmation email again!'
            })
        }

    }
}