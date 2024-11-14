// productReviewsRoutes.js
import express from 'express';
import pool from './db.js'; // Import database connection pool

const router = express.Router();

// Create a New Product Review
router.post('/product_reviews', async (req, res) => {
    const { product_id, user_id, rating, comment } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Product_Reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [product_id, user_id, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product review:', error.message);
        res.status(500).json({ error: 'Failed to create product review' });
    }
});

// Get All Product Reviews
router.get('/product_reviews', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Product_Reviews');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving product reviews:', error.message);
        res.status(500).json({ error: 'Failed to retrieve product reviews' });
    }
});

// Get Product Reviews by Product ID
router.get('/product_reviews/product/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const result = await pool.query('SELECT * FROM Product_Reviews WHERE product_id = $1', [productId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving product reviews:', error.message);
        res.status(500).json({ error: 'Failed to retrieve product reviews' });
    }
});

// Update a Product Review by Review ID
router.put('/product_reviews/:id', async (req, res) => {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Product_Reviews SET rating = $1, comment = $2 WHERE review_id = $3 RETURNING *',
            [rating, comment, reviewId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Product review not found' });
        }
    } catch (error) {
        console.error('Error updating product review:', error.message);
        res.status(500).json({ error: 'Failed to update product review' });
    }
});

// Delete a Product Review by Review ID
router.delete('/product_reviews/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM Product_Reviews WHERE review_id = $1 RETURNING *', [reviewId]);
        if (result.rows.length > 0) {
            res.json({ message: 'Product review deleted successfully', review: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Product review not found' });
        }
    } catch (error) {
        console.error('Error deleting product review:', error.message);
        res.status(500).json({ error: 'Failed to delete product review' });
    }
});

// Export the router as default
export default router;
