const User = require("../models/User");
const { UnauthenticatedError } = require("../errors/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticationMiddleware = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
        throw new UnauthenticatedError(
            "Authntication failed. Please, Login to continue"
        );
    }
    try {
        token = token.split(" ")[1];
        let decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { userId: decode.userId, name: decode.name };
        next();
    } catch (err) {
        throw new UnauthenticatedError(
            "User not authnticated. Please, Login to continue"
        );
    }
};

module.exports = authenticationMiddleware;
