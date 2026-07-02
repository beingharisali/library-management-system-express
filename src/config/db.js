const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});
module.exports = pool;
