import express from "express"
import { createBuku, getBuku, getBukuById } from "../controllers/BukuController.js"

const router = express.Router()

router.get("/", getBuku)
router.get("/:id", getBukuById)
router.post("/create", createBuku)

export default router