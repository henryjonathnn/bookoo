import express from "express";
import userRoutes from "./UserRoutes.js";
import bukuRoutes from "./BukuRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/buku", bukuRoutes);

export default router