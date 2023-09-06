// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
// eslint-disable-next-line import/extensions
const {  uploadSingleImage} = require("../middleware/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file.buffer) return next();
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  
  if(req.file){
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
    //save image in db
    req.body.image = filename;
  }

  next();
});

//@desc Get Category
//@route GET /api/v1/categories
//@access public
exports.getCategories = factory.getAll(Category);

//@desc Create Category
//@route POST /api/v1/categories
//@access private/Admin,manager
exports.createCategory = factory.createOne(Category);

//@desc   get specifc Category by id
//@route  GET /api/v1/categories/:id
//@access public
exports.getCategory = factory.getOne(Category);

//@desc   UPDATE specifc Category
//@route  (PATCH/PUT )/api/v1/categories/:id
//@access private/Admin,manager
exports.updateCategory = factory.updateOne(Category);

//@desc   Delete specifc Category
//@route  DELETE /api/v1/categories/:id
//@access private/Admin
exports.deleteCategory = factory.deleteOne(Category);
