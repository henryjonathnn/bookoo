import { User } from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import fs from "fs/promises";

export const userService = {
  async findUsers({ page = 1, limit = 10, search = "", role = "", active = "" }) {
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role && role !== "ALL") {
      whereClause.role = role
    } 

    if (active === "ACTIVE") {
      whereClause.is_active = true;
    } else if (active === "INACTIVE") {
      whereClause.is_active = false;
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
    });

    return {
      users: rows,
      totalItems: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
    };
  },

  async createUser(userData, profileImage = null) {
    const { name, email, username, password, role = "USER" } = userData;

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      throw createError(
        400,
        existingUser.email === email
          ? "Email sudah digunakan"
          : "Username sudah digunakan"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return User.create({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      profile_img: profileImage,
    });
  },

  async login(email, password) {
    if (!email || !password) {
      throw createError(400, "Email dan password harus diisi!");
    }

    // Gunakan scope withAuth untuk mengambil password
    const user = await User.scope("withAuth").findOne({
      where: { email },
    });

    if (!user) {
      throw createError(404, "Email tidak ditemukan");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError(400, "Password salah");
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    // Update refresh token
    await user.update({ refresh_token: refreshToken });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        profile_img: user.profile_img,
        role: user.role,
      },
    };
  },

  generateTokens(user) {
    const accessToken = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        profile_img: user.profile_img,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  },

  async deleteUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw createError(404, "User tidak ditemukan");
    }

    // Hapus file profile image jika ada
    if (user.profile_img) {
      const filePath = `./public/images/${user.profile_img}`;
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.log("Error menghapus gambar:", error);
      }
    }

    await user.destroy();
    return {
      status: true,
      message: "User berhasil dihapus",
    };
  },
};
