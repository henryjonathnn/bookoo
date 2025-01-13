import express from "express";
import {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { verifyToken, verifyAdmin } from "../middlewares/AuthMiddleware.js";
const router = express.Router();

// AUTH ROUTES
router.post("/register", register)
router.post("/login", login)
router.delete("/logout", logout)

// ONLY ADMIN
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser); 
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
