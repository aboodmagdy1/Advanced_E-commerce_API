const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "To short subCategory name "],
      maxlength: [32, "To long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      //the parent of this subCategory (child refrenceing )
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a parent category"],
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("SubCategory", subCategorySchema);
