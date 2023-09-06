
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    
    title:{
        type : 'String',
        required: true,
        trim:true,
        minLingth: [3, "Too short product title"],
        maxLingth: [100, "Too long product title"],
  
    },
    slug:{
        type : 'String',
        required:true,
        lowercase : true
    },
    description : {
        type : 'String',
        required : [true , 'Product  description is required'],
        minLingth: [20, "Too short product description"],

    },
    quantity:{
        type :'Number',
        required:[true,'Product quantity is required']
    },
    sold:{//to count how many the product is sold
        type: 'Number',
        default: 0
    },    
    price: {
        type : 'Number',
        required : [true,'Product price is required'],
        max:[10000,'Too long product price']
    },
    priceAfterDiscount :{
        type : 'Number',

    },
    colors:[String],
    images:[String],
    imageCover:{
        type :'String',
        required:[true,'Product image is required']
    },
    ratingsAverage:{
        type : 'Number',
        min:[1,'ratingsAverage must be above or equal to 1.0'],
        max:[5,'ratingsAverage must be  below or equal to 5.0']
    },
    ratingsQuantity:{
        type : 'Number',
        default :0
    },

    category : {
        type : mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true,'Product must belong to a category']

    },
    subcategories :[ {//it's possible to chose a a lot of subcategory of specific category form one product
        type : mongoose.Schema.ObjectId,
        ref:'SubCategory'
    }],
    brand:{
        type : mongoose.Schema.ObjectId,
        ref:'Brand',
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})


const setImageUrl = (doc)=>{
    //return  image base url + image name
    if (doc.imageCover) {
      const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
      doc.imageCover = imageCoverUrl;
    }
    if(doc.images){
        const imagesList = []
        doc.images.forEach((img)=>{
            const imageUrl = `${process.env.BASE_URL}/products/${img}`
            imagesList.push(imageUrl)
        })
        doc.images = imagesList
    }
  
  }
  //make a virtual for a filed named reviews from ref : "Review" depend on the foreignField on the reviewSchema ("product") that's value equal the localField in ProductSchema (_id)
productSchema.virtual('reviews',{
    ref:"Review",
    foreignField:'product',
    localField:'_id'
})
productSchema.pre(/^find/,function(next){
    this.populate({path:'category',select:'name -_id'})
    next()
})
productSchema.post('init',(doc)=>{
setImageUrl(doc)
})
productSchema.post('save',(doc)=>{
setImageUrl(doc)
})

module.exports = mongoose.model('Product',productSchema)

