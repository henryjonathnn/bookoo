import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const prisma = new PrismaClient();

// AUTH
export const register = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    // Check existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    // Check existing username
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username sudah digunakan" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashPassword,
      },
    });

    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Password salah" });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  console.log("Diterima refreshToken:", refreshToken);

  const user = await prisma.user.findFirst({
    where: { refresh_token: refreshToken },
  });
  console.log("User ditemukan:", user);

  if (user) {
    const result = await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: null },
    });
    console.log("Hasil update:", result);
  }

  res.status(200).json({ msg: "Logout berhasil" });
};


export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = await prisma.user.findFirst({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "20s",
          }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// CRUD USER (FOR ADMIN)
export const getUsers = async (req, res) => {
  try {
    const response = await prisma.user.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        password: password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        username: username,
        email: email,
        password: password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
