// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler")

const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");
// eslint-disable-next-line import/extensions
const {uploadSingleImage} =require('../middleware/uploadImageMiddleware.js')


exports.uploadBrandImage = uploadSingleImage('image')
exports.resizeImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
    //save image in db
    req.body.image = filename;
  
    next();
  })
  
//@desc Get Brands
//@route GET /api/v1/brands
//@access public
exports.getBrands =factory.getAll(Brand)

//@desc Create Brand
//@route POST /api/v1/brands
//@access private/Admin,manager
exports.createBrand = factory.createOne(Brand)
//@desc   get specifc Brand by id
//@route  GET /api/v1/brands/:id
//@access public
exports.getBrand =factory.getOne(Brand)



//@desc   UPDATE specifc Brand
//@route  (PATCH/PUT )/api/v1/brands/:id
//@access private/Admin,manager
exports.updateBrand = factory.updateOne(Brand)
//@desc   Delete specifc Brand
//@route  DELETE /api/v1/brands/:id
//@access private/Admin
exports.deleteBrand = factory.deleteOne(Brand);
