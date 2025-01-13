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
    },
    penulis: {
      type: DataTypes.STRING,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
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
    },
    denda_harian: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    penerbit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tahun_terbit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        fields: ["kategori"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export default Buku
