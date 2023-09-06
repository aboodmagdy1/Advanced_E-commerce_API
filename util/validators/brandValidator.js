const {check, body}=require('express-validator')
const slugify = require("slug");

const validatorMiddleware = require('../../middleware/validatorMiddlewares')

exports.getBrandValidator = [
    //set of rules 
    check('id').isMongoId().withMessage('invalid brand id format'),
    //the validator middleware
    validatorMiddleware
]


exports.createBrandValidator = [
    check('name')
        .notEmpty().
        withMessage('brand name required')
        .isLength({min :3}).
        withMessage('Too short brand name')
        .isLength({max:30})
        .withMessage('Too long brand name'),
    body('name').custom((val,{req})=>{
            req.body.slug = slugify(val)
            return true
        })
    
        ,validatorMiddleware 


]


exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('invalid brand id format'),
    body('name').optional().custom((val,{req})=>{
        req.body.slug = slugify(val)
        return true
    }),
    validatorMiddleware,
]
exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('invalid brand id format'),
    validatorMiddleware
]
