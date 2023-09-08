const crypto = require("crypto");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const AppError = require("../util/AppError");
const sendEmail = require("../util/sendEmail");
const User = require("../models/userModel");
const createToken = require('../util/createToken')
const {sanitizeUser} = require('../util/sanitizeData')

//@desc Singup
//@route POST /api/v1/auth/singup
//@access Public
exports.signup = asyncHandler(async (req, res, next) => {
  //1)create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
  });
  //2)create token
  const token = createToken(user._id);
  res.status(201).json({ status: "success", token, user });
});

//@desc Login
//@route Get /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  //1)check if email and password is exist in body
  //i make it in the validation layer

  //2)check if user exist and password correct (can be make in validation layer)
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }
  //3)generate token to access the protected routes
  const token = createToken(user._id);

  //4)send token
  res.status(200).json({
    status: "success",
    token,
    data:sanitizeUser(user),
  });
});

//@desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1)check if token  exist..if exist get it (client side send the token in the headers)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "You are not logged in  🔴 ...please login to access this route",
        401
      )
    );
  }

  //2)check if token is valid(verify token (check the payload is not modified and jwt not expired))
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // //3)check if user exis in db (by the id in the payload)
  const currentUser = await User.findOne({ _id: decoded.userId });
  if (!currentUser) {
    return next(
      new AppError("The user that belong to this toknen no longer exist", 401)
    );
  }

  //4)check if password is changed after token issued (created) because if changed the token is not valid
  //if passwordChangedAt is exist this mean that user change his password
  //iat of decoded is in seconds, timestamp of getTime is in ms
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    //password changet after token created
    if (passwordChangedAtTimestamp > decoded.iat) {
      return next(
        new AppError(
          "user recently change his password ....please login again",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

//@desc restrict routes to
exports.allowedTO = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1)access the roles
    //2)access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

//@desc forgetPassword
//@route Post /api/v1/auth/forgetPassword
//@access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1)Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user with this email${req.body.email}`, 404)
    );
  }
  // 2)if user exist ,generate random 6 digits hashed reset code and save it in db(to use it in verify)
  //we make it string to make it hash to be save when stored in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  //save hashed password resetCode in db(add the passwrodResetCode in the model first)
  user.passwordResetCode = hashedResetCode;
  //make expire time to the reset code (add passwrodResetCodeExipire in model) 10m
  user.passwrodResetCodeExipires = Date.now() + 10 * 60 * 1000;
  // add passwrodResetCodeVerified in the  model  (to check if we make verify to the resetCode)
  user.passwrodResetCodeVerified = false;

  await user.save();
  // 3)send reset code via email
  const message = ` Hi ${user.name}, \nWe received a request to reset the password on your E-shop Account \n\n ${resetCode} \n\n Enter this code to complete the reset `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (valid for 10 minutes)",
      message,
    });
  } catch (e) {
    user.passwordResetCode = undefined;
    user.passwrodResetCodeExipires = undefined;
    user.passwrodResetCodeVerified = undefined;
    await user.save();

    return next(new AppError("ther is a error in sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Your Password Reset Code sent to email",
  });
});

//@desc   verifyResetCode
//@route  Post /api/v1/auth/verifyResetCode
//@access Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  //1)hash the resetCode from the body  to compare it with one on the db
  const hashedResetCode = crypto
  .createHash("sha256")
  .update(req.body.resetCode)
  .digest("hex");
  
  //2)Get user  based on reset code
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwrodResetCodeExipires: { $gt: Date.now() },// the time of expiration gt the current time to check if the code is still valid
  });

  if(!user ){
    return next(new AppError('Reset Code invalid or expired',400))
  }

  //3) reset code valid
  user.passwrodResetCodeVerified = true
  await user.save()

  res.status(200).json({
    status: 'success'
  })

});

//@desc   resetPassword
//@route  Post /api/v1/auth/resetPassword
//@access Public

exports.resetPassword = asyncHandler (async (req,res,next) => {
  //1)get user by email and check if the reset code is verifyed(passwordResetCode = true)
  const user = await User.findOne({email:req.body.email})
  
  if(!user){
    return next(new AppError('there is no user with this email',404))
  }
  //2)check if code is verifyed
  if(!user.passwrodResetCodeVerified){
    return next(new AppError('reset Code not verified',400))
  }

  //3)update user password and delete the related data to reset password
  user.password = req.body.newPassword
  user.passwordResetCode = undefined
  user.passwrodResetCodeExipires = undefined
  user.passwrodResetCodeVerified = undefined
  await user.save()

  // 4)if every this is ok , generate new token 
  const token = createToken(user._id)
  res.status(200).json({status:'success',token,message :'Your password has been updated successfully'})

})


