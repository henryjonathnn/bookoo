import express from "express";
import {
  register,
  login,
  logout,
  getUsers,
  // getUserById,
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

// ONLY ADMIN
router.get("/", verifyToken, getUsers);
// router.get("/users/:id", getUserById);
// router.post("/users", createUser); 
// router.patch("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

router.get('/protected', verifyToken, (req, res) => {
  res.json({ msg: "Protected resource accessed successfully" });
});
export default router;
