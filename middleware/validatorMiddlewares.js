const {validationResult}=require('express-validator')

const validatorMiddleware = (req,res,next)=>{
    //cathc errors form rules if exist
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors : errors.array()//get the validation errors as an array 
        })
    }
    next()
}




module.exports = validatorMiddleware