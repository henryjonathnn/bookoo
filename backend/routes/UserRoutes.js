import express from "express";
import { authController } from "../controllers/UserController.js";
import { profileUpload } from "../middlewares/uploadImage.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { adminMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Route umum
router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.get("/token", authController.refreshToken);
router.get("/validate/:field/:value", authController.validateField);

router
  .use(authMiddleware)
  .post("/", adminMiddleware, profileUpload.single("profile_img"), authController.createUser)
  .patch("/:id", adminMiddleware, profileUpload.single("profile_img"), authController.updateUser)
  .delete("/:id", adminMiddleware, authController.deleteUser)
  .get("/", authMiddleware, authController.getUsers)
  .get("/:id", authMiddleware, authController.getUserById);

export default router;