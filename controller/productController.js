const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const {uploadMixOfImages}=require('../middleware/uploadImageMiddleware')
const factory = require("./handlersFactory");
const Product = require("../models/productModle");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
      //1)proccessing  imageCover
  const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
  .resize(2000, 1333)
  .toFormat("jpeg")
  .jpeg({ quality: 95 })
  .toFile(`uploads/products/${imageCoverFileName}`)

  //save image in db
  req.body.imageCover = imageCoverFileName;

  console.log(req.body.imageCover)

  }

  //2)proccessing images
  if(req.files.images){
      req.body.images =[]
  await  Promise.all( //to wait all the result and all the loop and go to the next operations
        req.files.images.map(async(img,i)=>{
            const imageFileName = `product-${uuidv4()}-${Date.now()}-${i+1}.jpeg`
    
            await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageFileName}`)
          
            //save image in db
            req.body.images.push(imageFileName)
          
        }) 
    
    
    )
    
    console.log(req.body.images)
}
next()
});
//@desc Get Products
//@route GET /api/v1/products
//@access public
exports.getProducts = factory.getAll(Product, "Product");

//@desc Create Product
//@route POST /api/v1/products
//@access private/Admin,manager
exports.createProduct = factory.createOne(Product);
//@desc   get specifc Product by id
//@route  GET /api/v1/products/:id
//@access public
exports.getProduct = factory.getOne(Product,'reviews');

//@desc   UPDATE specifc Product
//@route  (PATCH/PUT )/api/v1/products/:id
//@access private/Admin,manager
exports.updateProducts = factory.updateOne(Product);

//@desc   Delete specifc Product
//@route  DELETE /api/v1/products/:id
//@access private/Admin
exports.deleteProducts = factory.deleteOne(Product);
