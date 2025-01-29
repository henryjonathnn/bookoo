import express from 'express';
import { notifikasiController } from '../controllers/NotifikasiController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, notifikasiController.getNotifikasi);
router.put('/:id/read', authMiddleware, notifikasiController.markAsRead);
router.put('/read-all', authMiddleware, notifikasiController.markAllAsRead);

export default router;
