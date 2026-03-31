const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors());         // Allows the React frontend to communicate with this backend

// Connect to XAMPP MySQL Database
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Default XAMPP username
  password: '',      // Default XAMPP password is blank
  database: 'hotel_management'
});

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { full_name, email, username, password, role } = req.body;

  if (!full_name || !email || !username || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // 1. Securely hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert the user into the database
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, username, hashedPassword, role]
    );

    res.status(201).json({ message: "User successfully created!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to create user. Username might already exist." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});