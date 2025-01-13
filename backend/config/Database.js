import { Sequelize } from "sequelize";

const db = new Sequelize("bookoo", "root", "", {
  host: "localhost",
  dialect: "mysql"
});

export default db