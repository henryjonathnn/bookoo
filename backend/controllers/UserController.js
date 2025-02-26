import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import path from "path";
import { promises as fs } from 'fs';
import { userService } from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createError from "http-errors";

export const authController = {
  getUsers: asyncHandler(async (req, res) => {
    const result = await userService.findUsers(req.query);
    res.json(result);
  }),

  getUserById: asyncHandler(async (req, res) => {
    const user = await User.scope('list').findByPk(req.params.id);
    
    if (!user) {
      throw createError(404, "User tidak ditemukan");
    }

    res.json(user);
  }),

  register: asyncHandler(async (req, res) => {
    const { name, email, username, password, confPassword } = req.body;

    // Validasi input
    if (!name?.trim() || !email?.trim() || !username?.trim() || !password) {
      throw createError(400, "Semua field harus diisi");
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError(400, "Format email tidak valid");
    }

    // Validasi panjang password
    if (password.length < 6) {
      throw createError(400, "Password minimal 6 karakter");
    }

    if (password !== confPassword) {
      throw createError(400, "Password dan konfirmasi password tidak sesuai");
    }

    try {
      const user = await userService.createUser({
        name,
        email,
        username,
        password
      });

      res.status(201).json({
        success: true,
        message: "Registrasi berhasil!",
        data: user
      });
    } catch (error) {
      // Jika error karena duplikasi email/username
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError(400, "Email atau username sudah digunakan");
      }
      throw error;
    }
  }),

  // Optimize login with more secure token generation
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw createError(400, "Email dan password harus diisi!");
    }

    const result = await userService.login(email, password);

    // Set refresh token cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login berhasil!",
      accessToken: result.accessToken,
      user: result.user
    });
  }),

  logout: async (req, res) => {
    try {
      // Mengambil refresh token yang ada di cookie
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(204).end();
      }

      // Hapus request token di DB untuk logout user
      await User.update(
        { refresh_token: null },
        { where: { refresh_token: refreshToken } }
      );

      // CLear juga refresh token yang ada di cookie
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Berhasil logout!" });
    } catch (error) {
      res.status(500).json({ message: "Gagal logout!", error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.sendStatus(401);
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Get user from database
      const user = await User.findOne({
        where: {
          id: decoded.userId,
        },
      });

      if (!user) {
        return res.sendStatus(403);
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" } // Access token expires in 15 minutes
      );

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Refresh token expires in 7 days
      );

      await User.update(
        { refresh_token: newRefreshToken },
        { where: { id: user.id } }
      );

      // Set refresh token baru di dalam cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 Minggu
      });

      // Kirim access token baru ke client
      res.json({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          profile_img: user.profile_img,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res.sendStatus(403);
    }
  },

  createUser: asyncHandler(async (req, res) => {
    const profileImage = req.file 
      ? `/uploads/profiles/${req.file.filename}` 
      : null;
    
    const user = await userService.createUser(req.body, profileImage);
    res.status(201).json({
      message: "User berhasil ditambahkan!",
      data: user,
    });
  }),

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, username, role } = req.body;

      // Mwncari data user dari userId
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Validate input
      if (!name || !email || !username) {
        return res
          .status(400)
          .json({ message: "Nama, email, dan username harus diisi!" });
      }

      // Cek email yang sudah ada untuk menghindari duplikasi (kecuali email user saat ini)
      const existingEmail = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId },
        },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }

      // Cek username yang sudah ada untuk menghindari duplikasi (kecuali username saat ini)
      const existingUsername = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: userId },
        },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }

      // Persiapan update data
      const updateData = {
        name,
        email,
        username,
        role: role || user.role,
      };

      // Handle upload foto profil
      if (req.file) {
        // Hapus foto profil lama jika ada
        if (user.profile_img) {
          const oldFilePath = path.join("public", user.profile_img);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        // Set path foto profil baru
        updateData.profile_img = `/uploads/profiles/${req.file.filename}`;
      }

      // Update user
      await user.update(updateData);

      // Persiapan response
      const { password, refresh_token, ...userResponse } = user.get({
        plain: true,
      });

      res.status(200).json({
        message: "User berhasil diperbarui!",
        data: userResponse,
      });
    } catch (error) {
      // Hapus uploaded file kalo ada error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      console.error("Error updating user:", error);
      res.status(500).json({
        message: "Gagal memperbarui user",
        error: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: false,
          msg: "User tidak ditemukan"
        });
      }

      // Hapus file profile image jika ada
      if (user.profile_img) {
        const filePath = path.join("public", user.profile_img);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.log('Error deleting image:', error);
          // Lanjutkan proses meskipun gagal menghapus gambar
        }
      }

      await user.destroy();
      return res.status(200).json({
        status: true,
        msg: "User berhasil dihapus"
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        status: false,
        msg: error.message || "Terjadi kesalahan saat menghapus user"
      });
    }
  },

  // Validasi real time untuk email dan username untuk menghindari duplikasi
  validateField: async (req, res) => {
    try {
      const { field, value } = req.params;

      if (!["email", "username"].includes(field)) {
        return res.status(400).json({ message: "Invalid field" });
      }

      const existingUser = await User.findOne({
        where: { [field]: value },
        attributes: ["id"],
      });

      res.json({ available: !existingUser });
    } catch (error) {
      res.status(500).json({ available: false, error: error.message });
    }
  },
};
