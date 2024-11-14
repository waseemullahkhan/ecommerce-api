// orderItemsRoutes.js
import express from 'express';
import pool from './db.js'; // Import the database connection pool

const router = express.Router();

// Create a New Order Item
router.post('/order_items', async (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, product_id, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order item:', error.message);
    res.status(500).json({ error: 'Failed to create order item' });
  }
});

// Get All Order Items
router.get('/order_items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Order_Items');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving order items:', error.message);
    res.status(500).json({ error: 'Failed to retrieve order items' });
  }
});

// Get Order Item by ID
router.get('/order_items/:id', async (req, res) => {
  const orderItemId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM Order_Items WHERE order_item_id = $1', [orderItemId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    console.error('Error retrieving order item:', error.message);
    res.status(500).json({ error: 'Failed to retrieve order item' });
  }
});

// Update an Existing Order Item
router.put('/order_items/:id', async (req, res) => {
  const orderItemId = req.params.id;
  const { quantity, price } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Order_Items SET quantity = $1, price = $2 WHERE order_item_id = $3 RETURNING *',
      [quantity, price, orderItemId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    console.error('Error updating order item:', error.message);
    res.status(500).json({ error: 'Failed to update order item' });
  }
});

// Delete an Order Item by ID
router.delete('/order_items/:id', async (req, res) => {
  const orderItemId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM Order_Items WHERE order_item_id = $1 RETURNING *', [orderItemId]);
    if (result.rows.length > 0) {
      res.json({ message: 'Order item deleted successfully', order_item: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    console.error('Error deleting order item:', error.message);
    res.status(500).json({ error: 'Failed to delete order item' });
  }
});

// Export the router as default
export default router;
