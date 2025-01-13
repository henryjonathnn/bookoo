import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Peminjaman = db.define(
  "peminjaman",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    id_buku: {
      type: DataTypes.INTEGER,
    },
    id_staff: {
      type: DataTypes.INTEGER,
    },
    tgl_pinjam: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    tgl_kembali: {
      type: DataTypes.DATE,
    },
    tgl_dikembalikan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "RETURNED", "OVERDUE"),
      defaultValue: "PENDING",
    },
    jumlah_denda: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    isDendaDibayar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["tgl_kembali"],
      },
    ],
  }
);

export default Peminjaman;
