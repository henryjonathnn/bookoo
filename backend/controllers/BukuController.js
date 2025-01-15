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
