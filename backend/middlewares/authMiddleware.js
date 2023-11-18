const User  = require("../models/userModel.js")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const errorHandler = require("./authMiddleware.js")
const authMiddleware = asyncHandler( async (req ,res , next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token= req.headers.authorization.split(" ")[1];
        try {
            if(token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
                req.user = user;
                next();
            }
        } catch (error) {
            next(errorHandler(400 , "Not Authorized token expired, Please Login again"))
        }
    } else {
        next(errorHandler(500 , "There is no token attached to header"))
    }
})
const isAdmin = asyncHandler(async (req , res , next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email }) 
    if(adminUser.role !== "admin" ) {
        next(errorHandler(500 , "You are not an admin"))
    } else {
        next()
    }
})
module.exports = { authMiddleware , isAdmin }