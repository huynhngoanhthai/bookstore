const { Router } = require("express");
const authController = require("../controllers/authController");
const { jwtAuth } = require("../middleware/jwtAuth");

const router = Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:userId/:token", authController.resetPasswordToken);
router.post("/resetPassword", jwtAuth, authController.resetPassword);
router.post("/deleteMe", jwtAuth, authController.deleteMe);
router.delete("/deleteMe/:userId/:token", authController.deleteMeById);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPasswordToken);

module.exports = router;
