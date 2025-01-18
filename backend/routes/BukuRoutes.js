import express from "express"
import { createBuku, deleteBuku, getBuku, getBukuById, updateBuku } from "../controllers/BukuController.js"
import upload from "../middlewares/uploadImage.js"

const router = express.Router()

router.get("/", getBuku)
router.get("/:id", getBukuById)
router.post("/", upload.single("cover_img"), createBuku)
router.patch("/:id", upload.single("cover_img"), updateBuku)
router.delete("/:id", deleteBuku)

export default router