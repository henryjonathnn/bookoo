import express from "express";
import { authController } from "../controllers/UserController.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";
import { auth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", authController.register)
router.post("/login", authController.login)
router.delete("/logout", authController.logout)
router.get("/token", authController.refreshToken)
router.get("/validate/:field/:value", authController.validateField);

// ONLY ADMIN
// router.get("/", auth.verifyToken, auth.requireRole(['admin']), authController.getUsers);
// router.get("/:id", getUserById);
// router.get('/protected', verifyToken, (req, res) => {
//   res.json({ msg: "Protected resource accessed successfully" });
// });
export default router;
