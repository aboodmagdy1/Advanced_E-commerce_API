const express = require("express");

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser
} = require("../controller/userController");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../util/validators/userValidator");

const { allowedTO, protect } = require("../controller/authController");

const router = express.Router();



router.use(protect);

//User
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", changeLoggedUserPasswordValidator, updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUser);

//Admin
router
  .route("/")
  .get(allowedTO("admin", "manager"), getUsers)
  .post(
    allowedTO("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser);
    router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router.use(allowedTO("admin"));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
