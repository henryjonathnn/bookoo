
import express from "express";
import db from "./config/Database.js";
import { User, Buku, Peminjaman, Bookmark, Suka, Rating, Notifikasi } from "./models/index.js"
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(router)

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
