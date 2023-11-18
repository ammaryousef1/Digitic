const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const {errorhandler} = require('../middlewares/errorHandler.js');
const { generateToken } = require("../config/jwtToken.js");
const jwt = require('jsonwebtoken')
const { generateRefreshToken } = require('../config/refreshtoken')
const { validateMongoDbId } = require('../utils/validateMongodbId.js')
const createUser = asyncHandler(async (req, res , next) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else  {
    next(errorhandler(401 , "User already exist"));
  }
})

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email})
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(findUser.id, {
      refreshToken: refreshToken,
    },
     {new: true})
     res.cookie('refreshToken' , refreshToken , {
      httpOnly :true,
      maxAge: 72 * 60 * 60 * 1000,
     })
    res.json({
      _id: findUser?._id,
      firstname: findUser?.findUser,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id)
    })

  } else {
    next(errorhandler(500 , "Invalid Credentialss"));
  }
})

const handleRefreshToken = asyncHandler(async(req , res , next) => {
  const cookie = req.cookies
  console.log(cookie)
   if (!cookie?.refreshToken) {
    return next(errorhandler(404, "No Refres Token in cookies"));
  }
  const refreshToken =  cookie.refreshToken;
  console.log(refreshToken)
   const user = await User.findOne({ refreshToken })
  if (!user) return next(errorhandler(404, "No Refresh Token present in db or not matched"));
  jwt.verify(refreshToken , process.env.JWT_SECRET ,(err , decoded) => {
    if (err || user.id !== decoded.id) {
      return next(errorhandler(404, "There is something wrong with refresh token"));
    } else {
      const accessToken = generateToken(user?._id)
      res.json({ accessToken })
    }
  })
})

const logout = asyncHandler(async(req , res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) return next(errorhandler(404, "No Refresh Token in Cookies"));
  const refreshToken = cookie.refreshToken
  const user = await User.findOne({ refreshToken })
  if (!user) {
    res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true , 
    })
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate( refreshToken ,
   { refreshToken: "" });
  res.clearCookie("refresToken", {
    httpOnly: true,
    secure: true , 
    })
     return res.sendStatus(204);
})


const getallUser = asyncHandler( async (req , res , next) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers)
  } catch (error) {
    next(errorhandler(500 , "Invalid Credentialss"));
  }
})

const getUser =  asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const getUser = await User.findById(id);
    res.json(getUser)
  } catch (error) {
    next(errorhandler(401 , error));
  }
})

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    next(errorhandler(401 , "user not found"));
  }
})

const updatedUser = asyncHandler(async (req , res , next) => {
 const { _id } = req.user;
 validateMongoDbId(_id)
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {new : true}
      )
      res.send(updateUser)
  } catch (error) {
    next(errorhandler(500 , error));
  }
})

const blockUser = asyncHandler( async(req , res , next) => {
  const { id } = req.params;
  try {
     const block = await User.findByIdAndUpdate(id , {
      isBlocked: true
     },{
      new : true
     } )
     res.json({
      message:"block user success"
     })
  } catch (error) {
    next(errorhandler(500 , error));
  }
})

const unblockUser = asyncHandler( async(req , res , next) => {
  const { id } = req.params;
  try {
     const unblock = await User.findByIdAndUpdate(id , {
      isBlocked: false
     },{
      new : true
     } )
     res.json({
      message:"user unblock"
     })
  } catch (error) {
    next(errorhandler(500 , error));
  }
})



module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getUser,
  deleteUser , 
  updatedUser,
  unblockUser,
  blockUser,
  handleRefreshToken,
  logout
}

