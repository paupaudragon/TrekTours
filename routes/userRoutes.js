const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// All routes need to run protect from this point.
router.use(authController.protect);

router.patch(
  "/updateMyPassword",
  authController.updatePassword
);

router.get(
  "/me",
  userController.getMe,
  userController.getAUser
);
router.patch("/updateMe",  userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// Only admin can do anything after this point
router.use(authController.restrictTo('admin'));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createAUser);

router
  .route("/:id")
  .get(userController.getAUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
