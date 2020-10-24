const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role:{
        type: Number,
        default: 0
    },
    resetPasswordLink: {
        type: String,
        default: ''
    },
    is_verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// Password - Virtual Field
userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.securePassword(password);
    })
    .get(function () {
        return this._password
    })

// Schema methods
userSchema.methods = {
    makeSalt: function () {
        return uuidv4();
    },
    securePassword: function (plainPassword) {
        if(!plainPassword) return '';
        try {
            return crypto.createHmac('sha256', this.salt)
                        .update(plainPassword)
                        .digest('hex');
        } catch (err) {
            return '';
        }
    },
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.hashed_password;
    }
}

module.exports = User = mongoose.model('User', userSchema);