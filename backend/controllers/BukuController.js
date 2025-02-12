import { Buku } from "../models/index.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs/promises"; // Use promise-based file system

export const bukuController = {
  // Optimized get method with more efficient querying
  getBuku: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", kategori = "" } = req.query;

      const offset = (page - 1) * limit;

      let condition = {};

      // More efficient search condition
      if (search) {
        condition = {
          [Op.or]: [
            { judul: { [Op.like]: `%${search}%` } },
            { penulis: { [Op.like]: `%${search}%` } },
            { isbn: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      if (kategori) {
        condition = {
          ...condition,
          kategori: kategori
        };
      }

      // Use Promise.all for parallel operations
      const [{ count, rows }, totalCount] = await Promise.all([
        Buku.findAndCountAll({
          where: condition,
          limit: Number(limit),
          offset: Number(offset),
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["content"], 
          },
        }),
        Buku.count({ where: condition }),
      ]);

      res.json({
        totalItems: count,
        books: rows,
        currentPage: Number(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({
        msg: "Gagal mendapatkan data buku",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },

  getBukuById: async (req, res) => {
    try {
      const { id } = req.params;
      const buku = await Buku.findByPk(id);

      if (!buku) {
        return res.status(404).json({ msg: "Buku tidak ditemukan" });
      }

      res.json(buku);
    } catch (error) {
      console.error("Error fetching book by ID:", error);
      res.status(500).json({
        msg: "Gagal mendapatkan data buku",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },

  // Implement transaction for create and update operations
  createBuku: async (req, res) => {
    const transaction = await Buku.sequelize.transaction();

    try {
      const dataFile = req.file;
      const dataBuku = req.body;

      // Handle file upload with transaction
      if (dataFile) {
        dataBuku.cover_img = `/uploads/covers/${dataFile.filename}`;
      }

      // Create book within transaction
      const buku = await Buku.create(dataBuku, { transaction });

      // Commit transaction
      await transaction.commit();

      res.status(201).json({
        msg: "Data buku berhasil ditambahkan!",
        data: buku,
      });
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();

      // Remove uploaded file if exists
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }

      res.status(500).json({
        msg: "Gagal menambahkan data buku",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },

  // Implement more robust update method
  updateBuku: async (req, res) => {
    const transaction = await Buku.sequelize.transaction();

    try {
      const { id } = req.params;
      const dataBuku = req.body;

      // Find existing book with transaction
      const oldBuku = await Buku.findByPk(id, { transaction });

      if (!oldBuku) {
        await transaction.rollback();

        // Clean up uploaded file if any
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }

        return res.status(404).json({ msg: "Data buku tidak ditemukan" });
      }

      // Handle file upload
      if (req.file) {
        dataBuku.cover_img = `/uploads/covers/${req.file.filename}`;

        // Remove old file if exists
        if (oldBuku.cover_img) {
          const oldPath = path.join("public", oldBuku.cover_img);
          await fs.unlink(oldPath).catch(() => {});
        }
      }

      // Update book
      await Buku.update(dataBuku, {
        where: { id },
        transaction,
      });

      // Commit transaction and fetch updated book
      await transaction.commit();
      const updatedBuku = await Buku.findByPk(id);

      res.status(200).json({
        msg: "Data buku berhasil diupdate!",
        data: updatedBuku,
      });
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();

      // Remove uploaded file if exists
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }

      res.status(500).json({
        msg: "Gagal update data buku",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },

  // Optimized delete method
  deleteBuku: async (req, res) => {
    const transaction = await Buku.sequelize.transaction();

    try {
      const { id } = req.params;

      // Find book within transaction
      const buku = await Buku.findByPk(id, { transaction });

      if (!buku) {
        await transaction.rollback();
        return res.status(404).json({ msg: "Data buku tidak ditemukan" });
      }

      // Remove cover image if exists
      if (buku.cover_img) {
        const filePath = path.join("public", buku.cover_img);
        await fs.unlink(filePath).catch(() => {});
      }

      // Delete book
      await buku.destroy({ transaction });

      // Commit transaction
      await transaction.commit();

      res.status(200).json({ msg: "Data buku berhasil dihapus" });
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();

      res.status(500).json({
        msg: "Tidak dapat menghapus buku",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },

  // Additional method for bulk operations
  bulkCreateBuku: async (req, res) => {
    const transaction = await Buku.sequelize.transaction();

    try {
      const books = req.body;
      const createdBooks = await Buku.bulkCreate(books, { transaction });

      await transaction.commit();

      res.status(201).json({
        msg: "Buku berhasil ditambahkan secara massal!",
        data: createdBooks,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        msg: "Gagal menambahkan buku secara massal",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },

  getKategori: async (req, res) => {
    try {
      // Dapatkan model Buku
      const tableDefinition = Buku.rawAttributes.kategori;

      // Ambil values dari ENUM
      const enumValues = tableDefinition.values;

      res.json({
        totalCategories: enumValues.length,
        categories: enumValues,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        msg: "Gagal mendapatkan data kategori",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  },
};
