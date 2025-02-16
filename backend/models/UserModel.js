import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("USER", "STAFF", "ADMIN"),
      defaultValue: "USER",
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    profile_img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["username"], unique: true },
      { fields: ["role"] },
      { fields: ["is_active"] },
      { fields: ["createdAt"] },
      { fields: ["name", "email", "username"] }
    ],
    defaultScope: {
      attributes: { 
        exclude: ["password", "refresh_token"],
        include: ["id", "name", "email", "username", "role", "is_active", "profile_img", "createdAt"]
      }
    },
    scopes: {
      withAuth: {
        attributes: { include: ["password", "refresh_token"] },
      },
      list: {
        attributes: ["id", "name", "email", "username", "role", "is_active", "profile_img", "createdAt"]
      }
    }
  }
);

// Instance Methods
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.refresh_token;
  return values;
};

export default User;
