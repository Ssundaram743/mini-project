const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Oracle DB connection details
const dbConfig = {
  user: 'hr',
  password: 'admin',
  connectString: 'localhost/XEPDB1',  // Ensure this is correct
};

app.use(bodyParser.json());
app.use(cors());

// Serve static files from "E:\mini project" folder
app.use(express.static(path.join('E:', 'mini project')));

// Utility function for database queries
async function executeQuery(query, params = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, params, { autoCommit: true });
    console.log('Query executed successfully', result); // Add this for debugging
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// API to get all students
app.get('/students', async (req, res) => {
  try {
    console.log('Fetching all students...');
    const result = await executeQuery('SELECT * FROM students');
    console.log('Fetched students:', result.rows); // Log fetched data
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// API to add a new student
app.post('/students', async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    await executeQuery(
      'INSERT INTO students (first_name, last_name, email, phone, enrolled_date) VALUES (:first_name, :last_name, :email, :phone, SYSDATE)',
      { first_name, last_name, email, phone }
    );
    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student' });
  }
});

// API to update a student's information
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;
  try {
    await executeQuery(
      'UPDATE students SET first_name = :first_name, last_name = :last_name, email = :email, phone = :phone WHERE student_id = :id',
      { first_name, last_name, email, phone, id }
    );
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student' });
  }
});

// API to delete a student
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM students WHERE student_id = :id', { id });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
  }
});

// API to search students (by name, email, or phone)
app.get('/students/search', async (req, res) => {
  const { searchQuery } = req.query;

  // If no search query provided, return all students
  if (!searchQuery) {
    return res.json([]);
  }

  try {
    console.log('Searching for students with query:', searchQuery); // Debug search query
    const result = await executeQuery(
      `SELECT * FROM students WHERE LOWER(first_name) LIKE LOWER(:searchQuery) OR LOWER(last_name) LIKE LOWER(:searchQuery) OR LOWER(email) LIKE LOWER(:searchQuery) OR LOWER(phone) LIKE LOWER(:searchQuery)`,
      { searchQuery: `%${searchQuery}%` }
    );
    console.log('Search results:', result.rows); // Log search results
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Error searching students' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
