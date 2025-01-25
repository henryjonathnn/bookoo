import express from "express";
import { authController } from "../controllers/UserController.js";
import { auth } from "../middlewares/AuthMiddleware.js";
import { profileUpload } from "../middlewares/uploadImage.js";

const router = express.Router();

// Route umum
router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.get("/token", authController.refreshToken);
router.get("/validate/:field/:value", authController.validateField);

router
  .use(auth.verifyToken)
  .post("/", profileUpload.single("profile_img"), authController.createUser)
  .patch("/:id", profileUpload.single("profile_img"), authController.updateUser)
  .delete("/:id", authController.deleteUser)
  .get("/", authController.getUsers)
  .get("/:id", authController.getUserById);

export default router;
