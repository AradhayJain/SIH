// db-connection.js

import dotenv from "dotenv";
dotenv.config({});

import { Pool } from "pg";

// Create a connection pool using DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
async function ConnectPost() {
  let client;
  try {
    console.log('Connecting to the database as "Aditya sahu"...');
    client = await pool.connect();
    console.log("✅ Connection successful.");
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
  } finally {
    if (client) client.release();
    await pool.end();
    console.log("Connection pool closed.");
  }
}

export default ConnectPost;
