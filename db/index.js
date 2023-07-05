require("dotenv").config();
const pgp = require("pg-promise")();

const db = pgp(
  `postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DATABASE}`
);

// const db = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// });

module.exports = db;
