import express from "express";
import {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  validateEmail,
  validateUsername
  // createUser,
  // updateUser,
  // deleteUser,
} from "../controllers/UserController.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", register)
router.post("/login", login)
router.delete("/logout", logout)
router.get("/token", refreshToken)
router.get("/validate/email/:email", validateEmail);
router.get("/validate/username/:username", validateUsername);

// ONLY ADMIN
router.get("/", verifyToken, getUsers);
router.get("/:id", getUserById);
// router.post("/users", createUser); 
// router.patch("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

router.get('/protected', verifyToken, (req, res) => {
  res.json({ msg: "Protected resource accessed successfully" });
});
export default router;
