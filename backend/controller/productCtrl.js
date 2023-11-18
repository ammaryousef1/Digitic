const Product = require("../models/productModel.js");
const asyncHandler = require('express-async-handler');
const User = require("../models/userModel.js");
const errorhandler = require("../middlewares/errorHandler.js")
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  })


const updateProduct = asyncHandler(async (req , res , next) => {
    const { id } = req.params
    console.log(id)
     try {
       if (req.body.title) {
           req.body.slug = slugify(req.body.title)
        }  
        const updateProduct = await Product.findByIdAndUpdate( id  , req.body , {
            new: true,
        })
        res.json(updateProduct)
    } catch (error) {
        next(errorhandler(400 , error))
    }
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
        const findProduct = await Product.findByIdAndDelete(id)
        res.json(findProduct)
    } catch {
        next(errorhandler(400 , error))
    }
})


const getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct)
    } catch {
        next(errorhandler(400 , error))
    }
})



const getAllProduct = asyncHandler(async (req, res) => {
    try {
      // Filtering
      const queryObj = { ...req.query };
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      let query = Product.find(JSON.parse(queryStr));
  
      // Sorting
  
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }
  
      // limiting the fields
  
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }
      const page = req.query.page;
      const limit = req.query.limit;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      if (req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exists");
      }
      const product = await query;
      res.json(product);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { 
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
 };