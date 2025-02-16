import { Sequelize } from "sequelize";

const db = new Sequelize("freedb_bookoo", "freedb_hyura", "4wRzFFJ!TY6erfJ", {
  host: "sql.freedb.tech",
 port: 3306,
  dialect: "mysql"
});

export default db