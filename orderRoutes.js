// orderRoutes.js
import express from 'express';
import pool from './db.js'; // Assuming db.js uses ES module syntax

const router = express.Router();

// Create a New Order with Order Items
router.post('/orders', async (req, res) => {
    const { user_id, shipping_id, items } = req.body;

    try {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderResult = await pool.query(
            'INSERT INTO Orders (user_id, shipping_id, total_amount) VALUES ($1, $2, $3) RETURNING *',
            [user_id, shipping_id, totalAmount]
        );
        const orderId = orderResult.rows[0].order_id;

        const orderItemsPromises = items.map(item => {
            return pool.query(
                'INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        });
        await Promise.all(orderItemsPromises);

        res.status(201).json({ message: 'Order created successfully', order: orderResult.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Orders
router.get('/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Orders');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Order by ID with Order Items
router.get('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const orderResult = await pool.query('SELECT * FROM Orders WHERE order_id = $1', [orderId]);
        if (orderResult.rows.length > 0) {
            const orderItemsResult = await pool.query('SELECT * FROM OrderItems WHERE order_id = $1', [orderId]);
            res.json({ order: orderResult.rows[0], items: orderItemsResult.rows });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Order Status by ID
router.put('/orders/:id/status', async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Orders SET status = $1 WHERE order_id = $2 RETURNING *',
            [status, orderId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Order by ID (Cascades to OrderItems)
router.delete('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM Orders WHERE order_id = $1 RETURNING *', [orderId]);
        if (result.rows.length > 0) {
            res.json({ message: 'Order deleted successfully', order: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exporting router as default
export default router;
