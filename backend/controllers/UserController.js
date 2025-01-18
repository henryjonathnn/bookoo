import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "username"],
    });
    res.json(users);
  } catch (error) {
    res.json({
      msg: "Gagal Get Users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    // Cari user sesuai ID
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    // Jika tidak ditemukan
    if (!user) {
      return res.status(404).json({
        msg: "User tidak ditemukan",
      });
    }

    // Jika berhasil
    res.status(200).json(user);
  } catch (error) {
    res.json({
      msg: "Gagal mendapatkan data buku",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  const { name, email, username, password, confPassword } = req.body;
   // Validasi input kosong
   if (!name || !email || !username || !password || !confPassword) {
    return res.status(400).json({ msg: "Semua field wajib diisi!" });
  }

  // Jika tidak sesuai antara pw dan confpw
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak sesuai" });

  // Jika sesuai

  // Validasi email yang didaftarkan apakah sudah ada atau blm
  const existingEmail = await User.findOne({
    where: {
      email: email,
    },
  });

  if (existingEmail) {
    return res.status(400).json({ msg: "Email sudah terdaftar!" });
  }

  // Validasi username yang didaftarkan apakah sudah ada atau blm
  const existingUsername = await User.findOne({
    where: {
      username: username,
    },
  });

  if (existingUsername) {
    return res.status(400).json({ msg: "Username sudah digunakan!" });
  }

  // Hash pw supaya aman
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  // Proses register dari request body
  try {
    await User.create({
      name: name,
      email: email,
      username: username,
      password: hashPassword,
    });
    res.status(201).json({ msg: "Register berhasil!" });
  } catch (error) {
    res.json({
      msg: "Gagal register",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    // Validasi apakah email sudah terdaftar di DB
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    // Validasi password benar atau tidak
    const match = await bcrypt.compare(req.body.password, user[0].password);

    // Jika tidak benar/sesuai
    if (!match)
      return res.status(400).json({ msg: "Password atau email salah!" });

    // Jika benar/sesuai
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const username = user[0].username;
    const accessToken = jwt.sign(
      { userId, name, email, username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email, username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const validateEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const existingUser = await User.findOne({
      where: { email },
    });
    res.json({ available: !existingUser });
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error.message,
    });
  }
};

export const validateUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const existingUser = await User.findOne({
      where: { username },
    });
    res.json({ available: !existingUser });
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error.message,
    });
  }
};
