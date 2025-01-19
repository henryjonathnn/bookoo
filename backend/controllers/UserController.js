import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fungsi untuk generate token
const generateTokens = (userData) => {
  // ACCESS TOKEN
  const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  });
  
  // REFRESH TOKEN
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  });
  
  return { accessToken, refreshToken };
};

export const authController = {
  register: async (req, res) => {
    try {
      const { name, email, username, password, confPassword } = req.body;
      
      // Validasi register
      if (!name || !email || !username || !password || !confPassword) {
        return res.status(400).json({ message: "Semua kolom harus diisi!" });
      }
      
      if (password !== confPassword) {
        return res.status(400).json({ message: "Password tidak sesuai!" });
      }

      // Cek email dan username yang sudah ada untuk menghindari duplikasi
      const [existingEmail, existingUsername] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { username } })
      ]);

      if (existingEmail) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
      
      if (existingUsername) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }

      // Jika berhasil validasi, maka data user akan didafatarkan ke DB
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        username,
        password: hashedPassword,
        role: "user" // Default role
      });

      // Respon
      res.status(201).json({ message: "Registrasi berhasil!" });
    } catch (error) {
      res.status(500).json({ message: "Registrasi Gagal!", error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      // request yang diperlukan
      const { email, password } = req.body;
      
      // Validasi data yang diinput dengan yang ada di DB
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'name', 'email', 'username', 'password', 'role']
      });

      // Jika tidak ada
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Jika password salah
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Email atau password salah" });
      }

      // Jika berhasil
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      };

      // Generate Token
      const { accessToken, refreshToken } = generateTokens(userData);

      // Update refresh token ke DB
      await User.update(
        { refresh_token: refreshToken },
        { where: { id: user.id } }
      );

      // Set refresh token di HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Respon
      res.json({ accessToken, user: userData });
    } catch (error) {
      res.status(500).json({ message: "Login gagal!", error: error.message });
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
      res.clearCookie('refreshToken');
      res.status(200).json({ message: "Berhasil logout!" });
    } catch (error) {
      res.status(500).json({ message: "Gagal logout!", error: error.message });
    }
  },

  // Fungsi untuk memperbarui token agar user tidak perlu login login terus
  refreshToken: async (req, res) => {
    try {
      // Cek refresh token di cookie
      const refreshToken = req.cookies.refreshToken;

      // Kalo tidak ada
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token diperlukan" });
      }

      // Kalo ada, maka generate lagi
      const user = await User.findOne({
        where: { refresh_token: refreshToken },
        attributes: ['id', 'name', 'email', 'username', 'role']
      });

      // Kalo posisi tidak login atau refresh_token = null
      if (!user) {
        return res.status(403).json({ message: "Refresh token tidak valid" });
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Refresh token tidak valid" });
        }

        // Generate ulang
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role
        };

        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '15m'
        });

        res.json({ accessToken });
      });
    } catch (error) {
      res.status(500).json({ message: "Gagal merefresh token", error: error.message });
    }
  },

  // Validasi real time untuk email dan username untuk menghindari duplikasi
  validateField: async (req, res) => {
    try {
      const { field, value } = req.params;
      
      if (!['email', 'username'].includes(field)) {
        return res.status(400).json({ message: "Invalid field" });
      }

      const existingUser = await User.findOne({
        where: { [field]: value },
        attributes: ['id']
      });

      res.json({ available: !existingUser });
    } catch (error) {
      res.status(500).json({ available: false, error: error.message });
    }
  }
};