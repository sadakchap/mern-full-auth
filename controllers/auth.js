const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const _ = require('lodash');

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
};

exports.sendPasswordResetEmail = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0]["msg"]
        });
    }

    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'Email is not registered yet!'
            });
        }

        const token = jwt.sign({ user: user._id }, process.env.JWT_RESET_PASSWORD_SECRET_KEY, { expiresIn: '10m' });

        return user.updateOne({
            resetPasswordLink: token
        }, (err, success) => {
            if(err){
                return res.status(400).json({
                    error: 'Something went wrong'
                });
            }
            const mailOptions = {
                from: process.env.EMAIL_FROM, // sender address
                to: user.email, // list of receivers
                subject: "Password Reset Link", // Subject line
                html:  `
                    <h1>Please follow the instructions to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/user/password/reset/${token}</p>
                    <hr/>
                    <p>This email contains sensitive information, please do not share it with anyone</p>
                    <p>${process.env.CLIENT_URL}</p>`
            };
            
            transporter.sendMail(mailOptions, function (err, info) {
                if (err){
                    console.log('error sending email');
                    return res.status(400).json({
                        error: 'Couldn\'t send Password reset Link'
                    });
                }
                else return res.status(200).json({ message: "Please, check your Inbox" });
            });
        });
    });
};

exports.resetUserPassword = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0]["msg"]
        });
    }

    const { newPassword, resetPasswordLink } = req.body;
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD_SECRET_KEY, function (err, decoded) {
        if(err){
            return res.status(400).json({
                error: 'Reset token expired, Please regenerate reset link'
            });
        }
        
        User.findOne({ resetPasswordLink }, (err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'Sorry, something went wrong. Please renegerate reset link'
                });
            }

            const updateFields = {
                resetPasswordLink: '',
                password: newPassword
            }

            user = _.extend(user, updateFields);
            user.save((err, result) => {
                if(err){
                    return res.status(400).json({
                        error: 'Sorry, something went wrong. Please renegerate reset link'
                    });
                }
                return res.status(201).json({
                    message: 'Password Reset Successfull, Please login!'
                })
            })

        })

    })

};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT)

exports.googleLoginController = (req, res) => {
    const { idToken } = req.body;
    // verify token
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then( response => {
        const { email_verified, name, email } = response.payload;
        // check if email is verified 
        if(email_verified){
            User.findOne({ email }).exec((err, user) => {
                // find if this email user already
                if(user){
                    const token = jwt.sign({ user: user._id }, process.env.JWT_AUTH_SECRET_KEY, { expiresIn: '7d' });
                    const { _id, name, email, role } = user;
                    return res.status(200).json({
                        token,
                        user: { _id, email, name, role }
                    });
                }else{
                    let password = email + process.env.JWT_AUTH_SECRET_KEY;
                    user = new User({ name, email, password });
                    user.save((err, save) => {
                        if(err){
                            return res.status(400).json({
                                error: 'Sorry, something went wrong'
                            });
                        }
                        const token = jwt.sign({ user: save._id }, process.env.JWT_AUTH_SECRET_KEY, { expiresIn: '7d' });
                        const { _id, name, email, role } = save;
                        return res.status(200).json({
                            token,
                            user: { _id, email, name, role }
                        });
                    })
                }
            })
        }else{
            return res.status(400).json({
                error: 'Google login failed, try again!'
            })
        }
    })
};