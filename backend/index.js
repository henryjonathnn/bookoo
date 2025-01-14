import express from "express";
import db from "./config/Database.js";
import {
  User,
  Buku,
  Peminjaman,
  Bookmark,
  Suka,
  Rating,
  Notifikasi,
} from "./models/index.js";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use(router);

// DIAKTIFKAN HANYA KETIKA SINKRONISASI DB
// try {
//     await db.authenticate();
//     console.log('Database Connected...');

//     await db.sync({ alter: true });
// } catch (error) {
//     console.error(error);
// }

app.listen(process.env.APP_PORT, () => {
  console.log("Server berhasil running..");
});
