const express = require("express");
const {
      createProduct 
    , getProduct 
    , getAllProduct 
    , updateProduct 
    , deleteProduct } = require("../controller/productCtrl");
const { isAdmin , authMiddleware } = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.post('/' ,  authMiddleware ,  isAdmin ,  createProduct)
router.delete('/:id' ,  authMiddleware ,  isAdmin ,  deleteProduct) 
router.get('/:id' , getProduct ) 
router.put('/:id' ,  authMiddleware ,  isAdmin ,  updateProduct) 
router.get('/' , getAllProduct )
module.exports = router;