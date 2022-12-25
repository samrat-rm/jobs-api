const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
require("dotenv").config();

const register = async (req, res) => {
    const user = await User.create(req.body);
    const token = user.createToken();
    res.status(StatusCodes.CREATED).json({
        msg: "User created Successfully !",
        user: {
            name: user.name,
            email: user.email,
        },
        token,
    });
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if ((!email, !password)) {
        throw new BadRequestError("Pleaser enter email and password ! ");
    }
    // since email is unique , we made it in schema , we use email to find user
    let user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Entered Email is not valid !");
    }
    // now verify the password
    const verified = await user.comparePassword(password);
    if (!verified) {
        throw new UnauthenticatedError("User not verified !");
    }
    const token = user.createToken();
    res.status(StatusCodes.OK).json({
        msg: "Login successful !",
        user: {
            name: user.name,
            token,
        },
    });
};

module.exports = {
    register,
    login,
};
