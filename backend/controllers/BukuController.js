import express from "express";
import { Buku } from "../models/index.js";

export const getBuku = async (req, res) => {
  try {
    const buku = await Buku.findAll();
    res.json(buku);
  } catch (error) {
    res.json({
      msg: "Gagal mendapatkan data buku",
      error: error.message,
    });
  }
};

export const getBukuById = async (req, res) => {
  try {
    const buku = await Buku.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (buku) {
      res.json(buku);
    } else {
      res.status(404).json({ msg: "Buku tidak ditemukan" });
    }
  } catch (error) {
    res.json({ msg: "Gagal mendapatkan data buku", error: error.message });
  }
};

export const createBuku = async (req, res) => {
  try {
    const dataFile = req.file;
    const dataBuku = req.body;

    if (dataFile) {
      dataBuku.cover_img = `/uploads/covers/${dataFile.filename}`;
    }

    const buku = await Buku.create(dataBuku);
    res.status(201).json({
      msg: "Data buku berhasil ditambahkan!",
      data: buku,
    });
  } catch (error) {
    // Hapus file jika ada error saat create data
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ msg: "Gagal menambahkan data buku", error: error.message });
  }
};

export const updateBuku = async (req, res) => {
  try {
    const dataBuku = req.body;
    const oldBuku = await Buku.findByPk(req.params.id);

    if (!oldBuku) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ msg: "Data buku tidak ditemukan" });
    }

    // Jika ada file baru
    if (req.file) {
      dataBuku.cover_img = `/uploads/covers/${req.file.filename}`;

      // Hapus file yang lama jika ada
      if (oldBuku.cover_img) {
        const oldPath = path.join("public", oldBuku.cover_img);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    // Update data buku sesuai request dari params
    const buku = await Buku.update(dataBuku, {
      where: {
        id: req.params.id,
      },
    });

    // Jika ada 1 baris atau lebih yang terupdate, maka berhasil
    res.status(200).json({
      msg: "Data buku berhasil diupdate!",
      data: await Buku.findByPk(req.params.id),
    });
  } catch (error) {
    // Hapus file baru jika ada error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      msg: "Gagal update data buku",
      error: error.message,
    });
  }
};

export const deleteBuku = async (req, res) => {
  try {
    const buku = await Buku.findByPk(req.params.id);
    if (!buku) {
      res.status(404).json({ msg: "Data buku tidak ditemukan" });
    }

    // Hapus file yang lama jika ada
    if (buku.cover_img) {
      const filePath = path.join("public", buku.cover_img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await buku.destroy();
    res.status(204).json({ msg: "Data buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      msg: "Tidak dapat menghapus buku",
      error: error.message,
    });
  }
};
