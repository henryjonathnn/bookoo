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
      type: DataTypes.ENUM("DUE_REMINDER", "OVERDUE_NOTICE", "DENDA_NOTICE"),
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
