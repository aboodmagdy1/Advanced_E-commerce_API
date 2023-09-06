const express = require("express");


const {signup,login,forgetPassword,verifyResetCode,resetPassword}=require("../controller/authController")
const {signupValidator,loginValidator}=require("../util/validators/authValidator")

const router = express.Router();

router.post('/login',loginValidator,login)
router.post('/signup',signupValidator,signup)
router.post('/forgetPassword',forgetPassword)
router.post('/verifyResetCode',verifyResetCode)
router.put('/resetPassword',resetPassword)

module.exports = router;
