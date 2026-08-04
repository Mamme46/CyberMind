const { Pool } = require("pg");
const env = require("./env");

console.log(env);
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

async function connectDatabase() {
  try {
    const client = await pool.connect();

    console.log("✅ Connected to PostgreSQL");

    client.release();
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL");
    console.error(error);
    process.exit(1);
  }
}

module.exports = {
  pool,
  connectDatabase,
};

connectDatabase();