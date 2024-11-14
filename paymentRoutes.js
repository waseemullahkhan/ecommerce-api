// paymentRoutes.js
import express from 'express';
import pool from './db.js'; // Import the database connection pool

const router = express.Router();

// Create a New Payment
router.post('/payments', async (req, res) => {
    const { order_id, amount, payment_method, payment_status, payment_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Payments (order_id, amount, payment_method, payment_status, payment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [order_id, amount, payment_method, payment_status, payment_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating payment:', error.message);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Get All Payments
router.get('/payments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Payments');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving payments:', error.message);
        res.status(500).json({ error: 'Failed to retrieve payments' });
    }
});

// Get Payment by ID
router.get('/payments/:id', async (req, res) => {
    const paymentId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Payments WHERE payment_id = $1', [paymentId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error retrieving payment:', error.message);
        res.status(500).json({ error: 'Failed to retrieve payment' });
    }
});

// Update a Payment by ID
router.put('/payments/:id', async (req, res) => {
    const paymentId = req.params.id;
    const { amount, payment_method, payment_status, payment_date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Payments SET amount = $1, payment_method = $2, payment_status = $3, payment_date = $4 WHERE payment_id = $5 RETURNING *',
            [amount, payment_method, payment_status, payment_date, paymentId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error updating payment:', error.message);
        res.status(500).json({ error: 'Failed to update payment' });
    }
});

// Delete a Payment by ID
router.delete('/payments/:id', async (req, res) => {
    const paymentId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM Payments WHERE payment_id = $1 RETURNING *', [paymentId]);
        if (result.rows.length > 0) {
            res.json({ message: 'Payment deleted successfully', payment: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error deleting payment:', error.message);
        res.status(500).json({ error: 'Failed to delete payment' });
    }
});

// Export the router as default
export default router;
