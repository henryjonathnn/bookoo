import express from "express";
import { bukuController } from "../controllers/BukuController.js";
import { coverUpload } from "../middlewares/uploadImage.js";
import { adminMiddleware, authMiddleware, staffMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
router
  .get("/", bukuController.getBuku)
  .post("/", authMiddleware, adminMiddleware, coverUpload.single("cover_img"), bukuController.createBuku)
  .get("/kategori", bukuController.getKategori);

router
  .get("/:id", authMiddleware, bukuController.getBukuById)
  .patch("/:id", authMiddleware, adminMiddleware, coverUpload.single("cover_img"), bukuController.updateBuku)
  .delete("/:id", authMiddleware, adminMiddleware, bukuController.deleteBuku);

export default router;