import express from "express"
import { createBuku, deleteBuku, getBuku, getBukuById, updateBuku } from "../controllers/BukuController.js"

const router = express.Router()

router.get("/", getBuku)
router.get("/:id", getBukuById)
router.post("/", createBuku)
router.patch("/:id", updateBuku)
router.delete("/:id", deleteBuku)

export default router