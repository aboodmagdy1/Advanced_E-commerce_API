const slugify = require("slug");
const {check, body}=require('express-validator')
const validatorMiddleware = require("../../middleware/validatorMiddlewares")

exports.getCategoryValidator = [
    //set of rules 
    check('id').isMongoId().withMessage('invalid category id format'),
    //the validator middleware
    validatorMiddleware
]


exports.createCategoryValidator = [
    check('name')
        .notEmpty().
        withMessage('Category name required')
        .isLength({min :3}).
        withMessage('Too short Category name')
        .isLength({max:30})
        .withMessage('Too long Category name'),
    body('name').custom((val,{req})=>{
            req.body.slug = slugify(val)
            return true
        })

        ,validatorMiddleware 


]


exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('invalid category id format'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true; // Add this line to return a truthy value
      }),
  

    validatorMiddleware
]
exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('invalid category id format'),
    validatorMiddleware
]
