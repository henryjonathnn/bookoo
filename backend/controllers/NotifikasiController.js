import { Notifikasi, Peminjaman, Buku, User } from "../models/index.js";
import { Op } from "sequelize";

export const notifikasiController = {
  createNotifikasi: async (id_user, id_peminjaman, message, tipe, transaction) => {
    try {
      const notifikasi = await Notifikasi.create({
        id_user,
        id_peminjaman,
        message,
        tipe,
        isRead: false
      }, { transaction });
      console.log('Notifikasi created:', notifikasi);
      return notifikasi;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  getNotifikasi: async (req, res) => {
    try {
      const notifikasi = await Notifikasi.findAll({
        where: { id_user: req.user.id },
        include: [{
          model: Peminjaman,
          include: [{ 
            model: Buku,
            attributes: ['judul']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      res.json(notifikasi);
    } catch (error) {
      res.status(500).json({ 
        msg: "Terjadi kesalahan saat mengambil notifikasi",
        error: error.message 
      });
    }
  },

  markAsRead: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          msg: "User ID tidak ditemukan dalam token" 
        });
      }

      const result = await Notifikasi.update(
        { isRead: true },
        { 
          where: { 
            id: req.params.id, 
            id_user: req.user.id 
          }
        }
      );

      if (result[0] === 0) {
        return res.status(404).json({ 
          msg: "Notifikasi tidak ditemukan" 
        });
      }

      res.json({ msg: "Notifikasi ditandai telah dibaca" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ 
        msg: "Terjadi kesalahan saat menandai notifikasi",
        error: error.message 
      });
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          msg: "User ID tidak ditemukan dalam token" 
        });
      }

      const result = await Notifikasi.update(
        { isRead: true },
        { 
          where: { 
            id_user: req.user.id, 
            isRead: false 
          }
        }
      );

      res.json({ 
        msg: "Semua notifikasi ditandai telah dibaca",
        updated: result[0]
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ 
        msg: "Terjadi kesalahan saat menandai semua notifikasi",
        error: error.message 
      });
    }
  }
}; 