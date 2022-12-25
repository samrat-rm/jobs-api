const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const BadRequest = require("../errors/bad-request");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minLength: 3,
        maxLength: 35,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            "Please Enter a valid email",
        ],
        minLength: 3,
        maxLength: 35,
        unique: true, // dosen't allow the same email
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6,
        // we save only hashed password so, in database we can't limit the max length
    },
});

// don't use arrow function in pre, this keyword context will be messed up
UserSchema.pre("save", async function (next) {
    // Checking for user credentials
    if (!this.name || !this.email || !this.password) {
        throw new BadRequest("Please, provide valid registeration details");
    }
    // Encrypt password
    let salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
});

UserSchema.methods.createToken = function () {
    return jwt.sign(
        {
            userId: this._id,
            name: this.name,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRESIN,
        }
    );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = bcryptjs.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
