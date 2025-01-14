import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await User.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_TOKEN,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const username = user[0].username;
        const accessToken = jwt.sign(
          { userId, name, email, username },
          process.env.ACCESS_SECRET_TOKEN,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken })
      }
    );
  } catch (error) {
    console.log(error);
  }
};
