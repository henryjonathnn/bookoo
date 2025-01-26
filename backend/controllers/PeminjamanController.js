import { Peminjaman, Buku, User, Notifikasi } from "../models/index.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs/promises";

export const peminjamanController = {
  // Create a new borrowing request
  createPeminjaman: async (req, res) => {
    const transaction = await Peminjaman.sequelize.transaction();

    try {
      const { 
        id_buku, 
        alamat_pengiriman, 
        tgl_peminjaman_diinginkan, 
        metode_pengiriman, 
        catatan_pengiriman 
      } = req.body;

      // Validate input
      if (!id_buku || !alamat_pengiriman || !tgl_peminjaman_diinginkan) {
        return res.status(400).json({ msg: "Data peminjaman tidak lengkap" });
      }

      // Check book availability
      const buku = await Buku.findByPk(id_buku, { transaction });

      if (!buku || buku.stock <= 0) {
        await transaction.rollback();
        return res.status(400).json({ msg: "Buku tidak tersedia" });
      }

      // Calculate return date (default 7 days from borrow date)
      const tgl_kembali_rencana = new Date(tgl_peminjaman_diinginkan);
      tgl_kembali_rencana.setDate(tgl_kembali_rencana.getDate() + 7);

      // Create peminjaman
      const peminjaman = await Peminjaman.create({
        id_user: req.user.id,
        id_buku,
        alamat_pengiriman,
        tgl_peminjaman_diinginkan: new Date(tgl_peminjaman_diinginkan),
        tgl_kembali_rencana,
        metode_pengiriman,
        catatan_pengiriman,
        status: "PENDING"
      }, { transaction });

      // Reduce book stock
      await buku.decrement('stock', { by: 1, transaction });

      // Create notification
      await Notifikasi.create({
        id_user: req.user.id,
        id_peminjaman: peminjaman.id,
        judul: "Peminjaman Baru",
        deskripsi: `Permintaan peminjaman buku ${buku.judul} telah dibuat`,
        jenis: "PEMINJAMAN_BARU"
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        msg: "Permintaan peminjaman berhasil dibuat",
        data: peminjaman
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating peminjaman:", error);
      res.status(500).json({ 
        msg: "Gagal membuat permintaan peminjaman",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
      await Notifikasi.create({
        id_user: peminjaman.id_user,
        id_peminjaman: peminjaman.id,
        judul: `Peminjaman ${status}`,
        deskripsi: `Status peminjaman buku ${peminjaman.buku.judul} telah diperbarui menjadi ${status}`,
        jenis: "STATUS_PEMINJAMAN"
      }, { transaction });

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

      // Optional search across buku and user
      if (search) {
        whereCondition[Op.or] = [
          { '$buku.judul$': { [Op.like]: `%${search}%` } },
          { '$user.name$': { [Op.like]: `%${search}%` } }
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
  }
};

export default peminjamanController;