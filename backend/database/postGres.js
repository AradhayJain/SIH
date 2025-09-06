// postGres.js
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection once when app starts
async function ConnectPost() {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected.");
    client.release(); // release back to pool (do NOT end the pool)
  } catch (error) {
    console.error("❌ Error connecting to PostgreSQL:", error.message);
  }
}

export { pool, ConnectPost };
