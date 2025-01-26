import express from 'express';
import { peminjamanController } from '../controllers/PeminjamanController.js';
import { authMiddleware, staffMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, peminjamanController.createPeminjaman);
router.put('/:id/return', authMiddleware, peminjamanController.returnBuku);
router.get('/history', authMiddleware, peminjamanController.getPeminjamanByUser);

// Staff routes
router.put('/:id/status', authMiddleware, staffMiddleware, peminjamanController.updatePeminjamanStatus);
router.get('/', authMiddleware, staffMiddleware, peminjamanController.getAllPeminjaman);

export default router;