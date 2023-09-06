const mongoose = require("mongoose");

//1-schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Brand name must be unique"],
      required: [true, "Brand name required"],
      minLingth: [3, "Too short category name"],
      maxLingth: [30, "Too long category name"],
    },
    slug: {
      //a and b ==> a-and-b in the URL
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true, //this add two features to the document (createdAt , updatedAt)
  }
);


const setImageUrl = (doc)=>{
  //return  image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }

}

//this mongoose middleware for make the frontend process easy
//after the document is einitialized make this preccess (make the image in the api linke url and in db name of the image only)
//findOne,findAll,UpdateOne
brandSchema.post("init", (doc) => {
setImageUrl(doc)
});
//createOne (after save because init don't work with create or save)
brandSchema.post("save", (doc) => {
setImageUrl(doc)
});


//2-modle
module.exports = mongoose.model("Brand", brandSchema);
