
const pool = require("./db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS db");
    console.log("Database connection successful:", rows[0].db);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
