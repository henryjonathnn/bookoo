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
    const buku = await Buku.create(req.body);
    res.status(201).json({
      msg: "Data buku berhasil ditambahkan!",
      data: buku,
    });
  } catch (error) {
    res.json({ msg: "Gagal menambahkan data buku", error: error.message });
  }
};

export const updateBuku = async (req, res) => {
  try {
    // Update data buku sesuai request dari params
    const buku = await Buku.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Jika ada 1 baris atau lebih yang terupdate, maka berhasil
    if (buku[0] > 0) {
      res.status(201).json({
        msg: "Data buku berhasil diupdate!",
        data: buku,
      });

      // Jika tidak ada yang terupdate alias 0 baris, maka return res di bawah
    } else {
      res.status(404).json({ msg: "Data buku tidak ditemukan" });
    }
  } catch (error) {
    res.json({
      msg: "Gagal update data buku",
      error: error.message,
    });
  }
};

export const deleteBuku = async (req, res) => {
  try {
    const buku = await Buku.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (buku > 0) {
      res.status(204).json({ msg: "Data buku berhasil dihapus" });
    } else {
      res.status(404).json({ msg: "Data buku tidak ditemukan" });
    }
  } catch (error) {
    res.json({
      msg: "Tidak dapat menghapus buku",
      error: error.message,
    });
  }
};
