import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import path from "path";
import fs from "fs/promises";

export const authController = {
  getUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;

      // Use more efficient query construction
      const where = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { username: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      // Parallel database operations for better performance
      const [{ count, rows }, totalRows] = await Promise.all([
        User.findAndCountAll({
          where,
          attributes: [
            "id",
            "name",
            "email",
            "username",
            "role",
            "createdAt",
            "profile_img",
          ],
          limit: Number(limit),
          offset: Number(offset),
          order: [["createdAt", "DESC"]],
        }),
        User.count({ where }), // Separate count for more accurate pagination
      ]);

      return res.status(200).json({
        totalItems: count,
        users: rows,
        currentPage: Number(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.error("Server error in getUsers:", error);
      return res.status(500).json({
        message: "Error fetching users",
        error: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ["id", "name", "email", "username", "role", "createdAt"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user",
        error: error.message,
      });
    }
  },

  register: async (req, res) => {
    const { name, email, username, password, confPassword } = req.body;

    // Early validation to reduce unnecessary database calls
    if (!name || !email || !username || !password || !confPassword) {
      return res.status(400).json({ message: "Semua kolom harus diisi!" });
    }

    if (password !== confPassword) {
      return res.status(400).json({ message: "Password tidak sesuai!" });
    }

    try {
      // Use transaction for atomic operation
      const result = await User.sequelize.transaction(async (t) => {
        // Efficient unique check
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ email }, { username }],
          },
          transaction: t,
        });

        if (existingUser) {
          const errorMessage =
            existingUser.email === email
              ? "Email sudah digunakan"
              : "Username sudah digunakan";
          throw new Error(errorMessage);
        }

        // Hash password with more secure params
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        return await User.create(
          {
            name,
            email,
            username,
            password: hashedPassword,
            role: "user",
          },
          { transaction: t }
        );
      });

      res.status(201).json({ message: "Registrasi berhasil!" });
    } catch (error) {
      res.status(400).json({
        message: error.message || "Registrasi Gagal!",
      });
    }
  },

  // Optimize login with more secure token generation
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Efficient user retrieval
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ msg: "Email tidak ditemukan" });
      }

      // Secure password comparison
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Password salah" });
      }

      // More compact token generation
      const tokenPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(
        tokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Atomic update of refresh token
      await user.update({ refresh_token: refreshToken });

      // More secure cookie settings
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

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
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res.sendStatus(403);
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, username, password, role } = req.body;

      // Early validation
      if (!name || !email || !username || !password) {
        return res.status(400).json({ message: "Semua kolom harus diisi!" });
      }

      // Use transaction for atomic operation
      const result = await User.sequelize.transaction(async (t) => {
        // Efficient unique check
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ email }, { username }],
          },
          transaction: t,
        });

        if (existingUser) {
          const errorMessage =
            existingUser.email === email
              ? "Email sudah digunakan"
              : "Username sudah digunakan";
          throw new Error(errorMessage);
        }

        // Prepare user data
        const userData = {
          name,
          email,
          username,
          password: await bcrypt.hash(password, 10),
          role: role || "USER",
        };

        // Efficient file handling
        if (req.file) {
          userData.profile_img = `/uploads/profiles/${req.file.filename}`;
        }

        // Create user
        return await User.create(userData, { transaction: t });
      });

      // Remove sensitive data from response
      const { password: removedPassword, ...userResponse } = result.get({
        plain: true,
      });

      res.status(201).json({
        message: "User berhasil ditambahkan!",
        data: userResponse,
      });
    } catch (error) {
      // Use promise-based file removal
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }

      res.status(500).json({
        message: "Gagal menambahkan user",
        error: error.message,
      });
    }
  },

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
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      // Optional: Hapus file profil jika ada
      if (user.profile_img) {
        const filePath = path.join("public", user.profile_img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await user.destroy();
      res.status(200).json({ msg: "User berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        msg: "Tidak dapat menghapus user",
        error: error.message,
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
