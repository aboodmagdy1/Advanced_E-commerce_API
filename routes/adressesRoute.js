const express = require("express");

const{getLoggedUserAdresses,addAdress,deleteAdress}= require('../controller/adressController');
const { protect ,allowedTO} = require("../controller/authController");

const adressesRouter = express.Router()


adressesRouter.use(protect,allowedTO("user"))
adressesRouter.route("/").get(getLoggedUserAdresses).post(addAdress)
adressesRouter.route("/:adressId").delete(deleteAdress,)
module.exports = adressesRouter