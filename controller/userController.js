// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const AppError = require("../util/AppError");
const factory = require("./handlersFactory");
const User = require("../models/userModel");
const createToken = require("../util/createToken");
// eslint-disable-next-line import/extensions
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware.js");

exports.uploadUserImage = uploadSingleImage("profileImg");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);
  //save image in db
  req.body.image = filename;

  next();
});

//Admins

//@desc Get Users
//@route GET /api/v1/users
//@access private
exports.getUsers = factory.getAll(User);

//@desc Create User
//@route POST /api/v1/users
//@access private
exports.createUser = factory.createOne(User);
//@desc   get specifc User by id
//@route  GET /api/v1/users/:id
//@access private
exports.getUser = factory.getOne(User);

//@desc   UPDATE specifc User data
//@route  (PATCH/PUT )/api/v1/users/:id
//@access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new AppError(`No user wiht this id : ${req.params.id}`, 404));
  }

  res.status(200).json({ status: "success", data: user });
});

//@desc   UPDATE specifc User password
//@route  (PATCH/PUT )/api/v1/users/:id
//@access private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new AppError(`No user wiht this id : ${req.params.id}`, 404));
  }

  res.status(200).json({ status: "success", data: user });
});
//@desc   Delete specifc User
//@route  DELETE /api/v1/users/:id
//@access private
exports.deleteUser = factory.deleteOne(User);

//Logged User

// @desc Get logged user data
// @route Get /api/v1/users/getMe
// @access private/protect

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  private/protect
// this middleware is diffrent from the changeUserPassword that the 2th one is when admin change password we don't need to create new token but 1st is when user change password we want him to still logged so we make a new token
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //1)update user password based on user payload(req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(), //to validate the token
    },
    {
      new: true,
    }
  );

  // 2)create token
  const token = createToken(user._id);
  res.status(200).json({ status: "success", token, data: user });
});

// @desc    update logged user data except pass and role
// @route   PUT /api/v1/users/updateMe
// @access  private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
    },
    { new: true } // to return the updated user after changes is applied
  );
  res.status(200).json({ status: "success", data: updatedUser });
});

// @desc    delete logged user
// @route   Delete /api/v1/users/deleteMe
// @access  private/protect
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).send();
});

