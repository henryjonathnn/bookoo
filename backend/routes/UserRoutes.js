import express from "express";
import { authController } from "../controllers/UserController.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";
import { auth } from "../middlewares/AuthMiddleware.js";
import { profileUpload } from "../middlewares/uploadImage.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", authController.register)
router.post("/login", authController.login)
router.delete("/logout", authController.logout)
router.get("/token", authController.refreshToken)
router.get("/validate/:field/:value", authController.validateField);
router.post("/", profileUpload.single("profile_img"), authController.createUser);
router.patch("/:id", auth.verifyToken, profileUpload.single("profile_img"), authController.updateUser);
router.delete("/:id", authController.deleteUser);

// Protected Routes 
router.get("/", auth.verifyToken, authController.getUsers);
router.get("/:id", auth.verifyToken, authController.getUserById);

export default router;
