// categoryRoutes.js
import express from 'express';
import pool from './db.js';  // Import the pool from db.js

const router = express.Router();

// Get All Categories
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Categories');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Category by ID
router.get('/categories/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Categories WHERE category_id = $1', [categoryId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Exporting router as default
export default router;
