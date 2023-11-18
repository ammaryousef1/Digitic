const express = require('express');
const router = express.Router();
const { authMiddleware , isAdmin } = require("../middlewares/authMiddleware.js")
const { createUser, loginUserCtrl, getallUser,  getUser , deleteUser , updatedUser , unblockUser , blockUser, handleRefreshToken , logout } = require('../controller/userCtrl.js');
const { errorhandler } = require('../middlewares/errorHandler.js');
const User = require('../models/userModel.js');

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getallUser);
router.get("/refresh" , handleRefreshToken)
router.get('/logout', logout)
router.get('/:id', authMiddleware , isAdmin , getUser)
router.delete('/:id', deleteUser);
router.put('/edit-user' , authMiddleware , updatedUser);
router.put('/block-user/:id' , authMiddleware , isAdmin, blockUser);
router.put("/unblock-user/:id" , authMiddleware , isAdmin , unblockUser)


module.exports = router;