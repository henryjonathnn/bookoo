// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import UserRoute from "./routes/UserRoute.js";
// import cookieParser from "cookie-parser";
// import db from "./config/Database.js";
// dotenv.config();
// const app = express();

// try {
//   await db.authenticate();
//   console.log("Database berhasil");
// } catch (error) {
//   console.log(error);
// }

// app.use(cors())
// app.use(express.json())
// app.use(cookieParser())
// app.use(UserRoute)

import express from "express";
import db from "./config/Database.js";
import User from "./models/UserModel.js";

const app = express();

try {
    await db.authenticate();
    console.log('Database Connected...');

    await User.sync();
    console.log('table sudah ada');
} catch (error) {
    console.error(error);
}

app.listen(process.env.APP_PORT, () => {
  console.log("Server berhasil running..");
});
