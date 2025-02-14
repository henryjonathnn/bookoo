import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Buku = db.define(
  "buku",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Judul tidak boleh kosong" }
      }
    },
    penulis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Penulis tidak boleh kosong" }
      }
    },
    isbn: {
      type: DataTypes.STRING,
      unique: { msg: "ISBN sudah terdaftar" },
      allowNull: true,
    },
    kategori: {
      type: DataTypes.ENUM(
        "FIKSI",
        "NON-FIKSI",
        "SAINS",
        "TEKNOLOGI",
        "SEJARAH",
        "SASTRA",
        "KOMIK",
        "LAINNYA"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Kategori tidak boleh kosong" }
      }
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cover_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "Stok tidak boleh negatif" }
      }
    },
    denda_harian: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "Denda tidak boleh negatif" }
      }
    },
    penerbit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tahun_terbit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Tahun terbit harus berupa angka" },
        min: { args: [1800], msg: "Tahun terbit tidak valid" },
        max: { args: [new Date().getFullYear()], msg: "Tahun terbit tidak boleh melebihi tahun sekarang" }
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      { fields: ["kategori"] },
      { fields: ["createdAt"] },
      { fields: ["judul"] },
      { fields: ["penulis"] },
      { fields: ["isbn"] }
    ]
  }
);

export default Buku;