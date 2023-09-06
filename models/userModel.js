const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      trim: true,
      required: [true, "name is required "],
    },
    slug: {
      type: "String",
      lowercase: true,
    },
    email: {
      type: "String",
      unique: true,
      required: [true, "email is required "],
      lowercase: true,
    },
    phoneNumber: {
      type: "Number",
    },
    profileImg: {
      type: "String",
    },
    password: {
      type: "String",
      minLength: [8, "password is too short "],
      maxLength: [60, "password is too long "],
      required: [true, "password is required "],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwrodResetCodeExipires: Date,
    passwrodResetCodeVerified: Boolean,
    role: {
      type: "String",
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: "Boolean",
      default: true,
    },
    //child refrenceign (one to many) if the number of children is small
    //favorites
    wishlist: [
      //array of product id's
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    adresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },//to make a unique id  for every adress
        alis : "String",
        details:"String",
        phone: "String",
        city: "String",
        postalCode: "String",
      },
    ],
  },
  { timestamps: true }
);

//hash password incase of save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //incase of update

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//hash password incase of update

module.exports = mongoose.model("User", userSchema);
