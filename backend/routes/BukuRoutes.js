import express from "express"
import { getBuku, getBukuById } from "../controllers/BukuController.js"

const router = express.Router()

router.get("/", getBuku)
router.get("/:id", getBukuById)

export default router