import express from "express";
import userRoutes from "./UserRoutes.js";
import bukuRoutes from "./BukuRoutes.js";
import peminjamanRoutes from "./PeminjamanRoutes.js";
import notifikasiRoutes from "./NotifikasiRoutes.js";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/buku", bukuRoutes);
router.use("/peminjaman", peminjamanRoutes);
router.use("/notifikasi", notifikasiRoutes);

export default router;
