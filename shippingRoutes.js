// shippingRoutes.js
import express from 'express';
import pool from './db.js'; // Import database connection pool

const router = express.Router();

// Get All Shipping Methods
router.get('/shipping', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Shipping');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Shipping Method by ID
router.get('/shipping/:id', async (req, res) => {
    const shippingId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Shipping WHERE shipping_id = $1', [shippingId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Shipping method not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a New Shipping Entry
router.post('/shipping', async (req, res) => {
    const { order_id, address, city, state, zip, country, cost, estimated_delivery } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Shipping (order_id, address, city, state, zip, country, cost, estimated_delivery) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [order_id, address, city, state, zip, country, cost, estimated_delivery]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding shipping:', error.message);
        res.status(500).json({ error: 'Failed to add shipping information' });
    }
});

// Update an Existing Shipping Entry
router.put('/shipping/:id', async (req, res) => {
    const shippingId = req.params.id;
    const { address, city, state, zip, country, cost, estimated_delivery } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Shipping SET address = $1, city = $2, state = $3, zip = $4, country = $5, cost = $6, estimated_delivery = $7 WHERE shipping_id = $8 RETURNING *',
            [address, city, state, zip, country, cost, estimated_delivery, shippingId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Shipping entry not found' });
        }
    } catch (error) {
        console.error('Error updating shipping:', error.message);
        res.status(500).json({ error: 'Failed to update shipping information' });
    }
});

// Delete a Shipping Entry by ID
router.delete('/shipping/:id', async (req, res) => {
    const shippingId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM Shipping WHERE shipping_id = $1 RETURNING *', [shippingId]);
        if (result.rows.length > 0) {
            res.json({ message: 'Shipping entry deleted successfully', shipping: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Shipping entry not found' });
        }
    } catch (error) {
        console.error('Error deleting shipping:', error.message);
        res.status(500).json({ error: 'Failed to delete shipping information' });
    }
});

// Export the router as default
export default router;
