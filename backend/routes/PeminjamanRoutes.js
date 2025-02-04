import express from 'express';
import { peminjamanController } from '../controllers/PeminjamanController.js';
import { authMiddleware, staffMiddleware } from '../middlewares/AuthMiddleware.js';
import { createUploadMiddleware } from '../middlewares/uploadImage.js';

const router = express.Router();

const buktiPengirimanUpload = createUploadMiddleware({ 
    subFolder: 'bukti-pengiriman', 
    fieldName: 'bukti_pengiriman' 
  });

// User routes
router.post('/', authMiddleware, peminjamanController.createPeminjaman);
router.put('/:id/return', authMiddleware, peminjamanController.returnBuku);
router.get('/history', authMiddleware, peminjamanController.getPeminjamanByUser);

// Staff routes
router.put('/:id/status', authMiddleware, staffMiddleware, peminjamanController.updatePeminjamanStatus);
router.get('/', authMiddleware, staffMiddleware, peminjamanController.getAllPeminjaman);
router.put(
    '/:id/konfirmasi-pengiriman', 
    authMiddleware, 
    staffMiddleware,
    buktiPengirimanUpload.single('bukti_pengiriman'),
    peminjamanController.konfirmasiPengiriman
  );
router.get('/earliest-date', peminjamanController.getEarliestPeminjamanDate);
router.get('/by-date', authMiddleware, staffMiddleware, peminjamanController.getPeminjamanByDate);

export default router;