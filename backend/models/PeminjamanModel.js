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
      allowNull: false,
    },
    id_buku: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_staff: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    alamat_pengiriman: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    catatan_pengiriman: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tgl_peminjaman_diinginkan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tgl_pinjam_aktual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tgl_kembali_rencana: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tgl_kembali_aktual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING", 
        "DIPROSES", 
        "DIKIRIM", 
        "DIPINJAM", 
        "TERLAMBAT", 
        "DIKEMBALIKAN", 
        "DITOLAK"
      ),
      defaultValue: "PENDING",
    },
    metode_pengiriman: {
      type: DataTypes.ENUM("KURIR", "AMBIL_DI_TEMPAT"),
      defaultValue: "KURIR",
    },
    total_denda: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    bukti_pembayaran_denda: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alasan_penolakan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nomor_resi: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["tgl_peminjaman_diinginkan"] },
      { fields: ["id_user"] }
    ]
  }
);

export default Peminjaman;