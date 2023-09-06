const multer = require("multer");
const AppError = require("../util/AppError");


const multerOptions = ()=>{
  const multerStorage = multer.memoryStorage();
  
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Only Images allawed!", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload 
}

//multer configuration
exports.uploadSingleImage = (fieldname)=>  multerOptions().single(fieldname)


exports.uploadMixOfImages = (arrayOfFields)=> multerOptions().fields(arrayOfFields)
