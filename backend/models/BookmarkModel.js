import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Bookmark = db.define(
  "bookmark",
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
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["id_user", "id_buku"],
      },
    ],
  }
);

export default Bookmark;