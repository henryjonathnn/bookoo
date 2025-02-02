import { Peminjaman, Buku, User, Notifikasi } from "../models/index.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs/promises";
import { notifikasiController } from "./NotifikasiController.js";

// Tambahkan fungsi helper untuk generate resi
const generateResiNumber = () => {
  const prefix = "BKO"; // BooKoo
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const peminjamanController = {
  // Create a new borrowing request
  createPeminjaman: async (req, res) => {
    const transaction = await Peminjaman.sequelize.transaction();
    try {
      const userId = req.user.id; // Ambil id user dari token
      
      const peminjaman = await Peminjaman.create({
        ...req.body,
        id_user: userId,
        status: 'PENDING'
      }, { transaction });

      const buku = await Buku.findByPk(req.body.id_buku);
      
      // Create notification
      await notifikasiController.createNotifikasi(
        userId, // Gunakan userId yang sudah diambil
        peminjaman.id,
        `Anda telah berhasil menambahkan permintaan data peminjaman buku "${buku.judul}", tunggu admin mensetujui permintaan anda`,
        'PEMINJAMAN_CREATED',
        transaction
      );

      await transaction.commit();
      res.status(201).json(peminjaman);
    } catch (error) {
      await transaction.rollback();
      console.error('Error in createPeminjaman:', error);
      res.status(500).json({ msg: error.message });
    }
  },

  // Staff approves or rejects borrowing request
  updatePeminjamanStatus: async (req, res) => {
    const transaction = await Peminjaman.sequelize.transaction();

    try {
      const { id } = req.params;
      const { 
        status, 
        alasan_penolakan, 
        nomor_resi 
      } = req.body;

      const peminjaman = await Peminjaman.findByPk(id, { 
        include: [
          { model: Buku, as: 'buku' },
          { model: User, as: 'user' }
        ],
        transaction 
      });

      if (!peminjaman) {
        await transaction.rollback();
        return res.status(404).json({ msg: "Peminjaman tidak ditemukan" });
      }

      const updateData = {
        status,
        id_staff: req.user.id
      };

      if (status === "DITOLAK") {
        updateData.alasan_penolakan = alasan_penolakan;
        // Restore book stock
        await peminjaman.buku.increment('stock', { by: 1, transaction });
      }

      if (status === "DIKIRIM") {
        updateData.nomor_resi = nomor_resi;
        updateData.tgl_pinjam_aktual = new Date();
      }

      if (status === "DIPINJAM") {
        updateData.tgl_pinjam_aktual = new Date();
      }

      await peminjaman.update(updateData, { transaction });

      // Create notification for user
      let message;
      let notifType;

      switch (status) {
        case 'DIPROSES':
          message = `Permintaan peminjaman buku "${peminjaman.buku.judul}" telah disetujui, admin sedang memproses buku sesuai dengan permintaan peminjaman anda`;
          notifType = 'PEMINJAMAN_DIPROSES';
          break;
        case 'DIKIRIM':
          message = `Admin telah selesai memproses peminjaman buku "${peminjaman.buku.judul}", dan sedang mengirimkan buku anda`;
          notifType = 'PEMINJAMAN_DIKIRIM';
          break;
        case 'DITOLAK':
          message = `Maaf, permintaan peminjaman buku "${peminjaman.buku.judul}" ditolak. Alasan: ${alasan_penolakan}`;
          notifType = 'PEMINJAMAN_DITOLAK';
          break;
        case 'DIKEMBALIKAN':
          message = `Buku "${peminjaman.buku.judul}" telah berhasil dikembalikan. Terima kasih telah meminjam!`;
          notifType = 'PEMINJAMAN_DIKEMBALIKAN';
          break;
      }

      if (message && notifType) {
        await notifikasiController.createNotifikasi(
          peminjaman.user.id, // Gunakan ID user dari peminjaman
          peminjaman.id,
          message,
          notifType,
          transaction
        );
      }

      await transaction.commit();

      res.status(200).json({
        msg: "Status peminjaman berhasil diperbarui",
        data: peminjaman
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating peminjaman status:", error);
      res.status(500).json({ 
        msg: "Gagal memperbarui status peminjaman",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // User or staff returns books
  returnBuku: async (req, res) => {
    const transaction = await Peminjaman.sequelize.transaction();

    try {
      const { id } = req.params;
      const { bukti_pembayaran_denda } = req.body;

      const peminjaman = await Peminjaman.findByPk(id, { 
        include: [
          { model: Buku, as: 'buku' },
          { model: User, as: 'user' }
        ],
        transaction 
      });

      if (!peminjaman) {
        await transaction.rollback();
        return res.status(404).json({ msg: "Peminjaman tidak ditemukan" });
      }

      // Calculate late fees
      const today = new Date();
      const planReturnDate = new Date(peminjaman.tgl_kembali_rencana);
      
      let totalDenda = 0;
      if (today > planReturnDate) {
        const daysLate = Math.ceil((today - planReturnDate) / (1000 * 60 * 60 * 24));
        totalDenda = peminjaman.buku.denda_harian * daysLate;
      }

      const updateData = {
        status: totalDenda > 0 ? "TERLAMBAT" : "DIKEMBALIKAN",
        tgl_kembali_aktual: today,
        total_denda: totalDenda
      };

      if (bukti_pembayaran_denda) {
        updateData.bukti_pembayaran_denda = bukti_pembayaran_denda;
      }

      await peminjaman.update(updateData, { transaction });

      // Restore book stock
      await peminjaman.buku.increment('stock', { by: 1, transaction });

      // Create notification
      await Notifikasi.create({
        id_user: peminjaman.id_user,
        id_peminjaman: peminjaman.id,
        judul: "Buku Dikembalikan",
        deskripsi: `Buku ${peminjaman.buku.judul} telah dikembalikan. Total denda: Rp ${totalDenda}`,
        jenis: "PENGEMBALIAN_BUKU"
      }, { transaction });

      await transaction.commit();

      res.status(200).json({
        msg: "Buku berhasil dikembalikan",
        data: peminjaman,
        totalDenda
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error returning buku:", error);
      res.status(500).json({ 
        msg: "Gagal mengembalikan buku",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get user's borrowing history
  getPeminjamanByUser: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = { id_user: req.user.id };
      if (status) {
        whereCondition.status = status;
      }

      const { count, rows } = await Peminjaman.findAndCountAll({
        where: whereCondition,
        include: [
          { 
            model: Buku,
            attributes: ['judul', 'cover_img', 'penulis'] 
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
      });

      res.json({
        totalItems: count,
        peminjaman: rows,
        currentPage: Number(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      console.error("Error fetching user peminjaman:", error);
      res.status(500).json({ 
        msg: "Gagal mendapatkan riwayat peminjaman",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Staff gets all peminjaman with filtering
  getAllPeminjaman: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        search 
      } = req.query;

      const offset = (page - 1) * limit;

      const whereCondition = {};
      if (status) {
        whereCondition.status = status;
      }

      // Tambahkan pencarian berdasarkan resi
      if (search) {
        whereCondition[Op.or] = [
          { '$buku.judul$': { [Op.like]: `%${search}%` } },
          { '$user.name$': { [Op.like]: `%${search}%` } },
          { nomor_resi: { [Op.like]: `%${search}%` } } // Tambahkan pencarian resi
        ];
      }

      const { count, rows } = await Peminjaman.findAndCountAll({
        where: whereCondition,
        include: [
          { 
            model: Buku,
            attributes: ['judul', 'cover_img', 'penulis'] 
          },
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
      });

      res.json({
        totalItems: count,
        peminjaman: rows,
        currentPage: Number(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      console.error("Error fetching all peminjaman:", error);
      res.status(500).json({ 
        msg: "Gagal mendapatkan daftar peminjaman",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  getEarliestPeminjamanDate: async (req, res) => {
    try {
      const earliestPeminjaman = await Peminjaman.findOne({
        order: [['createdAt', 'ASC']], // Urutkan dari yang terlama
        attributes: ['createdAt'] // Ambil hanya kolom createdAt
      });

      if (!earliestPeminjaman) {
        return res.status(404).json({ msg: "Tidak ada data peminjaman" });
      }

      res.status(200).json({ earliestDate: earliestPeminjaman.createdAt });
    } catch (error) {
      console.error("Error fetching earliest peminjaman:", error);
      res.status(500).json({ msg: "Gagal mengambil data peminjaman terlama" });
    }
  },

  getPeminjamanByDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const whereCondition = {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
      
      const data = await Peminjaman.findAll({
        where: whereCondition,
        include: [
          { model: Buku, attributes: ['judul', 'cover_img', 'penulis'] },
          { model: User, as: 'user', attributes: ['name', 'email'] }
        ],
      });
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching peminjaman by date:", error);
      res.status(500).json({ msg: "Failed to fetch peminjaman data" });
    }
  }
};

export default peminjamanController;