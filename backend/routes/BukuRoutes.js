import express from "express"
import { createBuku, deleteBuku, getBuku, getBukuById, updateBuku } from "../controllers/BukuController.js"
import { coverUpload } from "../middlewares/uploadImage.js"

const router = express.Router()

router.get("/", getBuku)
router.get("/:id", getBukuById)
router.post("/", coverUpload.single("cover_img"), createBuku)
router.patch("/:id", coverUpload.single("cover_img"), updateBuku)
router.delete("/:id", deleteBuku)

export default router