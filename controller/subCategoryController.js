const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

//for nested routes

//filterObject method to get subCategories of specifec category
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//because the validation layer check the body before the createSubCategory middleware is passed
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//@desc Get subCategory
//@route GET /api/v1/subCategories
//@access public
exports.getSubCategories = factory.getAll(SubCategory);

//@desc Create SubCategory
//@route POST /api/v1/subcategories
//@access private/Admin,manager
exports.createSubCategory = factory.createOne(SubCategory);

//@desc   get specifc subCategory by id
//@route  GET /api/v1/subCategories/:id
//@access public
exports.getSubCategory = factory.getOne(SubCategory);

//@desc   UPDATE specifc subCategory
//@route  (PATCH/PUT )/api/v1/subCategories/:id
//@access private/Admin,manager
exports.updateSubCategory = factory.updateOne(SubCategory);

//@desc   Delete specifc subCategory
//@route  DELETE /api/v1/subCategories/:id
//@access private/Admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);
