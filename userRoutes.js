// userRoutes.js
import express from 'express';
import pool from './db.js';  // Import the pool from db.js

const router = express.Router();

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User by ID
router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Users WHERE user_id = $1', [userId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a New User
router.post('/users', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User Information
router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Users SET name = $1, email = $2, password = $3, role = $4 WHERE user_id = $5 RETURNING *',
            [name, email, password, role, userId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete User by ID
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM Users WHERE user_id = $1 RETURNING *', [userId]);
        if (result.rows.length > 0) {
            res.json({ message: 'User deleted successfully', user: result.rows[0] });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exporting router as default
export default router;
