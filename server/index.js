const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connection to your XAMPP MySQL/MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'my_app_db'
});

db.connect(err => {
  if (err) console.error('Error connecting to HeidiSQL:', err);
  else console.log('Connected to XAMPP Database!');
});

// Example Route
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM your_table_name', (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));