import express from "express";
import userRoutes from "./UserRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);

export default router