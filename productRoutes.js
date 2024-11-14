// productRoutes.js
import express from 'express';
import pool from './db.js'; // Import the database connection pool

const router = express.Router();

// Create a New Product
router.post('/products', async (req, res) => {
    const { name, description, price, category_id, stock, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Products (name, description, price, category_id, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, category_id, stock, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Get All Products
router.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Products');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// Get Product by ID
router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Products WHERE product_id = $1', [productId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error retrieving product:', error.message);
        res.status(500).json({ error: 'Failed to retrieve product' });
    }
});

// Update a Product by ID
router.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category_id, stock, image_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Products SET name = $1, description = $2, price = $3, category_id = $4, stock = $5, image_url = $6 WHERE product_id = $7 RETURNING *',
            [name, description, price, category_id, stock, image_url, productId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a Product by ID
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM Products WHERE product_id = $1 RETURNING *', [productId]);
        if (result.rows.length > 0) {
            res.json({ message: 'Product deleted successfully', product: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Export the router as default
export default router;
