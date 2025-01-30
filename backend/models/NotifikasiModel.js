import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Notifikasi = db.define(
  "notifikasi",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    id_peminjaman: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.TEXT,
    },
    tipe: {
      type: DataTypes.ENUM(
        "PEMINJAMAN_CREATED",      // Saat peminjaman dibuat
        "PEMINJAMAN_DIPROSES",     // Saat status berubah jadi diproses
        "PEMINJAMAN_DIKIRIM",      // Saat status berubah jadi dikirim
        "PEMINJAMAN_DITOLAK",      // Saat peminjaman ditolak
        "PEMINJAMAN_DIKEMBALIKAN", // Saat buku dikembalikan
        "DUE_REMINDER",            // Pengingat jatuh tempo
        "OVERDUE_NOTICE",          // Pemberitahuan terlambat
        "DENDA_NOTICE"             // Pemberitahuan denda
      ),
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["id_user"],
      },
      {
        fields: ["tipe"],
      },
    ],
  }
);

export default Notifikasi;
