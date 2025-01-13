
import express from "express";
import db from "./config/Database.js";
import { User, Buku, Peminjaman, Bookmark, Suka, Rating, Notifikasi } from "./models/index.js"

const app = express();

try {
    await db.authenticate();
    console.log('Database Connected...');

    await db.sync({ alter: true });
} catch (error) {
    console.error(error);
}

app.listen(process.env.APP_PORT, () => {
  console.log("Server berhasil running..");
});
