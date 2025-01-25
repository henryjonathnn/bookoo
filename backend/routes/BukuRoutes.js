import express from "express";
import { bukuController } from "../controllers/BukuController.js";
import { coverUpload } from "../middlewares/uploadImage.js";

const router = express.Router();

// Ensure all methods exist in the controller
router
  .get("/", bukuController.getBuku)
  .post("/", coverUpload.single("cover_img"), bukuController.createBuku);

router
  .get("/:id", bukuController.getBukuById)
  .patch("/:id", coverUpload.single("cover_img"), bukuController.updateBuku)
  .delete("/:id", bukuController.deleteBuku);

export default router;